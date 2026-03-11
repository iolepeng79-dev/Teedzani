import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, ShieldCheck, Briefcase, ChevronRight, Star, Users, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#5A5A40]">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://picsum.photos/seed/botswana/1920/1080?blur=4" 
            alt="Botswana Landscape" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-white/10">
              <Star size={12} className="text-amber-400" />
              <span>The Jewel of Africa</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-bold mb-8 leading-tight">
              Discover <br /> <span className="text-amber-400 italic">Botswana</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Unified tourism discovery platform. Explore, book, and experience the heart of the wild.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link 
                to="/signup" 
                className="w-full md:w-auto px-12 py-5 bg-white text-[#5A5A40] rounded-full text-lg font-bold hover:bg-gray-100 transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-2"
              >
                Start Exploring
                <ChevronRight size={20} />
              </Link>
              <Link 
                to="/signup?role=business" 
                className="w-full md:w-auto px-12 py-5 bg-white/10 backdrop-blur-md text-white rounded-full text-lg font-bold hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center gap-2"
              >
                <Briefcase size={20} />
                I Own a Business
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-12 text-white/50 text-xs font-bold uppercase tracking-widest">
          <div className="flex flex-col items-center gap-2">
            <span className="text-white text-lg">1.2k+</span>
            <span>Listings</span>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-white text-lg">45k+</span>
            <span>Tourists</span>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-white text-lg">100%</span>
            <span>Authentic</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#5A5A40] mb-6">Built for the Ecosystem</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Whether you are a traveler seeking adventure or a business looking to grow, TourBots is your home.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                icon: MapPin, 
                title: "Unified Discovery", 
                desc: "Find lodges, safari camps, restaurants, and activities all in one place. Real-time availability and booking.",
                color: "bg-blue-50 text-blue-600"
              },
              { 
                icon: ShieldCheck, 
                title: "Verified Businesses", 
                desc: "Every business on our platform is vetted and verified by our team to ensure quality and safety.",
                color: "bg-green-50 text-green-600"
              },
              { 
                icon: TrendingUp, 
                title: "Growth Analytics", 
                desc: "Businesses get deep insights into customer behavior, views, and interactions to drive more bookings.",
                color: "bg-purple-50 text-purple-600"
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="p-10 rounded-[40px] bg-gray-50 border border-black/5 hover:border-[#5A5A40]/30 transition-all group"
              >
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[#F5F5F0]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-[#5A5A40] rounded-[64px] p-12 md:p-24 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <img 
                src="https://picsum.photos/seed/elephants/1200/800" 
                alt="Elephants" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8">Ready to start your journey?</h2>
              <p className="text-xl text-white/70 mb-12 max-w-xl mx-auto">Join thousands of travelers and businesses already using TourBots.</p>
              <Link 
                to="/signup" 
                className="inline-flex items-center gap-2 px-12 py-5 bg-white text-[#5A5A40] rounded-full text-lg font-bold hover:bg-gray-100 transition-all shadow-2xl shadow-black/20"
              >
                Get Started Now
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
