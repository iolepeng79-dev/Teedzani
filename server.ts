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
      .from("profiles")
      .select("*")
      .eq("role", "business")
      .eq("status", "approved");
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.get("/api/listings/:id", async (req, res) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", req.params.id)
      .single();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/analytics/track", async (req, res) => {
    const { profileId, type } = req.body;
    const { error } = await supabase
      .from("interactions")
      .insert({
        profile_id: profileId,
        type
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

  app.get("/api/business/stats/:userId", async (req, res) => {
    const userId = req.params.userId;
    
    // Interactions
    const { data: interactionsData, error: interactionsError } = await supabase
      .from("interactions")
      .select("*")
      .eq("profile_id", userId);

    // Reviews
    const { data: reviewsData, error: reviewsError } = await supabase
      .from("reviews")
      .select("*")
      .eq("profile_id", userId);

    if (interactionsError || reviewsError) {
      return res.status(500).json({ error: "Failed to fetch stats" });
    }

    // Process interactions by date
    const viewsMap: Record<string, number> = {};
    const contactsMap: Record<string, number> = {};
    
    interactionsData?.forEach(i => {
      const date = new Date(i.timestamp).toISOString().split('T')[0];
      if (i.type === 'booking') {
        viewsMap[date] = (viewsMap[date] || 0) + 1;
      } else {
        contactsMap[i.type] = (contactsMap[i.type] || 0) + 1;
      }
    });

    const views = Object.entries(viewsMap).map(([date, count]) => ({ date, count }));
    const contacts = Object.entries(contactsMap).map(([type, count]) => ({ type, count }));
    
    // If no data, provide some dummy data for visualization
    if (views.length === 0) {
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        views.push({ date: d.toISOString().split('T')[0], count: Math.floor(Math.random() * 20) + 5 });
      }
    }

    const origins = [
      { name: 'Botswana', value: 45 },
      { name: 'South Africa', value: 25 },
      { name: 'USA', value: 15 },
      { name: 'UK', value: 10 },
      { name: 'Germany', value: 5 },
    ];

    res.json({ views, contacts, inquiries: views, origins, score: 85 });
  });

  app.get("/api/admin/stats", async (req, res) => {
    const { data: profilesData } = await supabase.from("profiles").select("status, role, category, region");
    const { data: interactionsData } = await supabase.from("interactions").select("type");

    const businesses = [
      { status: 'pending', count: profilesData?.filter(p => p.role === 'business' && p.status === 'pending').length || 0 },
      { status: 'approved', count: profilesData?.filter(p => p.role === 'business' && p.status === 'approved').length || 0 },
      { status: 'rejected', count: profilesData?.filter(p => p.role === 'business' && p.status === 'rejected').length || 0 },
    ];

    const categoriesMap: Record<string, number> = {};
    profilesData?.filter(p => p.role === 'business').forEach(p => {
      if (p.category) categoriesMap[p.category] = (categoriesMap[p.category] || 0) + 1;
    });
    const categories = Object.entries(categoriesMap).map(([category, count]) => ({ category, count }));

    const interactionsMap: Record<string, number> = {};
    interactionsData?.forEach(i => {
      interactionsMap[i.type] = (interactionsMap[i.type] || 0) + 1;
    });
    const interactions = Object.entries(interactionsMap).map(([type, count]) => ({ type, count }));

    res.json({ businesses, categories, interactions, growth: [], intelligence: {} });
  });

  app.get("/api/admin/registrations", async (req, res) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "business")
      .eq("status", "pending");
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post("/api/admin/approve", async (req, res) => {
    const { profileId, status } = req.body;
    const { error } = await supabase
      .from("profiles")
      .update({ status })
      .eq("id", profileId);
    
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // Vite middleware for development
  const isDev = process.env.NODE_ENV !== "production";
  console.log(`Starting server in ${isDev ? 'development' : 'production'} mode`);

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
