import { Link } from "react-router-dom";
import { MapPin, Star, Heart } from "lucide-react";
import { motion } from "motion/react";

export default function ListingCard({ listing }: { listing: any }) {
  const trackClick = () => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: listing.id, type: "click" }),
    });
  };

  const name = listing.name || listing.title || "Untitled Listing";
  const town = listing.town || listing.location || "Unknown Location";
  const image = listing.image || listing.image_url || `https://picsum.photos/seed/${listing.id}/800/600`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-3xl border border-black/5 overflow-hidden hover:shadow-2xl transition-all"
    >
      <Link to={`/listing/${listing.id}`} onClick={trackClick}>
        <div className="relative h-56 overflow-hidden">
          <img 
            src={image} 
            alt={name} 
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
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{name}</h3>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star size={16} fill="currentColor" />
              <span>{listing.rating || "4.5"}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
            <MapPin size={14} />
            <span>{town}{listing.region ? `, ${listing.region}` : ""}</span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 mb-6">
            {listing.description || "Experience the best of Botswana at this amazing location. Perfect for travelers seeking authenticity."}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-black/5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{listing.reviewCount || "12"} Reviews</span>
            <span className="text-[#5A5A40] font-bold text-sm group-hover:underline">View Details</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
