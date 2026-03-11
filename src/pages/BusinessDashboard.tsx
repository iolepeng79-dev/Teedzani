import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Phone, MessageSquare, Mail, Calendar, Eye, Bookmark, Star, 
  TrendingUp, Users, Package, ShieldCheck, AlertCircle, ChevronRight 
} from 'lucide-react';

const COLORS = ['#5A5A40', '#8A8A60', '#C0C0B0', '#E0E0D0', '#F5F5F0'];

export default function BusinessDashboard() {
  const { user, profile } = useAuth();
  const [timeRange, setTimeRange] = useState('monthly');
  const [loading, setLoading] = useState(true);

  // Mock data for charts
  const interactionData = [
    { name: 'Mon', calls: 12, whatsapp: 24, email: 8, bookings: 4 },
    { name: 'Tue', calls: 18, whatsapp: 32, email: 12, bookings: 6 },
    { name: 'Wed', calls: 15, whatsapp: 28, email: 10, bookings: 5 },
    { name: 'Thu', calls: 22, whatsapp: 45, email: 15, bookings: 8 },
    { name: 'Fri', calls: 30, whatsapp: 55, email: 20, bookings: 12 },
    { name: 'Sat', calls: 45, whatsapp: 70, email: 25, bookings: 18 },
    { name: 'Sun', calls: 35, whatsapp: 60, email: 18, bookings: 15 },
  ];

  const viewData = [
    { name: '1 Mar', views: 120, saves: 24 },
    { name: '5 Mar', views: 240, saves: 48 },
    { name: '10 Mar', views: 180, saves: 36 },
    { name: '15 Mar', views: 320, saves: 64 },
    { name: '20 Mar', views: 450, saves: 90 },
    { name: '25 Mar', views: 380, saves: 76 },
    { name: '30 Mar', views: 520, saves: 104 },
  ];

  const ratingData = [
    { name: '5 Stars', value: 45 },
    { name: '4 Stars', value: 30 },
    { name: '3 Stars', value: 15 },
    { name: '2 Stars', value: 7 },
    { name: '1 Star', value: 3 },
  ];

  const bookingTrend = [
    { name: 'Jan', bookings: 40 },
    { name: 'Feb', bookings: 55 },
    { name: 'Mar', bookings: 85 },
    { name: 'Apr', bookings: 120 },
    { name: 'May', bookings: 150 },
    { name: 'Jun', bookings: 210 },
  ];

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (profile?.status === 'pending') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShieldCheck size={48} />
        </div>
        <h1 className="text-4xl font-serif font-bold text-[#5A5A40] mb-4">Registration Pending</h1>
        <p className="text-gray-500 max-w-lg mx-auto text-lg mb-12">
          Your business profile for <span className="font-bold text-gray-900">{profile.business_name}</span> is currently being reviewed by our team. You'll have full access once approved.
        </p>
        <div className="bg-white p-8 rounded-[40px] border border-black/5 max-w-2xl mx-auto text-left">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <AlertCircle size={20} className="text-amber-500" />
            What happens next?
          </h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
              <p className="text-gray-600">Our team reviews your registration certificate and business details (usually within 24-48 hours).</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
              <p className="text-gray-600">Once verified, your package subscription will be activated.</p>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
              <p className="text-gray-600">Your business will appear in search results and you'll get full access to the dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-serif font-bold text-[#5A5A40]">{profile?.business_name}</h1>
            <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-green-100">Approved</span>
          </div>
          <p className="text-gray-500">Welcome back, {profile?.full_name}. Here is your performance overview.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-1 bg-white rounded-2xl shadow-sm border border-black/5">
            {['daily', 'weekly', 'monthly', 'yearly'].map(range => (
              <button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${timeRange === range ? 'bg-[#5A5A40] text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="p-4 bg-white rounded-2xl border border-black/5 text-[#5A5A40] hover:bg-gray-50 transition-all shadow-sm">
            <Package size={20} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Views', value: '12.4k', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Interactions', value: '842', icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Avg Rating', value: '4.8', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Bookings', value: '156', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
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

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Interaction Bar Chart */}
        <div className="bg-white p-10 rounded-[48px] border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-bold text-gray-900">Interactions</h3>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#5A5A40]"></div>Calls</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#8A8A60]"></div>WhatsApp</div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={interactionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: '#f5f5f0' }}
                />
                <Bar dataKey="calls" fill="#5A5A40" radius={[4, 4, 0, 0]} />
                <Bar dataKey="whatsapp" fill="#8A8A60" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Views Line Chart */}
        <div className="bg-white p-10 rounded-[48px] border border-black/5 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-10">Views & Saves</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="views" stroke="#5A5A40" strokeWidth={4} dot={false} />
                <Line type="monotone" dataKey="saves" stroke="#C0C0B0" strokeWidth={4} dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Rating Pie Chart */}
        <div className="bg-white p-10 rounded-[48px] border border-black/5 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-10">Rating Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ratingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ratingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-6">
            {ratingData.map((item, idx) => (
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

        {/* Booking Area Chart */}
        <div className="md:col-span-2 bg-white p-10 rounded-[48px] border border-black/5 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-10">Booking Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingTrend}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5A5A40" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#5A5A40" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                <Tooltip />
                <Area type="monotone" dataKey="bookings" stroke="#5A5A40" strokeWidth={4} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
