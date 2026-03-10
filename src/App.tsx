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

// Auth Context
const AuthContext = createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("tourbots_user");
    const savedBiz = localStorage.getItem("tourbots_biz");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedBiz) setBusiness(JSON.parse(savedBiz));
  }, []);

  const login = (userData: any, bizData?: any) => {
    setUser(userData);
    localStorage.setItem("tourbots_user", JSON.stringify(userData));
    if (bizData) {
      setBusiness(bizData);
      localStorage.setItem("tourbots_biz", JSON.stringify(bizData));
    }
  };

  const logout = () => {
    setUser(null);
    setBusiness(null);
    localStorage.removeItem("tourbots_user");
    localStorage.removeItem("tourbots_biz");
  };

  return (
    <AuthContext.Provider value={{ user, business, login, logout, setBusiness }}>
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
