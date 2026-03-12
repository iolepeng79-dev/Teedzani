import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BusinessOnboarding from "./pages/BusinessOnboarding";
import TouristDashboard from "./pages/TouristDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ListingDetail from "./pages/ListingDetail";
import { useAuth } from "./hooks/useAuth";
import { usePWA } from "./hooks/usePWA";

export default function App() {
  let auth: any = {};
  let pwa: any = {};
  
  try {
    auth = useAuth();
  } catch (e) {
    console.error("Auth context error", e);
  }

  try {
    pwa = usePWA();
  } catch (e) {
    console.error("PWA hook error", e);
  }

  const { user, profile, business, loading } = auth;
  const { installApp, isInstallable } = pwa;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f0]">
        <div className="w-12 h-12 border-4 border-[#5A5A40] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#f5f5f0] font-sans text-[#1a1a1a]">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/explore/:category" element={<Explore />} />
            <Route path="/map" element={<Explore />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            
            <Route 
              path="/dashboard" 
              element={
                profile?.role === 'tourist' ? <TouristDashboard /> :
                profile?.role === 'business' ? <BusinessDashboard /> :
                profile?.role === 'admin' ? <AdminDashboard /> :
                <Navigate to="/login" />
              } 
            />
            <Route path="/business/onboarding" element={<BusinessOnboarding />} />
          </Routes>
        </main>
        
        {isInstallable && (
          <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white p-4 rounded-3xl shadow-2xl border border-black/5 flex items-center justify-between z-50">
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
  );
}
