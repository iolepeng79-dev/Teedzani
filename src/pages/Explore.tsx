import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Search, Filter, MapPin, Star } from "lucide-react";
import ListingCard from "../components/ListingCard";
import { useAuth } from "../App";

export default function Explore() {
  const { category } = useParams();
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "All");

  const categories = [
    "All", "Lodges", "Safari Camps", "Restaurants", "Travel & Tours", "Car Rentals", "Experiences", "Hotels", "Wellness & Therapy", "Aviation Tours"
  ];

  useEffect(() => {
    fetch("/api/listings")
      .then(res => res.json())
      .then(data => {
        setListings(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (search.length > 3) {
      const timer = setTimeout(() => {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?.id,
            type: "search",
            metadata: { query: search }
          })
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [search, user]);

  const filteredListings = listings.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || 
                         l.town.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || l.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-[#5A5A40] mb-4">Explore Botswana</h1>
        <p className="text-gray-500">Discover the best places to visit, stay, and eat.</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-white shadow-sm focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-6 py-4 rounded-2xl text-sm font-semibold transition-all ${
                selectedCategory === cat 
                ? "bg-[#5A5A40] text-white shadow-lg" 
                : "bg-white text-gray-600 border border-black/5 hover:border-[#5A5A40]/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white h-80 rounded-3xl animate-pulse border border-black/5"></div>
          ))}
        </div>
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredListings.map(listing => (
            <div key={listing.id}>
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
            <Search size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No listings found</h3>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
