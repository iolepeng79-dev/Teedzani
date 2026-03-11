import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { usePWA } from '../hooks/usePWA';
import { Download, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout() {
  const { isInstallable, install } = usePWA();
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen bg-[#F5F5F0] font-sans text-gray-900">
      <Navbar />
      <main>
        <Outlet />
      </main>

      <AnimatePresence>
        {isInstallable && showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50"
          >
            <div className="bg-[#5A5A40] p-6 rounded-[32px] shadow-2xl text-white flex items-center justify-between gap-6 border border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#5A5A40] font-bold shadow-lg">T</div>
                <div>
                  <h3 className="font-bold text-lg">TourBots App</h3>
                  <p className="text-xs text-white/70">Install for a better experience</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={install}
                  className="px-6 py-3 bg-white text-[#5A5A40] rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all shadow-lg"
                >
                  Install
                </button>
                <button 
                  onClick={() => setShowBanner(false)}
                  className="p-2 text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-white border-t border-black/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#5A5A40] rounded-lg flex items-center justify-center text-white font-bold">T</div>
            <span className="text-xl font-serif font-bold text-[#5A5A40]">TourBots</span>
          </div>
          <p className="text-sm text-gray-500 mb-8">Discover the magic of Botswana, the jewel of Africa.</p>
          <div className="flex items-center justify-center gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-[#5A5A40] transition-colors">About</a>
            <a href="#" className="hover:text-[#5A5A40] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#5A5A40] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#5A5A40] transition-colors">Support</a>
          </div>
          <p className="text-xs text-gray-300 mt-12">© 2026 TourBots. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
