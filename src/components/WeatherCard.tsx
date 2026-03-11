import { useState, useEffect } from "react";
import { Sun, Cloud, CloudRain, CloudSun, Wind, MapPin } from "lucide-react";

interface WeatherCardProps {
  location: string;
  lat?: number;
  lng?: number;
}

export default function WeatherCard({ location, lat, lng }: WeatherCardProps) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Default to Gaborone if no coordinates provided
        const latitude = lat || -24.6282;
        const longitude = lng || 25.9231;
        
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const data = await response.json();
        
        const current = data.current_weather;
        const code = current.weathercode;
        
        let icon = "Cloud";
        let condition = "Cloudy";
        
        if (code === 0) { icon = "Sun"; condition = "Sunny"; }
        else if (code <= 3) { icon = "CloudSun"; condition = "Partly Cloudy"; }
        else if (code <= 67) { icon = "CloudRain"; condition = "Rainy"; }
        
        setWeather({
          temp: Math.round(current.temperature),
          condition: condition,
          icon: icon,
          wind: current.windspeed,
          seasonal: latitude < 0 ? "Southern Hemisphere Season" : "Northern Hemisphere Season"
        });
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng, location]);

  if (loading) return <div className="animate-pulse bg-gray-100 h-24 rounded-2xl" />;
  if (!weather) return null;

  const Icon = weather.icon === "Sun" ? Sun : 
               weather.icon === "CloudSun" ? CloudSun : 
               weather.icon === "CloudRain" ? CloudRain : Cloud;

  return (
    <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Local Weather</h4>
        <div className="flex items-center gap-1 text-[10px] font-bold text-[#5A5A40] uppercase tracking-tighter">
          <MapPin size={10} />
          {location}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
          <Icon size={24} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">{weather.temp}°C</span>
            <span className="text-xs font-semibold text-gray-500 uppercase">{weather.condition}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Wind size={12} className="text-gray-400" />
            <span className="text-[10px] font-medium text-gray-400">{weather.wind} km/h wind</span>
          </div>
        </div>
      </div>
    </div>
  );
}
