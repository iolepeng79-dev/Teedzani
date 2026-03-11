import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { 
  MapPin, Star, Phone, MessageSquare, Mail, ChevronLeft, 
  Share2, Bookmark, Globe, Calendar, Info, ShieldCheck 
} from 'lucide-react';
import WeatherWidget from '../components/WeatherWidget';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (!error) setListing(data);
    setLoading(false);
  };

  const trackAction = async (type: 'call' | 'whatsapp' | 'email' | 'save') => {
    await supabase.from('interactions').insert({
      profile_id: id,
      type: type
    });
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading...</div>;
  if (!listing) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Listing not found</div>;

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
              src={`https://picsum.photos/seed/${listing.id}/1200/800`} 
              alt={listing.business_name} 
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
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">{listing.business_name}</h1>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{listing.town}, {listing.region}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={16} className="text-amber-500" fill="currentColor" />
                <span className="font-bold text-gray-900">4.8</span>
                <span>(124 reviews)</span>
              </div>
            </div>
          </div>

          <div className="prose prose-stone max-w-none mb-12">
            <h3 className="text-xl font-bold mb-4">About this business</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {listing.description}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Verified', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Booking', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Info', icon: Info, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Website', icon: Globe, color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white border border-black/5 flex flex-col items-center gap-3">
                <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                  <item.icon size={20} />
                </div>
                <span className="text-xs font-bold text-gray-900">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <WeatherWidget lat={-24.6282} lng={25.9231} />

          <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-xl sticky top-36">
            <h3 className="text-xl font-bold mb-6">Contact Business</h3>
            <div className="space-y-4">
              <a 
                href={`tel:${listing.phone}`}
                onClick={() => trackAction('call')}
                className="w-full py-4 bg-[#5A5A40] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/20"
              >
                <Phone size={20} />
                Call Now
              </a>
              <a 
                href={`https://wa.me/${listing.whatsapp}`}
                onClick={() => trackAction('whatsapp')}
                className="w-full py-4 bg-green-50 text-green-600 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-green-100 transition-all border border-green-100"
              >
                <MessageSquare size={20} />
                WhatsApp
              </a>
              <a 
                href={`mailto:${listing.email}`}
                onClick={() => trackAction('email')}
                className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all"
              >
                <Mail size={20} />
                Send Email
              </a>
            </div>
            <div className="mt-8 pt-8 border-t border-black/5">
              <p className="text-xs text-center text-gray-400">
                By contacting this business, you agree to our Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
