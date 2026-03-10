import { Map as MapIcon, Navigation, MapPin } from "lucide-react";

const hotspots = [
  { name: "Okavango Delta", x: "35%", y: "25%", activity: "High" },
  { name: "Chobe", x: "55%", y: "15%", activity: "Very High" },
  { name: "Gaborone", x: "75%", y: "85%", activity: "High" },
  { name: "Maun", x: "40%", y: "35%", activity: "Medium" },
  { name: "Makgadikgadi", x: "55%", y: "45%", activity: "Medium" },
];

const routes = [
  { name: "The Safari Loop", path: "Maun → Moremi → Savuti → Kasane", duration: "7-10 Days" },
  { name: "The Cultural Trail", path: "Gaborone → Serowe → Francistown", duration: "4-5 Days" },
];

export default function BotswanaHeatmap() {
  return (
    <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <MapIcon size={20} className="text-[#5A5A40]" />
          Tourist Activity Heatmap
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live Activity</span>
        </div>
      </div>

      {/* Map Visualization (Stylized) */}
      <div className="relative aspect-[4/3] bg-[#f5f5f0] rounded-3xl border border-black/5 overflow-hidden mb-8">
        {/* Stylized Botswana Shape (Simplified) */}
        <div className="absolute inset-10 border-2 border-dashed border-[#5A5A40]/20 rounded-[40px]" />
        
        {hotspots.map((spot, idx) => (
          <div 
            key={idx}
            className="absolute group cursor-pointer"
            style={{ left: spot.x, top: spot.y }}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              spot.activity === "Very High" ? "bg-red-500/20" : "bg-amber-500/20"
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                spot.activity === "Very High" ? "bg-red-500" : "bg-amber-500"
              } shadow-lg`} />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white px-3 py-1.5 rounded-xl shadow-xl border border-black/5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
              <p className="text-[10px] font-bold text-gray-800">{spot.name}</p>
              <p className="text-[8px] text-gray-400 uppercase font-bold">{spot.activity} Activity</p>
            </div>
          </div>
        ))}

        {/* Route Lines (Stylized) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <path d="M 40 35 L 55 15" stroke="#5A5A40" strokeWidth="2" strokeDasharray="4 4" fill="none" />
          <path d="M 75 85 L 55 45" stroke="#5A5A40" strokeWidth="2" strokeDasharray="4 4" fill="none" />
        </svg>
      </div>

      {/* Recommended Routes */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Navigation size={14} />
          Recommended Routes
        </h4>
        {routes.map((route, idx) => (
          <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-black/5 hover:border-[#5A5A40]/30 transition-all group cursor-pointer">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-gray-800 group-hover:text-[#5A5A40] transition-colors">{route.name}</span>
              <span className="text-[10px] font-bold text-[#5A5A40] bg-[#5A5A40]/10 px-2 py-0.5 rounded-full">{route.duration}</span>
            </div>
            <p className="text-[10px] text-gray-500 flex items-center gap-1">
              <MapPin size={10} />
              {route.path}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
