import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  MessageCircle, 
  Calendar, 
  Bookmark, 
  Share2,
  ChevronLeft,
  ExternalLink,
  CloudSun
} from "lucide-react";
import { motion } from "motion/react";
import WeatherCard from "../components/WeatherCard";
import SafariIntelligence from "../components/SafariIntelligence";
import { useAuth } from "../App";

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then(res => res.json())
      .then(data => {
        setListing(data);
        setLoading(false);
        // Track view
        trackAction("view", { origin: user?.country || "Unknown" });
      });
  }, [id]);

  const trackAction = (type: string, metadata: any = {}) => {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        listingId: id, 
        businessId: listing?.businessId,
        userId: user?.id,
        type,
        metadata
      }),
    });
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading...</div>;
  if (!listing) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Listing not found</div>;

  const name = listing.name || listing.title || "Untitled Listing";
  const town = listing.town || listing.location || "Unknown Location";
  const image = listing.image || listing.image_url || `https://picsum.photos/seed/${listing.id}/1200/800`;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + " " + town + " Botswana")}`;

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white border-b border-black/5 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 font-medium hover:text-[#5A5A40]">
            <ChevronLeft size={20} />
            Back to Explore
          </button>
          <div className="flex items-center gap-4">
            <button onClick={() => trackAction('save')} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Bookmark size={20} /></button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Share2 size={20} /></button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="md:col-span-2">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl overflow-hidden mb-8 aspect-video"
          >
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <div className="mb-8">
            <div className="flex items-center gap-2 text-[#5A5A40] font-bold uppercase tracking-widest text-xs mb-2">
              <span>{listing.category}</span>
              <span>•</span>
              <span>{listing.region}</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">{name}</h1>
            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin size={18} className="text-[#5A5A40]" />
                <span>{town}, Botswana</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={18} className="text-amber-500 fill-amber-500" />
                <span className="font-bold text-gray-900">{listing.rating || "4.5"}</span>
                <span className="text-sm">({listing.reviewCount || "12"} reviews)</span>
              </div>
            </div>
          </div>

          <div className="prose prose-stone max-w-none mb-12">
            <h3 className="text-xl font-bold mb-4">Description</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {listing.description || "Welcome to one of Botswana's premier destinations. We offer a unique blend of local culture and modern comfort, ensuring your stay is both authentic and relaxing. Our dedicated team is here to provide you with the best experience possible."}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: "Free Wifi", icon: "📶" },
              { label: "Parking", icon: "🚗" },
              { label: "Restaurant", icon: "🍽️" },
              { label: "Pool", icon: "🏊" }
            ].map(item => (
              <div key={item.label} className="bg-white p-4 rounded-2xl border border-black/5 flex flex-col items-center gap-2">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-bold text-gray-500 uppercase">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mb-12">
            <SafariIntelligence />
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="sticky top-36 space-y-6">
            <WeatherCard location={listing.town} />
            
            <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-xl">
              <h3 className="text-xl font-bold mb-6">Contact & Booking</h3>
              
              <div className="space-y-4 mb-8">
                <button 
                  onClick={() => trackAction('whatsapp')}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-[#5A5A40] hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                      <MessageCircle size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold">WhatsApp</p>
                      <p className="text-xs text-gray-500">Instant Chat</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-300 group-hover:text-[#5A5A40]" />
                </button>

                <button 
                  onClick={() => trackAction('call')}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-[#5A5A40] hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                      <Phone size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold">Call Now</p>
                      <p className="text-xs text-gray-500">+267 71 234 567</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-300 group-hover:text-[#5A5A40]" />
                </button>

                <button 
                  onClick={() => trackAction('email')}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-[#5A5A40] hover:bg-gray-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                      <Mail size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold">Email</p>
                      <p className="text-xs text-gray-500">Send a message</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-300 group-hover:text-[#5A5A40]" />
                </button>
              </div>

              <button 
                onClick={() => trackAction('booking_click')}
                className="w-full bg-[#5A5A40] text-white py-4 rounded-2xl font-bold mb-4 hover:bg-[#4A4A30] transition-all flex items-center justify-center gap-2"
              >
                <Calendar size={20} />
                Book Now
              </button>

              <a 
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAction('click', { target: 'google_maps' })}
                className="w-full bg-gray-100 text-gray-800 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <MapPin size={20} />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
