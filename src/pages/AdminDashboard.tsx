import { useState, useEffect } from "react";
import { useAuth } from "../App";
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  FileText, 
  ExternalLink,
  Search,
  Filter,
  ShieldCheck,
  Users,
  TrendingUp,
  Package,
  Map as MapIcon,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

const COLORS = ['#5A5A40', '#8A8A60', '#C0C0B0', '#E0E0D0', '#F5F5F0'];

import BotswanaHeatmap from "../components/BotswanaHeatmap";

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
      fetch("/api/admin/registrations"),
      fetch("/api/admin/stats")
    ]);
    const regData = await regRes.json();
    const statsData = await statsRes.json();
    setRegistrations(regData);
    setStats(statsData);
    setLoading(false);
  };

  const handleAction = async (businessId: number, status: string) => {
    await fetch("/api/admin/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId, status }),
    });
    setSelectedReg(null);
    fetchData();
  };

  const businessStatusData = stats?.businesses.map((b: any) => ({
    name: b.status.charAt(0).toUpperCase() + b.status.slice(1),
    value: b.count
  })) || [];

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
          { label: "Total Users", value: stats?.growth.reduce((a: any, b: any) => a + b.count, 0) || 0, icon: Users, color: "text-blue-600 bg-blue-50" },
          { label: "Total Businesses", value: stats?.businesses.reduce((a: any, b: any) => a + b.count, 0) || 0, icon: ShieldCheck, color: "text-purple-600 bg-purple-50" },
          { label: "Platform Interactions", value: stats?.interactions.reduce((a: any, b: any) => a + b.count, 0) || 0, icon: TrendingUp, color: "text-green-600 bg-green-50" },
          { label: "Pending Reviews", value: registrations.length, icon: FileText, color: "text-amber-600 bg-amber-50" },
        ].map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm"
          >
            <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Business Status Distribution */}
        <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            <PieChartIcon size={20} className="text-[#5A5A40]" />
            Business Status
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={businessStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {businessStatusData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-4">
            {businessStatusData.map((c: any, i: number) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-gray-500">{c.name}</span>
                </div>
                <span className="font-bold">{c.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="md:col-span-2 bg-white p-8 rounded-[40px] border border-black/5 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            <BarChart3 size={20} className="text-[#5A5A40]" />
            Tourism Category Demand
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.categories || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#999'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#5A5A40" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Growth Trends */}
        <div className="md:col-span-2 bg-white p-8 rounded-[40px] border border-black/5 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            <TrendingUp size={20} className="text-[#5A5A40]" />
            Platform Growth Trends
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.growth || []}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5A5A40" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#5A5A40" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="count" stroke="#5A5A40" strokeWidth={3} fillOpacity={1} fill="url(#colorGrowth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* National Tourism Intelligence */}
        <div className="bg-[#5A5A40] p-8 rounded-[40px] text-white">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <MapIcon size={20} />
            National Intelligence
          </h3>
          <div className="space-y-6">
            <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Top Region</p>
              <p className="text-lg font-bold">{stats?.intelligence?.topRegion || "North-West (Maun)"}</p>
              <p className="text-xs text-white/70 mt-1">Receiving {stats?.intelligence?.regionEngagement || 42}% of total engagement.</p>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Demand Forecast</p>
              <p className="text-lg font-bold">+{stats?.intelligence?.demandForecast || 15}% Growth</p>
              <p className="text-xs text-white/70 mt-1">Projected increase in {stats?.intelligence?.forecastCategory || "safari camps"} for Q3.</p>
            </div>
            <button className="w-full bg-white text-[#5A5A40] py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all">
              Export Full Report
            </button>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <BotswanaHeatmap />
      </div>

      {/* Pending Requests Section */}
      <div className="pt-12 border-t border-black/5">
        {loading ? (
          <div className="text-center py-20">Loading registrations...</div>
        ) : registrations.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Pending Requests ({registrations.length})</h2>
              {registrations.map((reg) => (
                <motion.div 
                  key={reg.id}
                  layoutId={`reg-${reg.id}`}
                  onClick={() => setSelectedReg(reg)}
                  className={`bg-white p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between group ${
                    selectedReg?.id === reg.id ? "border-[#5A5A40] shadow-xl" : "border-black/5 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500 group-hover:bg-[#5A5A40]/10 group-hover:text-[#5A5A40] transition-colors">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{reg.name}</h3>
                      <p className="text-xs text-gray-500">{reg.category} • {reg.town}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold bg-amber-100 text-amber-600 px-3 py-1 rounded-full uppercase tracking-wider">
                      {reg.package}
                    </span>
                    <ChevronRight size={20} className="text-gray-300" />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                {selectedReg ? (
                  <motion.div
                    key={selectedReg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white p-8 rounded-[40px] border border-black/5 shadow-2xl sticky top-36"
                  >
                    <h3 className="text-2xl font-serif font-bold text-[#5A5A40] mb-6">Review Request</h3>
                    
                    <div className="space-y-6 mb-8">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Business Name</p>
                        <p className="font-bold text-gray-800">{selectedReg.name}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Owner</p>
                          <p className="text-sm text-gray-700">{selectedReg.ownerName}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Package</p>
                          <p className="text-sm text-gray-700">{selectedReg.package}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Description</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{selectedReg.description}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">BTO Certificate</p>
                        <a 
                          href={selectedReg.certificateUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-4 bg-gray-50 rounded-2xl text-sm font-bold text-[#5A5A40] hover:bg-gray-100 transition-all mb-4"
                        >
                          <FileText size={18} />
                          View Certificate
                          <ExternalLink size={14} className="ml-auto" />
                        </a>

                        {selectedReg.package !== 'Basic' && (
                          <>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Proof of Payment</p>
                            <a 
                              href={selectedReg.paymentProofUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-4 bg-amber-50 rounded-2xl text-sm font-bold text-amber-700 hover:bg-amber-100 transition-all"
                            >
                              <FileText size={18} />
                              View Proof of Payment
                              <ExternalLink size={14} className="ml-auto" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => handleAction(selectedReg.id, 'rejected')}
                        className="flex items-center justify-center gap-2 py-4 rounded-2xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-all"
                      >
                        <XCircle size={18} />
                        Reject
                      </button>
                      <button 
                        onClick={() => handleAction(selectedReg.id, 'approved')}
                        className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#5A5A40] text-white font-bold hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/20"
                      >
                        <CheckCircle2 size={18} />
                        Approve
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-gray-50 p-12 rounded-[40px] border border-dashed border-gray-200 text-center flex flex-col items-center justify-center h-80">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gray-300 mb-4 shadow-sm">
                      <Eye size={32} />
                    </div>
                    <p className="text-gray-400 font-bold text-sm">Select a request to review</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[40px] border border-black/5">
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">All caught up!</h3>
            <p className="text-gray-500">There are no pending registration requests.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ChevronRight({ size, className }: { size: number, className?: string }) {
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
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
