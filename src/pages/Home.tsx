import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Hotel, 
  Tent, 
  Utensils, 
  Map, 
  Car, 
  Camera, 
  Bed, 
  HeartPulse,
  Plane,
  ArrowRight,
  MessageSquare
} from "lucide-react";
import { useState, FormEvent } from "react";

const categories = [
  { id: "Lodges", icon: Bed, color: "bg-orange-100 text-orange-600" },
  { id: "Safari Camps", icon: Tent, color: "bg-green-100 text-green-600" },
  { id: "Restaurants", icon: Utensils, color: "bg-red-100 text-red-600" },
  { id: "Travel & Tours", icon: Map, color: "bg-blue-100 text-blue-600" },
  { id: "Car Rentals", icon: Car, color: "bg-gray-100 text-gray-600" },
  { id: "Experiences", icon: Camera, color: "bg-purple-100 text-purple-600" },
  { id: "Hotels", icon: Hotel, color: "bg-indigo-100 text-indigo-600" },
  { id: "Wellness & Therapy", icon: HeartPulse, color: "bg-pink-100 text-pink-600" },
  { id: "Aviation Tours", icon: Plane, color: "bg-cyan-100 text-cyan-600" },
];

export default function Home() {
  const [feedback, setFeedback] = useState({ name: "", email: "", comment: "" });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmitFeedback = async (e: FormEvent) => {
    e.preventDefault();
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedback),
    });
    setSubmitted(true);
    setFeedback({ name: "", email: "", comment: "" });
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/botswana/1920/1080" 
            alt="Botswana Landscape" 
            className="w-full h-full object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold text-white mb-6"
          >
            TourBots — Discover <br /> Botswana Smarter
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/80 max-w-2xl mx-auto mb-10"
          >
            Your unified platform for exploring the gems of Botswana. From luxury lodges to hidden safari camps.
          </motion.p>
          <Link to="/explore" className="bg-white text-[#5A5A40] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all flex items-center gap-2 mx-auto w-fit">
            Start Exploring <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-serif font-bold text-[#5A5A40] mb-2">Browse by Category</h2>
            <p className="text-gray-500">Find exactly what you're looking for</p>
          </div>
          <Link to="/explore" className="text-[#5A5A40] font-semibold flex items-center gap-1 hover:underline">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
            >
              <Link 
                to={`/explore/${cat.id}`}
                className="group bg-white p-8 rounded-3xl border border-black/5 hover:border-[#5A5A40]/30 hover:shadow-xl transition-all flex flex-col items-center text-center"
              >
                <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <cat.icon size={32} />
                </div>
                <h3 className="font-bold text-gray-800">{cat.id}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-[#5A5A40] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-serif font-bold mb-6">Experience Botswana Like Never Before</h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              TourBots is more than just a directory. It's a smart companion for tourists and a growth engine for local businesses. We connect you directly with the heartbeat of Botswana tourism.
            </p>
            <ul className="space-y-4">
              {["Verified Listings", "Real-time Analytics", "Direct Communication", "Botswana-only Focus"].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <div 
                    onClick={() => item === "Botswana-only Focus" && navigate("/login", { state: { role: "admin" } })}
                    className={`w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs ${item === "Botswana-only Focus" ? "cursor-pointer hover:bg-white/40 transition-colors" : ""}`}
                  >
                    ✓
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://picsum.photos/seed/ele/400/600" alt="Elephant" className="rounded-3xl w-full h-80 object-cover" referrerPolicy="no-referrer" />
            <img src="https://picsum.photos/seed/delta/400/600" alt="Delta" className="rounded-3xl w-full h-80 object-cover mt-8" referrerPolicy="no-referrer" />
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section id="contact" className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="mb-12">
          <div className="w-16 h-16 bg-[#5A5A40]/10 rounded-full flex items-center justify-center text-[#5A5A40] mx-auto mb-6">
            <MessageSquare size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#5A5A40] mb-2">We Value Your Feedback</h2>
          <p className="text-gray-500">Help us improve the TourBots experience for everyone.</p>
        </div>

        {submitted ? (
          <div className="bg-green-50 text-green-700 p-8 rounded-3xl border border-green-100">
            <h3 className="text-xl font-bold mb-2">Thank you!</h3>
            <p>Your feedback has been received and will be reviewed by our team.</p>
            <button onClick={() => setSubmitted(false)} className="mt-4 text-green-800 font-semibold underline">Send another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmitFeedback} className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm text-left">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={feedback.name}
                  onChange={e => setFeedback({...feedback, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A5A40] focus:border-transparent outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={feedback.email}
                  onChange={e => setFeedback({...feedback, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A5A40] focus:border-transparent outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your Comment</label>
              <textarea 
                required
                rows={4}
                value={feedback.comment}
                onChange={e => setFeedback({...feedback, comment: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A5A40] focus:border-transparent outline-none transition-all resize-none"
                placeholder="Tell us what you think..."
              />
            </div>
            <button type="submit" className="w-full bg-[#5A5A40] text-white py-4 rounded-xl font-bold hover:bg-[#4A4A30] transition-colors">
              Submit Feedback
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
