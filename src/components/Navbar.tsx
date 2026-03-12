import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePWA } from '../hooks/usePWA';
import { LogOut, User, Menu, X, Download, ShieldCheck, Briefcase, MapPin } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  let auth: any = {};
  let pwa: any = {};
  
  try {
    auth = useAuth();
  } catch (e) {
    console.error("Navbar auth error", e);
  }

  try {
    pwa = usePWA();
  } catch (e) {
    console.error("Navbar PWA error", e);
  }

  const { user, profile, signOut } = auth;
  const { isInstallable, installApp } = pwa;
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Explore', path: '/explore', roles: ['tourist', 'business', 'admin'] },
    { name: 'Dashboard', path: '/dashboard', roles: ['tourist', 'business', 'admin'] },
    { name: 'Admin', path: '/admin', roles: ['admin'] },
  ];

  const filteredLinks = navLinks.filter(link => 
    !profile ? link.roles.includes('tourist') : link.roles.includes(profile.role)
  );

  return (
    <nav className="bg-white border-b border-black/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#5A5A40] rounded-lg flex items-center justify-center text-white font-bold">T</div>
              <span className="text-xl font-serif font-bold text-[#5A5A40]">TourBots</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              {filteredLinks.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className="text-sm font-medium text-gray-600 hover:text-[#5A5A40] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isInstallable && (
              <button 
                onClick={installApp}
                className="flex items-center gap-2 px-4 py-2 bg-[#5A5A40]/10 text-[#5A5A40] rounded-full text-sm font-bold hover:bg-[#5A5A40]/20 transition-all"
              >
                <Download size={16} />
                Install App
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-900">{profile?.full_name || user.email}</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#5A5A40] font-bold">{profile?.role}</span>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-[#5A5A40]">Login</Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2 bg-[#5A5A40] text-white rounded-full text-sm font-bold hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-black/5 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {filteredLinks.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-medium text-gray-900"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-black/5">
                {user ? (
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-red-500 font-bold"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="text-lg font-medium">Login</Link>
                    <Link 
                      to="/register" 
                      onClick={() => setIsOpen(false)}
                      className="w-full py-4 bg-[#5A5A40] text-white rounded-2xl text-center font-bold"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
