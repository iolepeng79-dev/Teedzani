import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BusinessOnboarding from "./pages/BusinessOnboarding";
import TouristDashboard from "./pages/TouristDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ListingDetail from "./pages/ListingDetail";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import { usePWA } from "./hooks/usePWA";

// Auth Context
const AuthContext = createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isInstallable, installApp } = usePWA();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        if (session) {
          fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Auth session error:", err);
        setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setBusiness(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      if (profile.role === 'business') {
        const { data: biz, error: bizError } = await supabase
          .from('businesses')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (!bizError) setBusiness(biz);
      }

      setUser(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setBusiness(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0]">
        <div className="w-12 h-12 border-4 border-[#5A5A40] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, business, logout, setBusiness, fetchProfile }}>
      <Router>
        <div className="min-h-screen bg-[#f5f5f0] font-sans text-[#1a1a1a]">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/explore/:category" element={<Explore />} />
              <Route path="/map" element={<Explore />} /> {/* Using Explore as a placeholder for Map for now */}
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  user?.role === 'tourist' ? <TouristDashboard /> :
                  user?.role === 'business' ? <BusinessDashboard /> :
                  user?.role === 'admin' ? <AdminDashboard /> :
                  <Navigate to="/login" />
                } 
              />
              <Route path="/business/onboarding" element={<BusinessOnboarding />} />
            </Routes>
          </main>
          
          {/* Global App Install Banner */}
          {isInstallable && (
            <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white p-4 rounded-3xl shadow-2xl border border-black/5 flex items-center justify-between z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#5A5A40] rounded-xl flex items-center justify-center text-white font-bold">TB</div>
                <div>
                  <p className="text-sm font-bold">TourBots App</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Install for Offline Access</p>
                </div>
              </div>
              <button 
                onClick={installApp}
                className="bg-[#5A5A40] text-white text-xs px-5 py-2.5 rounded-full font-bold hover:bg-[#4A4A30] transition-colors"
              >
                Install
              </button>
            </div>
          )}
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
