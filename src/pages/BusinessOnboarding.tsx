import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { Briefcase, MapPin, Phone, MessageSquare, Mail, FileText, Upload, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const REGIONS = ['Gaborone', 'Francistown', 'Maun', 'Kasane', 'Lobatse', 'Selebi-Phikwe', 'Other'];
const CATEGORIES = ['Lodges', 'Safari Camps', 'Restaurants', 'Tour Operators', 'Car Rentals', 'Craft Shops', 'Other'];

export default function BusinessOnboarding() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    business_name: '',
    category: '',
    region: '',
    town: '',
    phone: '',
    whatsapp: '',
    email: '',
    description: '',
  });

  const [certificate, setCertificate] = useState<File | null>(null);

  useEffect(() => {
    if (profile && profile.role !== 'business') {
      navigate('/dashboard');
    }
    if (profile && profile.status !== 'draft') {
      navigate('/dashboard');
    }
  }, [profile, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Upload certificate
      let certificateUrl = '';
      if (certificate) {
        const fileExt = certificate.name.split('.').pop();
        const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('certificates')
          .upload(fileName, certificate);

        if (uploadError) throw uploadError;
        certificateUrl = uploadData.path;
      }

      // 2. Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...formData,
          status: 'pending',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      // 3. Save upload record
      if (certificateUrl) {
        await supabase.from('uploads').insert({
          profile_id: user?.id,
          type: 'certificate',
          url: certificateUrl,
          description: 'Business Registration Certificate',
        });
      }

      navigate('/packages');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#5A5A40]/10 text-[#5A5A40] rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-[#5A5A40]/10">
            <ShieldCheck size={14} />
            <span>Business Verification</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#5A5A40] mb-4">Register Your Branch</h1>
          <p className="text-gray-500 max-w-xl mx-auto">Complete your business profile to start reaching tourists across Botswana.</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[48px] shadow-2xl border border-black/5">
          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium border border-red-100">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Business Name</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    required 
                    value={formData.business_name}
                    onChange={e => setFormData({...formData, business_name: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-gray-50 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all"
                    placeholder="e.g. Chobe Safari Lodge"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Category</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <select 
                    required 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-gray-50 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all appearance-none"
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Region</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <select 
                    required 
                    value={formData.region}
                    onChange={e => setFormData({...formData, region: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-gray-50 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all appearance-none"
                  >
                    <option value="">Select Region</option>
                    {REGIONS.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Town / Village</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    required 
                    value={formData.town}
                    onChange={e => setFormData({...formData, town: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-gray-50 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all"
                    placeholder="e.g. Kasane"
                  />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="tel" 
                    required 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-gray-50 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all"
                    placeholder="+267..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">WhatsApp</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="tel" 
                    value={formData.whatsapp}
                    onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-gray-50 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all"
                    placeholder="+267..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Public Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 bg-gray-50 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all"
                    placeholder="info@lodge.com"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Business Description</label>
              <textarea 
                required 
                rows={4}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-6 py-4 rounded-3xl border border-black/5 bg-gray-50 focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all resize-none"
                placeholder="Tell us about your business, services, and what makes you unique..."
              />
            </div>

            {/* Certificate Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Registration Certificate (PDF/Image)</label>
              <div className="relative">
                <input 
                  type="file" 
                  required 
                  accept=".pdf,image/*"
                  onChange={e => setCertificate(e.target.files?.[0] || null)}
                  className="hidden" 
                  id="cert-upload"
                />
                <label 
                  htmlFor="cert-upload"
                  className="flex flex-col items-center justify-center gap-4 p-12 border-2 border-dashed border-gray-200 rounded-[40px] bg-gray-50 hover:bg-gray-100 hover:border-[#5A5A40]/30 transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-[#5A5A40] transition-colors shadow-sm">
                    <Upload size={32} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-900">{certificate ? certificate.name : "Click to upload certificate"}</p>
                    <p className="text-xs text-gray-400 mt-1">Maximum file size: 5MB</p>
                  </div>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-6 bg-[#5A5A40] text-white rounded-[32px] font-bold text-xl hover:bg-[#4A4A30] transition-all shadow-2xl shadow-[#5A5A40]/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? "Submitting Profile..." : "Submit Registration"}
              <ChevronRight size={24} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ShieldCheck({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
