import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("tourbots.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL, -- tourist, business, admin
    country TEXT
  );

  CREATE TABLE IF NOT EXISTS businesses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    region TEXT NOT NULL,
    town TEXT NOT NULL,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    description TEXT,
    package TEXT DEFAULT 'Basic', -- Basic, Standard, Premium
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    certificateUrl TEXT,
    paymentProofUrl TEXT,
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    businessId INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    region TEXT NOT NULL,
    town TEXT NOT NULL,
    image TEXT,
    rating REAL DEFAULT 0,
    reviewCount INTEGER DEFAULT 0,
    FOREIGN KEY (businessId) REFERENCES businesses(id)
  );

  CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listingId INTEGER,
    businessId INTEGER,
    userId INTEGER,
    type TEXT NOT NULL, -- view, save, inquiry, call, whatsapp, email, booking_click, search
    metadata TEXT, -- JSON string for origin, search query, etc.
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listingId) REFERENCES listings(id),
    FOREIGN KEY (businessId) REFERENCES businesses(id),
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS search_queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    query TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS saved_listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    listingId INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(userId, listingId),
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (listingId) REFERENCES listings(id)
  );

  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    comment TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listingId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    rating INTEGER,
    comment TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listingId) REFERENCES listings(id),
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);

// Seed Admin if not exists
const admin = db.prepare("SELECT * FROM users WHERE role = 'admin'").get();
if (!admin) {
  db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
    "Admin",
    "admin@tourbots.bw",
    "admin123",
    "admin"
  );
}

// Seed some initial listings for Botswana
const existingListings = db.prepare("SELECT COUNT(*) as count FROM listings").get() as { count: number };
if (existingListings.count === 0) {
  const seedListings = [
    { name: "Chobe Game Lodge", category: "Lodges", region: "Chobe", town: "Kasane", description: "Luxury lodge in Chobe National Park." },
    { name: "Okavango Delta Safari", category: "Safari Camps", region: "North-West", town: "Maun", description: "Authentic safari experience." },
    { name: "Gaborone Sun", category: "Hotels", region: "South-East", town: "Gaborone", description: "Premier hotel in the capital." },
    { name: "Sanctuary Baines' Camp", category: "Safari Camps", region: "North-West", town: "Maun", description: "Eco-friendly camp on the Boro River." },
    { name: "The Beef Baron", category: "Restaurants", region: "South-East", town: "Gaborone", description: "Famous steakhouse in Gaborone." },
  ];

  // We need a business for these listings
  const adminUser = db.prepare("SELECT id FROM users WHERE role = 'admin'").get() as { id: number };
  const bizId = db.prepare("INSERT INTO businesses (userId, name, category, region, town, status) VALUES (?, ?, ?, ?, ?, ?)").run(
    adminUser.id, "TourBots Official", "Travel & Tours", "South-East", "Gaborone", "approved"
  ).lastInsertRowid;

  for (const l of seedListings) {
    const listingId = db.prepare("INSERT INTO listings (businessId, name, category, region, town, description, image) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
      bizId, l.name, l.category, l.region, l.town, l.description, `https://picsum.photos/seed/${l.name.replace(/\s/g, '')}/800/600`
    ).lastInsertRowid;

    // Seed some analytics for each listing
    const types = ['view', 'save', 'inquiry', 'call', 'whatsapp', 'email', 'booking_click'];
    for (let i = 0; i < 50; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const daysAgo = Math.floor(Math.random() * 30);
      db.prepare(`
        INSERT INTO analytics (listingId, businessId, type, timestamp) 
        VALUES (?, ?, ?, datetime('now', '-${daysAgo} days'))
      `).run(listingId, bizId, type);
    }
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.post("/api/auth/login", (req, res) => {
    const { email, password, role } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ? AND role = ?").get(email, password, role) as any;
    if (user) {
      if (role === 'business') {
        const business = db.prepare("SELECT * FROM businesses WHERE userId = ?").get(user.id) as any;
        return res.json({ user, business });
      }
      res.json({ user });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    const { name, email, password, role, country } = req.body;
    try {
      const result = db.prepare("INSERT INTO users (name, email, password, role, country) VALUES (?, ?, ?, ?, ?)").run(
        name, email, password, role, country || null
      );
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
      res.json({ user });
    } catch (e: any) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.get("/api/listings", (req, res) => {
    const listings = db.prepare(`
      SELECT l.*, b.status as businessStatus 
      FROM listings l 
      JOIN businesses b ON l.businessId = b.id 
      WHERE b.status = 'approved'
    `).all();
    res.json(listings);
  });

  app.get("/api/listings/:id", (req, res) => {
    const listing = db.prepare("SELECT * FROM listings WHERE id = ?").get(req.params.id);
    res.json(listing);
  });

  app.post("/api/analytics/track", (req, res) => {
    const { listingId, businessId, userId, type, metadata } = req.body;
    db.prepare(`
      INSERT INTO analytics (listingId, businessId, userId, type, metadata) 
      VALUES (?, ?, ?, ?, ?)
    `).run(listingId || null, businessId || null, userId || null, type, JSON.stringify(metadata || {}));
    res.json({ success: true });
  });

  app.get("/api/weather/:location", (req, res) => {
    // Mock weather data for Botswana locations
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

  app.post("/api/planner/generate", (req, res) => {
    const { days, budget, interests } = req.body;
    const listings = db.prepare(`
      SELECT l.* FROM listings l 
      JOIN businesses b ON l.businessId = b.id 
      WHERE b.status = 'approved'
    `).all() as any[];
    
    const itineraryDays = [];
    const recommendations = [
      "Early morning game drives offer the best visibility for predators.",
      "Always carry enough water and sun protection during outdoor activities.",
      "The Okavango Delta is best explored by Mokoro (traditional canoe).",
      "Chobe is famous for its massive elephant herds, especially near the river.",
      "Gaborone's food scene is vibrant; try the local Seswaa dish."
    ];

    for (let i = 1; i <= days; i++) {
      const dayListings = listings.sort(() => 0.5 - Math.random()).slice(0, 2);
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

  app.get("/api/tourist/saved/:userId", (req, res) => {
    const saved = db.prepare(`
      SELECT l.* 
      FROM listings l 
      JOIN saved_listings s ON l.id = s.listingId 
      WHERE s.userId = ?
    `).all(req.params.userId);
    res.json(saved);
  });

  app.get("/api/tourist/searches/:userId", (req, res) => {
    const searches = db.prepare(`
      SELECT query, timestamp 
      FROM search_queries 
      WHERE userId = ? 
      ORDER BY timestamp DESC 
      LIMIT 10
    `).all(req.params.userId);
    res.json(searches);
  });

  app.get("/api/business/stats/:businessId", (req, res) => {
    const bId = req.params.businessId;
    
    // Profile Views
    const views = db.prepare(`
      SELECT COUNT(*) as count, strftime('%Y-%m-%d', timestamp) as date 
      FROM analytics 
      WHERE businessId = ? AND type = 'view'
      GROUP BY date
    `).all(bId);

    // Contact Interactions
    const contacts = db.prepare(`
      SELECT type, COUNT(*) as count 
      FROM analytics 
      WHERE businessId = ? AND type IN ('call', 'whatsapp', 'email')
      GROUP BY type
    `).all(bId);

    // Inquiries
    const inquiries = db.prepare(`
      SELECT COUNT(*) as count, strftime('%Y-%m-%d', timestamp) as date 
      FROM analytics 
      WHERE businessId = ? AND type = 'inquiry'
      GROUP BY date
    `).all(bId);

    // Origin (Mocked based on metadata if exists, otherwise random for demo)
    const origins = [
      { name: 'Botswana', value: 45 },
      { name: 'South Africa', value: 25 },
      { name: 'USA', value: 15 },
      { name: 'UK', value: 10 },
      { name: 'Germany', value: 5 },
    ];

    // Performance Score
    const score = 85; // Mocked score

    res.json({ views, contacts, inquiries, origins, score });
  });

  app.get("/api/admin/stats", (req, res) => {
    const businesses = db.prepare("SELECT status, COUNT(*) as count FROM businesses GROUP BY status").all();
    const categories = db.prepare("SELECT category, COUNT(*) as count FROM businesses GROUP BY category").all();
    const interactions = db.prepare("SELECT type, COUNT(*) as count FROM analytics GROUP BY type").all();
    const growth = db.prepare(`
      SELECT COUNT(*) as count, strftime('%Y-%m', timestamp) as month 
      FROM users 
      GROUP BY month
    `).all();

    res.json({ businesses, categories, interactions, growth });
  });

  app.post("/api/feedback", (req, res) => {
    const { name, email, comment } = req.body;
    db.prepare("INSERT INTO feedback (name, email, comment) VALUES (?, ?, ?)").run(name, email, comment);
    res.json({ success: true });
  });

  app.post("/api/business/register", (req, res) => {
    const { userId, name, category, region, town, phone, whatsapp, email, description, package: pkg, certificateUrl, paymentProofUrl } = req.body;
    const result = db.prepare(`
      INSERT INTO businesses (userId, name, category, region, town, phone, whatsapp, email, description, package, certificateUrl, paymentProofUrl, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(userId, name, category, region, town, phone, whatsapp, email, description, pkg, certificateUrl, paymentProofUrl || null);
    res.json({ success: true, businessId: result.lastInsertRowid });
  });

  app.get("/api/admin/registrations", (req, res) => {
    const registrations = db.prepare(`
      SELECT b.*, u.name as ownerName, u.email as ownerEmail 
      FROM businesses b 
      JOIN users u ON b.userId = u.id 
      WHERE b.status = 'pending'
    `).all();
    res.json(registrations);
  });

  app.post("/api/admin/approve", (req, res) => {
    const { businessId, status } = req.body; // status: approved or rejected
    db.prepare("UPDATE businesses SET status = ? WHERE id = ?").run(status, businessId);
    res.json({ success: true });
  });

  app.get("/api/business/analytics/:businessId", (req, res) => {
    const stats = db.prepare(`
      SELECT type, COUNT(*) as count, strftime('%Y-%m-%d', timestamp) as date
      FROM analytics a
      JOIN listings l ON a.listingId = l.id
      WHERE l.businessId = ?
      GROUP BY type, date
    `).all(req.params.businessId);
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
