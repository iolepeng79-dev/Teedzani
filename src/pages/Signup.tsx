import { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { User, Mail, Lock, ShieldCheck, Briefcase, ChevronRight, AlertCircle, Globe } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'tourist' | 'business'>('tourist');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') as 'tourist' | 'business' | null;

  useEffect(() => {
    if (initialRole === 'business' || initialRole === 'tourist') {
      setRole(initialRole);
    }
  }, [initialRole]);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: fullName,
            email: email,
            role: role,
            status: role === 'business' ? 'draft' : 'approved',
          });

        if (profileError) throw profileError;

        if (role === 'business') {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-[#F5F5F0]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 rounded-[48px] shadow-2xl border border-black/5"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#5A5A40] rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-lg shadow-[#5A5A40]/20">T</div>
          <h1 className="text-3xl font-serif font-bold text-[#5A5A40] mb-2">Join TourBots</h1>
          <p className="text-gray-500">Create an account to get started.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium border border-red-100">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="flex p-1 bg-gray-100 rounded-2xl mb-10">
          <button 
            onClick={() => setRole('tourist')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${role === 'tourist' ? 'bg-white text-[#5A5A40] shadow-sm' : 'text-gray-400'}`}
          >
            <User size={16} />
            Tourist
          </button>
          <button 
            onClick={() => setRole('business')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${role === 'business' ? 'bg-white text-[#5A5A40] shadow-sm' : 'text-gray-400'}`}
          >
            <Briefcase size={16} />
            Business
          </button>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                required 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-gray-50 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-gray-50 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-gray-50 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-[#5A5A40] text-white rounded-2xl font-bold text-lg hover:bg-[#4A4A30] transition-all shadow-xl shadow-[#5A5A40]/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
            <ChevronRight size={20} />
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account? <Link to="/login" className="text-[#5A5A40] font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
