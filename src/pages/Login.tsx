import { useState, FormEvent, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../App";
import { User, Briefcase, Shield, ArrowRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Login() {
  const location = useLocation();
  const [role, setRole] = useState<string | null>(location.state?.role || null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role);
    }
  }, [location.state]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });
    const data = await res.json();
    if (res.ok) {
      login(data.user, data.business);
      navigate("/dashboard");
    } else {
      setError(data.error);
    }
  };

  const roles = [
    { id: "tourist", title: "I Am a Tourist", icon: User, desc: "Discover and explore Botswana" },
    { id: "business", title: "I Own a Business", icon: Briefcase, desc: "Manage your tourism branch" },
    // Admin is hidden and only accessible via secret trigger
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <AnimatePresence mode="wait">
          {!role ? (
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-10">
                <h1 className="text-3xl font-serif font-bold text-[#5A5A40] mb-2">Welcome Back</h1>
                <p className="text-gray-500">Please select your role to continue</p>
              </div>

              <div className="space-y-4">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className="w-full flex items-center gap-4 p-6 bg-white rounded-3xl border border-black/5 hover:border-[#5A5A40] hover:shadow-xl transition-all group text-left"
                  >
                    <div className="w-12 h-12 bg-[#5A5A40]/10 rounded-2xl flex items-center justify-center text-[#5A5A40] group-hover:bg-[#5A5A40] group-hover:text-white transition-colors">
                      <r.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{r.title}</h3>
                      <p className="text-xs text-gray-500">{r.desc}</p>
                    </div>
                    <ArrowRight size={20} className="text-gray-300 group-hover:text-[#5A5A40]" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-8 rounded-3xl border border-black/5 shadow-xl"
            >
              <button 
                onClick={() => setRole(null)}
                className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-[#5A5A40] mb-8"
              >
                <ChevronLeft size={16} />
                Back to roles
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-[#5A5A40] capitalize">{role} Login</h2>
                <p className="text-sm text-gray-500">Enter your credentials to access your account</p>
              </div>

              {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 font-medium">{error}</div>}

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all"
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="w-full bg-[#5A5A40] text-white py-4 rounded-xl font-bold hover:bg-[#4A4A30] transition-colors">
                  Login
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-black/5 text-center">
                {role === 'tourist' ? (
                  <p className="text-sm text-gray-500">
                    Don't have an account? <Link to="/register" className="text-[#5A5A40] font-bold hover:underline">Register as Tourist</Link>
                  </p>
                ) : role === 'business' ? (
                  <p className="text-sm text-gray-500">
                    New business? <Link to="/business/onboarding" className="text-[#5A5A40] font-bold hover:underline">Register Your Branch</Link>
                  </p>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
