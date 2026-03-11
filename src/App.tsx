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
import { AlertCircle } from "lucide-react";

// Auth Context
const AuthContext = createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
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
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
    setUser(null);
    setBusiness(null);
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0] p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-black/5 shadow-xl text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#5A5A40] mb-4">Backend Configuration Required</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Please set the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">VITE_SUPABASE_URL</code> and <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">VITE_SUPABASE_ANON_KEY</code> environment variables in the settings menu to connect your Supabase project.
          </p>
          <div className="text-xs text-gray-400 font-mono bg-gray-50 p-4 rounded-xl text-left overflow-x-auto">
            # .env.example<br />
            VITE_SUPABASE_URL=your-url.supabase.co<br />
            VITE_SUPABASE_ANON_KEY=your-anon-key
          </div>
        </div>
      </div>
    );
  }

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
          <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white p-4 rounded-2xl shadow-xl border border-black/5 flex items-center justify-between z-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#5A5A40] rounded-lg flex items-center justify-center text-white font-bold">TB</div>
              <div>
                <p className="text-sm font-semibold">TourBots Mobile</p>
                <p className="text-xs text-gray-500">Discover Botswana Smarter</p>
              </div>
            </div>
            <button className="bg-[#5A5A40] text-white text-xs px-4 py-2 rounded-full font-medium">Install</button>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
