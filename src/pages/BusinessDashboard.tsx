import { useState, useEffect } from "react";
import { useAuth } from "../App";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MessageSquare, 
  Calendar, 
  Settings, 
  Image as ImageIcon, 
  Package,
  AlertCircle,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Smartphone,
  Bookmark,
  Star,
  Globe,
  Zap
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion } from "motion/react";

const COLORS = ['#5A5A40', '#8A8A60', '#C0C0B0', '#E0E0D0', '#F5F5F0'];

export default function BusinessDashboard() {
  const { user, business } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (business?.id) {
      fetch(`/api/business/stats/${business.id}`)
        .then(res => res.json())
        .then(data => {
          setStats(data);
          setLoading(false);
        });
    }
  }, [business]);

  if (!business) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock size={40} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-[#5A5A40] mb-4">Registration Pending</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Your business registration is currently being reviewed by our admin team. We will notify you once your branch is approved.
        </p>
      </div>
    );
  }

  const contactData = stats?.contacts.map((c: any) => ({
    name: c.type.charAt(0).toUpperCase() + c.type.slice(1),
    value: c.count
  })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-serif font-bold text-[#5A5A40] mb-2"
          >
            {business.business_name || business.name}
          </motion.h1>
          <div className="flex items-center gap-2 text-gray-500">
            <CheckCircle2 size={16} className="text-green-500" />
            <span>Verified Branch</span>
            <span className="mx-2">•</span>
            <span className="bg-[#5A5A40]/10 text-[#5A5A40] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {business.package} Package
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="bg-white border border-black/5 px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-all">
            <Settings size={18} />
            Manage Business
          </button>
          <button className="bg-[#5A5A40] text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/20">
            <ImageIcon size={18} />
            Upload Media
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: "Total Views", value: stats?.views.reduce((a: any, b: any) => a + b.count, 0) || 0, icon: Eye, color: "text-blue-600 bg-blue-50" },
          { label: "Inquiries", value: stats?.inquiries.reduce((a: any, b: any) => a + b.count, 0) || 0, icon: MessageSquare, color: "text-purple-600 bg-purple-50" },
          { label: "Contact Clicks", value: stats?.contacts.reduce((a: any, b: any) => a + b.count, 0) || 0, icon: Smartphone, color: "text-green-600 bg-green-50" },
          { label: "Performance", value: stats?.score + "%", icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
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
        {/* Main Chart */}
        <div className="md:col-span-2 bg-white p-8 rounded-[40px] border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-800">Profile Views Trend</h3>
            <select className="bg-gray-50 border-none text-sm font-bold rounded-xl px-4 py-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Yearly</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.views || []}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5A5A40" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#5A5A40" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="count" stroke="#5A5A40" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Contact Distribution */}
        <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-8">Contact Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contactData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {contactData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-4">
            {contactData.map((c: any, i: number) => (
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
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Visitor Origin */}
        <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Globe size={20} className="text-[#5A5A40]" />
            Visitor Origin
          </h3>
          <div className="space-y-6">
            {stats?.origins.map((origin: any, i: number) => (
              <div key={origin.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">{origin.name}</span>
                  <span className="font-bold">{origin.value}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#5A5A40] rounded-full" 
                    style={{ width: `${origin.value}%`, opacity: 1 - (i * 0.15) }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Performance Score */}
        <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-8">Performance Score</h3>
          <div className="relative w-48 h-48 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-gray-100"
              />
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={502.4}
                strokeDashoffset={502.4 - (502.4 * (stats?.score || 0)) / 100}
                className="text-[#5A5A40]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-serif font-bold text-[#5A5A40]">{stats?.score}</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Index</span>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
            <p className="text-xs text-green-700 font-medium leading-relaxed">
              <Zap size={14} className="inline mr-1 mb-0.5" />
              Your engagement is up 12% this week. Add more photos to reach 90!
            </p>
          </div>
        </div>

        {/* Package Usage */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Package size={20} className="text-[#5A5A40]" />
              Package Usage
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Photos Uploaded</span>
                  <span className="font-bold">12 / {business.package === 'Premium' ? '∞' : business.package === 'Standard' ? '50' : '10'}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#5A5A40] rounded-full" style={{ width: '24%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Promotions Used</span>
                  <span className="font-bold">2 / {business.package === 'Premium' ? '10' : business.package === 'Standard' ? '5' : '0'}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '40%' }} />
                </div>
              </div>
              <button className="w-full mt-4 text-[#5A5A40] font-bold text-sm hover:underline">Upgrade Package</button>
            </div>
          </div>

          <div className="bg-[#5A5A40] p-8 rounded-[40px] text-white">
            <h3 className="text-xl font-bold mb-4">Tourism Intelligence</h3>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              Most tourists viewing your listing are interested in "Safari" and "Culture" categories.
            </p>
            <button className="w-full bg-white text-[#5A5A40] py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all">
              View Market Trends
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
