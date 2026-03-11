import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://xzmhcqatlqkknlfqyjob.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get("/api/listings", async (req, res) => {
    const { data, error } = await supabase
      .from("listings")
      .select("*, businesses!inner(status)")
      .eq("businesses.status", "approved");
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.get("/api/listings/:id", async (req, res) => {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", req.params.id)
      .single();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/analytics/track", async (req, res) => {
    const { listingId, businessId, userId, type, metadata } = req.body;
    const { error } = await supabase
      .from("analytics")
      .insert({
        listing_id: listingId || null,
        business_id: businessId || null,
        user_id: userId || null,
        type,
        metadata: metadata || {}
      });
    
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.get("/api/weather/:location", (req, res) => {
    const locations: Record<string, any> = {
      "Gaborone": { temp: 28, condition: "Sunny", icon: "Sun", seasonal: "Good for city tours" },
      "Maun": { temp: 32, condition: "Sunny", icon: "Sun", seasonal: "Peak Safari Season" },
      "Kasane": { temp: 30, condition: "Partly Cloudy", icon: "CloudSun", seasonal: "Great for river cruises" },
      "Francistown": { temp: 27, condition: "Clear", icon: "Sun", seasonal: "Mild weather" },
      "Default": { temp: 25, condition: "Clear", icon: "Sun", seasonal: "Pleasant conditions" }
    };
    const data = locations[req.params.location] || locations["Default"];
    res.json(data);
  });

  app.post("/api/planner/generate", async (req, res) => {
    const { days, budget, interests } = req.body;
    const { data: listings, error } = await supabase
      .from("listings")
      .select("*, businesses!inner(status)")
      .eq("businesses.status", "approved");
    
    if (error) return res.status(500).json({ error: error.message });
    
    const itineraryDays = [];
    const recommendations = [
      "Early morning game drives offer the best visibility for predators.",
      "Always carry enough water and sun protection during outdoor activities.",
      "The Okavango Delta is best explored by Mokoro (traditional canoe).",
      "Chobe is famous for its massive elephant herds, especially near the river.",
      "Gaborone's food scene is vibrant; try the local Seswaa dish."
    ];

    for (let i = 1; i <= days; i++) {
      const dayListings = (listings || []).sort(() => 0.5 - Math.random()).slice(0, 2);
      itineraryDays.push({
        day: i,
        activities: [
          {
            time: "08:00 AM",
            title: dayListings[0]?.name || "Morning Exploration",
            description: `Start your day at ${dayListings[0]?.name || "a local attraction"} in ${dayListings[0]?.town || "the area"}.`
          },
          {
            time: "02:00 PM",
            title: dayListings[1]?.name || "Afternoon Adventure",
            description: `Continue your journey at ${dayListings[1]?.name || "another great spot"} in ${dayListings[1]?.town || "the region"}.`
          }
        ]
      });
    }
    res.json({ 
      days: itineraryDays, 
      recommendation: recommendations[Math.floor(Math.random() * recommendations.length)] 
    });
  });

  app.get("/api/tourist/saved/:userId", async (req, res) => {
    const { data, error } = await supabase
      .from("saved_listings")
      .select("listings(*)")
      .eq("user_id", req.params.userId);
    
    if (error) return res.status(500).json({ error: error.message });
    res.json((data || []).map(d => d.listings));
  });

  app.get("/api/tourist/searches/:userId", async (req, res) => {
    const { data, error } = await supabase
      .from("search_queries")
      .select("query, timestamp")
      .eq("user_id", req.params.userId)
      .order("timestamp", { ascending: false })
      .limit(10);
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.get("/api/business/stats/:businessId", async (req, res) => {
    const bId = req.params.businessId;
    
    // Profile Views
    const { data: viewsData, error: viewsError } = await supabase
      .from("analytics")
      .select("timestamp")
      .eq("business_id", bId)
      .eq("type", "view");

    // Contact Interactions
    const { data: contactsData, error: contactsError } = await supabase
      .from("analytics")
      .select("type")
      .eq("business_id", bId)
      .in("type", ["call", "whatsapp", "email"]);

    // Inquiries
    const { data: inquiriesData, error: inquiriesError } = await supabase
      .from("analytics")
      .select("timestamp")
      .eq("business_id", bId)
      .eq("type", "inquiry");

    if (viewsError || contactsError || inquiriesError) {
      return res.status(500).json({ error: "Failed to fetch stats" });
    }

    // Process views by date
    const viewsMap: Record<string, number> = {};
    viewsData?.forEach(v => {
      const date = new Date(v.timestamp).toISOString().split('T')[0];
      viewsMap[date] = (viewsMap[date] || 0) + 1;
    });
    const views = Object.entries(viewsMap).map(([date, count]) => ({ date, count }));

    // Process contacts by type
    const contactsMap: Record<string, number> = {};
    contactsData?.forEach(c => {
      contactsMap[c.type] = (contactsMap[c.type] || 0) + 1;
    });
    const contacts = Object.entries(contactsMap).map(([type, count]) => ({ type, count }));

    // Process inquiries by date
    const inquiriesMap: Record<string, number> = {};
    inquiriesData?.forEach(i => {
      const date = new Date(i.timestamp).toISOString().split('T')[0];
      inquiriesMap[date] = (inquiriesMap[date] || 0) + 1;
    });
    const inquiries = Object.entries(inquiriesMap).map(([date, count]) => ({ date, count }));

    const origins = [
      { name: 'Botswana', value: 45 },
      { name: 'South Africa', value: 25 },
      { name: 'USA', value: 15 },
      { name: 'UK', value: 10 },
      { name: 'Germany', value: 5 },
    ];

    res.json({ views, contacts, inquiries, origins, score: 85 });
  });

  app.get("/api/admin/stats", async (req, res) => {
    const { data: businessesData } = await supabase.from("businesses").select("status");
    const { data: categoriesData } = await supabase.from("businesses").select("category");
    const { data: interactionsData } = await supabase.from("analytics").select("type");
    const { data: growthData } = await supabase.from("profiles").select("created_at");

    const businesses: any[] = [];
    const statuses = ['pending', 'approved', 'rejected'];
    statuses.forEach(s => {
      businesses.push({ status: s, count: businessesData?.filter(b => b.status === s).length || 0 });
    });

    const categoriesMap: Record<string, number> = {};
    categoriesData?.forEach(c => {
      categoriesMap[c.category] = (categoriesMap[c.category] || 0) + 1;
    });
    const categories = Object.entries(categoriesMap).map(([category, count]) => ({ category, count }));

    const interactionsMap: Record<string, number> = {};
    interactionsData?.forEach(i => {
      interactionsMap[i.type] = (interactionsMap[i.type] || 0) + 1;
    });
    const interactions = Object.entries(interactionsMap).map(([type, count]) => ({ type, count }));

    const growthMap: Record<string, number> = {};
    growthData?.forEach(g => {
      const month = new Date(g.created_at).toISOString().slice(0, 7);
      growthMap[month] = (growthMap[month] || 0) + 1;
    });
    const growth = Object.entries(growthMap).map(([month, count]) => ({ month, count }));

    res.json({ businesses, categories, interactions, growth });
  });

  app.post("/api/feedback", async (req, res) => {
    const { name, email, comment } = req.body;
    const { error } = await supabase.from("feedback").insert({ name, email, comment });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.post("/api/business/register", async (req, res) => {
    const { userId, name, category, region, town, phone, whatsapp, email, description, package: pkg, certificateUrl, paymentProofUrl } = req.body;
    const { data, error } = await supabase
      .from("businesses")
      .insert({
        user_id: userId,
        name,
        category,
        region,
        town,
        phone,
        whatsapp,
        email,
        description,
        package: pkg,
        certificate_url: certificateUrl,
        payment_proof_url: paymentProofUrl || null,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, businessId: data.id });
  });

  app.get("/api/admin/registrations", async (req, res) => {
    const { data, error } = await supabase
      .from("businesses")
      .select("*, profiles!inner(name, email)")
      .eq("status", "pending");
    
    if (error) return res.status(500).json({ error: error.message });
    
    const registrations = (data || []).map(b => ({
      ...b,
      ownerName: b.profiles.name,
      ownerEmail: b.profiles.email
    }));
    
    res.json(registrations);
  });

  app.post("/api/admin/approve", async (req, res) => {
    const { businessId, status } = req.body;
    const { error } = await supabase
      .from("businesses")
      .update({ status })
      .eq("id", businessId);
    
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.get("/api/business/analytics/:businessId", async (req, res) => {
    const { data, error } = await supabase
      .from("analytics")
      .select("type, timestamp, listings!inner(business_id)")
      .eq("listings.business_id", req.params.businessId);
    
    if (error) return res.status(500).json({ error: error.message });
    
    const stats = (data || []).map(d => ({
      type: d.type,
      date: new Date(d.timestamp).toISOString().split('T')[0]
    }));
    
    res.json(stats);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
