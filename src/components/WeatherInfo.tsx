import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudLightning, Wind, Thermometer } from 'lucide-react';

interface WeatherInfoProps {
  lat: number;
  lng: number;
}

export default function WeatherInfo({ lat, lng }: WeatherInfoProps) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
        );
        const data = await response.json();
        setWeather(data.current_weather);
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng]);

  if (loading) return <div className="animate-pulse h-8 w-24 bg-gray-100 rounded-full"></div>;
  if (!weather) return null;

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="text-amber-500" size={18} />;
    if (code <= 3) return <Cloud className="text-gray-400" size={18} />;
    if (code <= 67) return <CloudRain className="text-blue-400" size={18} />;
    if (code <= 99) return <CloudLightning className="text-purple-500" size={18} />;
    return <Wind className="text-gray-400" size={18} />;
  };

  return (
    <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm border border-black/5 px-4 py-2 rounded-full">
      <div className="flex items-center gap-1.5">
        {getWeatherIcon(weather.weathercode)}
        <span className="text-sm font-bold text-gray-700">{weather.temperature}°C</span>
      </div>
      <div className="w-px h-3 bg-gray-200"></div>
      <div className="flex items-center gap-1.5">
        <Wind size={14} className="text-gray-400" />
        <span className="text-xs font-medium text-gray-500">{weather.windspeed} km/h</span>
      </div>
    </div>
  );
}
