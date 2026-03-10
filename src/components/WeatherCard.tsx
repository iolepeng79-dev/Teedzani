import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, CloudSun, Thermometer } from "lucide-react";

interface WeatherCardProps {
  location: string;
}

export default function WeatherCard({ location }: WeatherCardProps) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/weather/${location}`)
      .then(res => res.json())
      .then(data => {
        setWeather(data);
        setLoading(false);
      });
  }, [location]);

  if (loading) return <div className="animate-pulse bg-gray-100 h-24 rounded-2xl" />;

  const Icon = weather.icon === "Sun" ? Sun : 
               weather.icon === "CloudSun" ? CloudSun : 
               weather.icon === "CloudRain" ? CloudRain : Cloud;

  return (
    <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
        <Icon size={24} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">{weather.temp}°C</span>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{weather.condition}</span>
        </div>
        <p className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-widest mt-0.5">{weather.seasonal}</p>
      </div>
    </div>
  );
}
