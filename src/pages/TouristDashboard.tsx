import { useState, useEffect } from "react";
import { useAuth } from "../App";
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
  Search,
  Bookmark,
  History,
  Settings,
  Heart,
  MapPin,
  Star,
  ChevronRight,
  Sparkles,
  Compass
} from "lucide-react";
import { Link } from "react-router-dom";
import SmartTripPlanner from "../components/SmartTripPlanner";

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

export default function TouristDashboard() {
  const { user } = useAuth();
  const [savedListings, setSavedListings] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      Promise.all([
        fetch(`/api/tourist/saved/${user.id}`).then(res => res.json()),
        fetch(`/api/tourist/searches/${user.id}`).then(res => res.json())
      ]).then(([saved, searches]) => {
        setSavedListings(saved);
        setRecentSearches(searches);
        setLoading(false);
      });
    }
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-serif font-bold text-[#5A5A40] mb-2"
          >
            Dumela, {user?.name}!
          </motion.h1>
          <p className="text-gray-500">Your personal gateway to Botswana's finest experiences.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white border border-black/5 px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-all">
            <Settings size={18} />
            Profile Settings
          </button>
          <Link to="/explore" className="bg-[#5A5A40] text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/20">
            <Compass size={18} />
            Explore More
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Categories */}
          <section>
            <h2 className="text-xl font-bold mb-6 text-gray-800">Explore by Category</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              {categories.map((cat) => (
                <Link 
                  key={cat.id} 
                  to={`/explore/${cat.id}`}
                  className="bg-white p-4 rounded-3xl border border-black/5 hover:border-[#5A5A40]/30 hover:shadow-lg transition-all flex flex-col items-center text-center group"
                >
                  <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    <cat.icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">{cat.id}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Saved Places */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-gray-800 flex items-center gap-2">
                <Heart size={24} className="text-red-500 fill-red-500" />
                Saved Places
              </h2>
              <button className="text-sm font-bold text-[#5A5A40] hover:underline">View All</button>
            </div>
            
            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                  <div key={i} className="bg-gray-100 h-48 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : savedListings.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {savedListings.map((listing) => (
                  <motion.div 
                    key={listing.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-3xl border border-black/5 overflow-hidden shadow-sm group"
                  >
                    <div className="relative h-40">
                      <img 
                        src={listing.image || `https://picsum.photos/seed/${listing.id}/800/600`} 
                        alt={listing.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full text-red-500">
                        <Heart size={16} fill="currentColor" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-gray-800 mb-1">{listing.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                        <MapPin size={12} />
                        <span>{listing.town}, {listing.region}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-amber-500 fill-amber-500" />
                          <span className="text-xs font-bold">{listing.rating || "4.8"}</span>
                        </div>
                        <Link to={`/listing/${listing.id}`} className="text-xs font-bold text-[#5A5A40] uppercase tracking-widest flex items-center gap-1">
                          Details <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[40px] border border-dashed border-gray-200 text-center">
                <p className="text-gray-400 font-bold">No saved places yet. Start exploring!</p>
              </div>
            )}
          </section>

          {/* Recent Searches */}
          <section>
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <History size={20} className="text-gray-400" />
              Recent Searches
            </h2>
            <div className="flex flex-wrap gap-3">
              {recentSearches.length > 0 ? recentSearches.map((search, idx) => (
                <button 
                  key={idx}
                  className="bg-white border border-black/5 px-6 py-3 rounded-2xl text-sm font-medium text-gray-600 hover:border-[#5A5A40] hover:text-[#5A5A40] transition-all flex items-center gap-2"
                >
                  <Search size={14} />
                  {search.query}
                </button>
              )) : (
                <p className="text-gray-400 text-sm">Your search history will appear here.</p>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-12">
          <SmartTripPlanner />

          <div className="bg-[#5A5A40] p-8 rounded-[40px] text-white">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="text-amber-400" />
              Tourism Insights
            </h3>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              Based on your interests, we recommend visiting the Okavango Delta between June and August for peak wildlife viewing.
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Live Condition</p>
                <p className="text-sm font-bold">Chobe: High Elephant Activity</p>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Crowd Level</p>
                <p className="text-sm font-bold">Maun: Moderate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
