import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Thermometer, Wind } from 'lucide-react';

interface WeatherData {
  temp: number;
  condition: string;
  wind: number;
}

export default function WeatherWidget({ lat, lng }: { lat: number, lng: number }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
        const data = await res.json();
        setWeather({
          temp: data.current_weather.temperature,
          condition: data.current_weather.weathercode,
          wind: data.current_weather.windspeed
        });
      } catch (error) {
        console.error('Weather fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng]);

  if (loading) return <div className="h-24 bg-gray-50 rounded-2xl animate-pulse"></div>;
  if (!weather) return null;

  const getIcon = (code: any) => {
    if (code <= 3) return <Sun className="text-amber-500" size={32} />;
    if (code <= 48) return <Cloud className="text-gray-400" size={32} />;
    return <CloudRain className="text-blue-400" size={32} />;
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-black/5 flex items-center gap-6 shadow-sm">
      <div className="p-4 bg-gray-50 rounded-2xl">
        {getIcon(weather.condition)}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Thermometer size={14} className="text-gray-400" />
          <span className="text-2xl font-bold text-gray-900">{weather.temp}°C</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-1">
            <Wind size={12} />
            <span>{weather.wind} km/h</span>
          </div>
          <span>Botswana Time</span>
        </div>
      </div>
    </div>
  );
}
