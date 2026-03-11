import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { Search, Filter, MapPin, Star, Heart, ChevronRight, Phone, MessageSquare, Mail, Cloud, Sun, CloudRain } from 'lucide-react';
import { Link } from 'react-router-dom';
import WeatherWidget from '../components/WeatherWidget';

const CATEGORIES = ['All', 'Lodges', 'Safari Camps', 'Restaurants', 'Tour Operators', 'Car Rentals', 'Craft Shops'];

export default function TouristDashboard() {
  const { user, profile } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'business')
      .eq('status', 'approved');

    if (!error) setListings(data || []);
    setLoading(false);
  };

  const filteredListings = listings.filter(l => {
    const matchesSearch = l.business_name.toLowerCase().includes(search.toLowerCase()) || 
                         l.town.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || l.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const trackInteraction = async (businessId: string, type: 'call' | 'whatsapp' | 'email') => {
    await supabase.from('interactions').insert({
      profile_id: businessId,
      type: type
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#5A5A40] mb-2">Explore Botswana</h1>
          <p className="text-gray-500">Discover the best places to visit, stay, and eat.</p>
        </div>
        <WeatherWidget lat={-24.6282} lng={25.9231} /> {/* Default to Gaborone */}
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
          {CATEGORIES.map(cat => (
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

      {/* Listings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white h-80 rounded-3xl animate-pulse border border-black/5"></div>
          ))}
        </div>
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredListings.map((listing, idx) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white rounded-[40px] border border-black/5 overflow-hidden hover:shadow-2xl transition-all"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${listing.id}/800/600`} 
                  alt={listing.business_name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#5A5A40]">
                  {listing.category}
                </div>
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                  <Heart size={20} />
                </button>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{listing.business_name}</h3>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star size={16} fill="currentColor" />
                    <span>4.8</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
                  <MapPin size={14} />
                  <span>{listing.town}, {listing.region}</span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-8">
                  {listing.description}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-black/5">
                  <div className="flex gap-2">
                    <a 
                      href={`tel:${listing.phone}`}
                      onClick={() => trackInteraction(listing.id, 'call')}
                      className="p-3 bg-gray-50 text-gray-400 hover:text-[#5A5A40] hover:bg-[#5A5A40]/10 rounded-xl transition-all"
                    >
                      <Phone size={18} />
                    </a>
                    <a 
                      href={`https://wa.me/${listing.whatsapp}`}
                      onClick={() => trackInteraction(listing.id, 'whatsapp')}
                      className="p-3 bg-gray-50 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                    >
                      <MessageSquare size={18} />
                    </a>
                    <a 
                      href={`mailto:${listing.email}`}
                      onClick={() => trackInteraction(listing.id, 'email')}
                      className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Mail size={18} />
                    </a>
                  </div>
                  <Link 
                    to={`/listing/${listing.id}`}
                    className="text-[#5A5A40] font-bold text-sm group-hover:underline flex items-center gap-1"
                  >
                    View Details
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
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
