import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../App";
import { User, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    country: ""
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, role: "tourist" }),
    });
    const data = await res.json();
    if (res.ok) {
      login(data.user);
      navigate("/dashboard");
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl border border-black/5 shadow-xl"
        >
          <Link 
            to="/login"
            className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-[#5A5A40] mb-8"
          >
            <ChevronLeft size={16} />
            Back to login
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold text-[#5A5A40]">Tourist Registration</h2>
            <p className="text-sm text-gray-500">Join the TourBots community today</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 font-medium">{error}</div>}

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Country of Origin (Optional)</label>
              <input 
                type="text" 
                value={formData.country}
                onChange={e => setFormData({...formData, country: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all"
                placeholder="e.g. United Kingdom"
              />
            </div>
            <button type="submit" className="w-full bg-[#5A5A40] text-white py-4 rounded-xl font-bold hover:bg-[#4A4A30] transition-colors">
              Create Account
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-black/5 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-[#5A5A40] font-bold hover:underline">Login</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
