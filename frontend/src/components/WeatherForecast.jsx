import React, { useState, useEffect } from 'react';
import { fetchWeatherForecast } from '../api/apiClient';
import { Sun, CloudRain, Droplets, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const getDayName = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

export default function WeatherForecast() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getLocationAndWeather = () => {
    setLoading(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const data = await fetchWeatherForecast(lat, lon);
          
          if (data && data.daily) {
            setForecast(data.daily);
          } else {
            setError("No forecast data returned.");
          }
        } catch (err) {
          setError(err.toString());
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError(`Location access denied. Please enable location services.`);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    getLocationAndWeather();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-50">
        <div className="flex justify-between items-center border-b border-gray-100 pb-6 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-800">7-Day Local Forecast</h2>
            <p className="text-gray-500 mt-1 flex items-center">
              <MapPin className="w-4 h-4 mr-1"/> Precision Agricultural Weather
            </p>
          </div>
          <button 
            onClick={getLocationAndWeather}
            disabled={loading}
            className="bg-farmer-light hover:bg-farmer-green text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-md disabled:bg-gray-300"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : "Refresh Location"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center">
            {error}
          </div>
        )}

        {loading && !forecast && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-farmer-light animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Acquiring weather patterns...</p>
          </div>
        )}

        {forecast && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {forecast.time.map((timeStr, index) => (
              <motion.div 
                key={timeStr} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-farm-bg rounded-xl p-5 border border-green-50 hover:shadow-lg transition-shadow relative overflow-hidden ${index === 0 ? 'ring-2 ring-farmer-light bg-green-50/50' : ''}`}
              >
                {index === 0 && <span className="absolute top-0 right-0 bg-farmer-light text-white text-xs font-bold px-2 py-1 rounded-bl-lg">TODAY</span>}
                <div className="text-gray-600 font-semibold mb-3">{getDayName(timeStr)}</div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Sun className="w-8 h-8 text-amber-500 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-gray-800">{forecast.temperature_2m_max[index]}°C</div>
                      <div className="text-sm text-gray-500">Min: {forecast.temperature_2m_min[index]}°C</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200/60 pt-3 flex flex-col gap-2">
                    <div className="flex items-center text-sm font-medium text-blue-600">
                      <CloudRain className="w-4 h-4 mr-2" />
                      {forecast.rain_sum[index]} mm
                    </div>
                    <div className="flex items-center text-sm font-medium text-emerald-600">
                      <Droplets className="w-4 h-4 mr-2" />
                      {forecast.relative_humidity_2m_max[index]}% Hum
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
