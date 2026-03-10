import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { month: "Jan", visibility: 30, label: "Rainy" },
  { month: "Feb", visibility: 35, label: "Rainy" },
  { month: "Mar", visibility: 45, label: "Trans" },
  { month: "Apr", visibility: 60, label: "Dry" },
  { month: "May", visibility: 80, label: "Peak" },
  { month: "Jun", visibility: 95, label: "Peak" },
  { month: "Jul", visibility: 100, label: "Peak" },
  { month: "Aug", visibility: 98, label: "Peak" },
  { month: "Sep", visibility: 90, label: "Peak" },
  { month: "Oct", visibility: 85, label: "Dry" },
  { month: "Nov", visibility: 50, label: "Trans" },
  { month: "Dec", visibility: 40, label: "Rainy" },
];

export default function SafariIntelligence() {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Safari Season Intelligence</h3>
          <p className="text-xs text-gray-500">Optimal wildlife viewing opportunities by month</p>
        </div>
      </div>
      
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{fontSize: 10, fill: '#999'}} 
            />
            <YAxis hide />
            <Tooltip 
              cursor={{fill: '#f5f5f0'}}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }}
              formatter={(value: number) => [`${value}% Visibility`, 'Wildlife Strength']}
            />
            <Bar dataKey="visibility" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.visibility > 80 ? '#5A5A40' : entry.visibility > 50 ? '#8A8A60' : '#C0C0B0'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#5A5A40]" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Peak Season</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#8A8A60]" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dry Season</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#C0C0B0]" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rainy Season</span>
        </div>
      </div>
    </div>
  );
}
