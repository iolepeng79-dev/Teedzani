import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, XCircle, Eye, FileText, ExternalLink, Search, Filter, 
  ShieldCheck, Users, TrendingUp, Package, Map as MapIcon, BarChart3, PieChart as PieChartIcon,
  Briefcase
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';

const COLORS = ['#5A5A40', '#8A8A60', '#C0C0B0', '#E0E0D0', '#F5F5F0'];

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReg, setSelectedReg] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [regRes, statsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('role', 'business').eq('status', 'pending'),
      supabase.from('profiles').select('role, status, region, package_id')
    ]);

    setRegistrations(regRes.data || []);
    
    // Process stats
    const allProfiles = statsRes.data || [];
    const businesses = allProfiles.filter(p => p.role === 'business');
    
    const regionStats = businesses.reduce((acc: any, b: any) => {
      acc[b.region] = (acc[b.region] || 0) + 1;
      return acc;
    }, {});

    const packageStats = businesses.reduce((acc: any, b: any) => {
      acc[b.package_id || 'none'] = (acc[b.package_id || 'none'] || 0) + 1;
      return acc;
    }, {});

    setStats({
      totalBusinesses: businesses.length,
      totalTourists: allProfiles.filter(p => p.role === 'tourist').length,
      regions: Object.entries(regionStats).map(([name, value]) => ({ name, value })),
      packages: Object.entries(packageStats).map(([name, value]) => ({ name, value })),
    });

    setLoading(false);
  };

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', id);

    if (!error) {
      setRegistrations(registrations.filter(r => r.id !== id));
      setSelectedReg(null);
      fetchData();
    }
  };

  const packageData = [
    { name: 'Basic', value: 45 },
    { name: 'Standard', value: 30 },
    { name: 'Premium', value: 25 },
  ];

  const activityData = [
    { name: 'Mon', activity: 120 },
    { name: 'Tue', activity: 240 },
    { name: 'Wed', activity: 180 },
    { name: 'Thu', activity: 320 },
    { name: 'Fri', activity: 450 },
    { name: 'Sat', activity: 380 },
    { name: 'Sun', activity: 520 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#5A5A40] mb-2">Admin Panel</h1>
          <p className="text-gray-500">Review and manage business registration requests.</p>
        </div>
        <div className="w-12 h-12 bg-[#5A5A40]/10 text-[#5A5A40] rounded-full flex items-center justify-center">
          <ShieldCheck size={24} />
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Users', value: stats?.totalTourists + stats?.totalBusinesses || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Businesses', value: stats?.totalBusinesses || 0, icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Interactions', value: '45.2k', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Pending Reviews', value: registrations.length, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
              <stat.icon size={24} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2 bg-white p-10 rounded-[48px] border border-black/5 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-10">Platform Activity</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                <Tooltip />
                <Line type="monotone" dataKey="activity" stroke="#5A5A40" strokeWidth={4} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[48px] border border-black/5 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-10">Package Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={packageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {packageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-6">
            {packageData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                  <span className="text-gray-500">{item.name}</span>
                </div>
                <span className="font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Heatmap/Region List */}
        <div className="bg-[#5A5A40] p-8 rounded-[40px] text-white">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <MapIcon size={20} />
            Regional Distribution
          </h3>
          <div className="space-y-6">
            {stats?.regions.map((region: any, idx: number) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{region.name}</span>
                  <span className="font-bold">{region.value} Businesses</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full" 
                    style={{ width: `${(region.value / stats.totalBusinesses) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Requests */}
        <div className="md:col-span-2 bg-white p-10 rounded-[48px] border border-black/5 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-10">Pending Approvals</h3>
          {registrations.length > 0 ? (
            <div className="space-y-4">
              {registrations.map((reg) => (
                <div 
                  key={reg.id}
                  className="p-6 bg-gray-50 rounded-3xl flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-black/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{reg.business_name}</h4>
                      <p className="text-xs text-gray-500">{reg.category} • {reg.region}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setSelectedReg(reg)}
                      className="p-3 text-gray-400 hover:text-[#5A5A40] transition-colors"
                    >
                      <Eye size={20} />
                    </button>
                    <button 
                      onClick={() => handleAction(reg.id, 'approved')}
                      className="p-3 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <CheckCircle2 size={20} />
                    </button>
                    <button 
                      onClick={() => handleAction(reg.id, 'rejected')}
                      className="p-3 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">All caught up!</h4>
              <p className="text-gray-500">There are no pending registration requests.</p>
            </div>
          )}
        </div>
      </div>

      {/* Registration Detail Modal */}
      <AnimatePresence>
        {selectedReg && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReg(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[48px] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h2 className="text-3xl font-serif font-bold text-[#5A5A40] mb-2">{selectedReg.business_name}</h2>
                    <p className="text-gray-500">{selectedReg.category} • {selectedReg.region}</p>
                  </div>
                  <button onClick={() => setSelectedReg(null)} className="p-2 text-gray-400 hover:text-gray-600">
                    <XCircle size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Owner</p>
                    <p className="font-bold text-gray-900">{selectedReg.full_name}</p>
                    <p className="text-sm text-gray-500">{selectedReg.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Location</p>
                    <p className="font-bold text-gray-900">{selectedReg.town}</p>
                    <p className="text-sm text-gray-500">{selectedReg.region}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Contact</p>
                    <p className="font-bold text-gray-900">{selectedReg.phone}</p>
                    <p className="text-sm text-gray-500">WhatsApp: {selectedReg.whatsapp || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Status</p>
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-amber-100">Pending</span>
                  </div>
                </div>

                <div className="mb-10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Description</p>
                  <p className="text-gray-600 leading-relaxed">{selectedReg.description}</p>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => handleAction(selectedReg.id, 'approved')}
                    className="flex-1 py-5 bg-[#5A5A40] text-white rounded-2xl font-bold hover:bg-[#4A4A30] transition-all shadow-xl shadow-[#5A5A40]/20"
                  >
                    Approve Request
                  </button>
                  <button 
                    onClick={() => handleAction(selectedReg.id, 'rejected')}
                    className="flex-1 py-5 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
