import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { Check, Star, Zap, Crown, ChevronRight, ArrowLeft } from 'lucide-react';

const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic',
    monthly: 0,
    yearly: 0,
    icon: Zap,
    color: 'text-gray-400',
    bg: 'bg-gray-50',
    features: [
      'One profile photo',
      'Edit basic profile',
      'Limited analytics',
      'Standard listing'
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    monthly: 550,
    yearly: 5000,
    icon: Star,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    popular: true,
    features: [
      '25 photos & 1 video (1.5MB)',
      '2 promotions/stories per month',
      'Full analytics dashboard',
      'Priority in search results',
      'Verified badge'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    monthly: 750,
    yearly: 6000,
    icon: Crown,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    features: [
      '50 photos & 4 videos (2MB)',
      '5 promotions/stories per month',
      'Full analytics dashboard',
      'Top placement in search',
      'Dedicated support',
      'Featured on homepage'
    ]
  }
];

export default function PackageSelection() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [dbPackages, setDbPackages] = useState<any[]>([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const { data, error } = await supabase.from('packages').select('*');
    if (!error) setDbPackages(data || []);
  };

  const handleSelect = async (pkg: any) => {
    setLoading(true);
    try {
      const dbPkg = dbPackages.find(p => p.name.toLowerCase() === pkg.name.toLowerCase());
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          package_id: dbPkg?.id || pkg.id,
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      // Create history record
      await supabase.from('business_packages').insert({
        profile_id: user?.id,
        package_name: pkg.name,
        billing_cycle: billing,
        price: billing === 'monthly' ? pkg.monthly : pkg.yearly,
        status: pkg.monthly === 0 ? 'approved' : 'pending'
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Package selection error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#5A5A40] mb-6">Choose Your Package</h1>
          <p className="text-gray-500 text-lg mb-12 max-w-2xl mx-auto">Select the plan that best fits your business goals. You can upgrade at any time.</p>
          
          <div className="inline-flex p-1 bg-white rounded-2xl shadow-sm border border-black/5">
            <button 
              onClick={() => setBilling('monthly')}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${billing === 'monthly' ? 'bg-[#5A5A40] text-white shadow-lg' : 'text-gray-400'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBilling('yearly')}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${billing === 'yearly' ? 'bg-[#5A5A40] text-white shadow-lg' : 'text-gray-400'}`}
            >
              Yearly (Save ~20%)
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PACKAGES.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative bg-white p-10 rounded-[48px] border transition-all flex flex-col ${pkg.popular ? 'border-[#5A5A40] shadow-2xl scale-105 z-10' : 'border-black/5 hover:border-gray-300 shadow-xl'}`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#5A5A40] text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Most Popular
                </div>
              )}

              <div className={`w-16 h-16 ${pkg.bg} ${pkg.color} rounded-2xl flex items-center justify-center mb-8`}>
                <pkg.icon size={32} />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
              <div className="mb-8">
                <span className="text-4xl font-serif font-bold text-[#5A5A40]">
                  P{billing === 'monthly' ? pkg.monthly : pkg.yearly}
                </span>
                <span className="text-gray-400 text-sm ml-2">/ {billing === 'monthly' ? 'month' : 'year'}</span>
              </div>

              <div className="space-y-4 mb-12 flex-1">
                {pkg.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 p-0.5 bg-green-50 text-green-600 rounded-full">
                      <Check size={12} />
                    </div>
                    <span className="text-sm text-gray-600 leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleSelect(pkg)}
                disabled={loading}
                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${pkg.popular ? 'bg-[#5A5A40] text-white hover:bg-[#4A4A30] shadow-xl shadow-[#5A5A40]/20' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'}`}
              >
                {pkg.monthly === 0 ? "Get Started" : "Select Plan"}
                <ChevronRight size={20} />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <button 
            onClick={() => navigate('/onboarding')}
            className="inline-flex items-center gap-2 text-gray-400 font-bold hover:text-[#5A5A40] transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Onboarding
          </button>
        </div>
      </div>
    </div>
  );
}
