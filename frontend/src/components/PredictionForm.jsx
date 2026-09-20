import React, { useState } from 'react';
import { Leaf, MapPin, Loader2, Thermometer, Droplets, Wind, Tractor, Sprout, Sprout as Plant, CloudRain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { predictYield, fetchCurrentWeather, reverseGeocodeState } from '../api/apiClient';

export default function PredictionForm() {
    const [formData, setFormData] = useState({
        state: '',
        season: 'kharif',
        crop: 'wheat',
        plot_area: 1.0,
        avg_temp: 25.0,
        total_rainfall: 1200.0,
        humidity: 60.0,
        drought_index: 0.15,
        soil_type: 'loamy',
        soil_texture: 'silty',
        soil_ph: 6.5,
        soil_organic_carbon: 0.8,
        fertilizer_n: 100.0,
        fertilizer_p: 50.0,
        fertilizer_k: 50.0,
        previous_crop: 'fallow',
        year: new Date().getFullYear(),
        ndvi_mean: 0.75,
        production: 0.0
    });

    const [loadingLocation, setLoadingLocation] = useState(false);
    const [loadingPrediction, setLoadingPrediction] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: isNaN(Number(value)) || value === '' || name === 'state' || name === 'season' || name === 'crop' || name === 'soil_type' || name === 'soil_texture' || name === 'previous_crop' 
                ? value 
                : Number(value)
        }));
    };

    const handleAutoFill = () => {
        setLoadingLocation(true);
        setError('');
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const [stateName, weather] = await Promise.all([
                        reverseGeocodeState(latitude, longitude),
                        fetchCurrentWeather(latitude, longitude)
                    ]);
                    
                    const updateObj = {};
                    if(stateName) updateObj.state = stateName.toLowerCase();
                    if(weather && weather.current) {
                        updateObj.avg_temp = weather.current.temperature_2m;
                        updateObj.humidity = weather.current.relative_humidity_2m;
                        // OpenMeteo returns current rain rate. Approximate a season (90 days) if needed
                        updateObj.total_rainfall = weather.current.rain > 0 ? (weather.current.rain * 90) : formData.total_rainfall; 
                    }
                    setFormData(prev => ({ ...prev, ...updateObj }));
                } catch (err) {
                    setError("Could not fully resolve location data. " + err.message);
                } finally {
                    setLoadingLocation(false);
                }
            },
            () => {
                setError("Location permission denied. Please enable them.");
                setLoadingLocation(false);
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingPrediction(true);
        setError('');
        setResult(null);

        try {
            const data = await predictYield(formData);
            setResult(data);
        } catch (err) {
            setError(err.toString());
        } finally {
            setLoadingPrediction(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-50"
            >
                <div className="bg-gradient-to-r from-farmer-green to-farmer-light p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center"><Sprout className="mr-2" /> Crop Yield Estimator</h2>
                        <p className="text-green-50 mt-1 opacity-90">Enter parameters to forecast your harvest quantity</p>
                    </div>
                    <button 
                        type="button" 
                        onClick={handleAutoFill}
                        disabled={loadingLocation}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-sm disabled:opacity-50"
                    >
                        {loadingLocation ? <Loader2 className="w-5 h-5 animate-spin mr-2"/> : <MapPin className="w-5 h-5 mr-2" />}
                        Auto Fill My Location
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 border-b border-red-100 font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {/* Section 1: Basic & Location */}
                        <div className="space-y-4 col-span-1 lg:col-span-3 pb-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-700 flex items-center"><Tractor className="w-5 h-5 mr-2 text-farmer-light"/> 1. General Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">State</label>
                                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-farmer-light focus:ring-farmer-light p-2 border bg-gray-50" placeholder="e.g. karnataka" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Crop Type</label>
                                    <select name="crop" value={formData.crop} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-farmer-light focus:ring-farmer-light p-2 border bg-gray-50" required>
                                        <option value="cotton">Cotton</option>
                                        <option value="maize">Maize</option>
                                        <option value="rice">Rice</option>
                                        <option value="sugarcane">Sugarcane</option>
                                        <option value="wheat">Wheat</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Season</label>
                                    <select name="season" value={formData.season} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-farmer-light focus:ring-farmer-light p-2 border bg-gray-50" required>
                                        <option value="kharif">Kharif</option>
                                        <option value="rabi">Rabi</option>
                                        <option value="summer">Summer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Plot Area (Hectares)</label>
                                    <input type="number" step="0.1" name="plot_area" value={formData.plot_area} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 shadow-sm p-2 border bg-gray-50" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Forecasting Year</label>
                                    <input type="number" name="year" value={formData.year} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 shadow-sm p-2 border bg-gray-50" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Previous Crop</label>
                                    <input type="text" name="previous_crop" value={formData.previous_crop} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 shadow-sm p-2 border bg-gray-50" placeholder="e.g. rice" required />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Environment */}
                        <div className="space-y-4 col-span-1 lg:col-span-3 pb-4 border-b border-gray-100 mt-4">
                            <h3 className="text-lg font-semibold text-gray-700 flex items-center"><CloudRain className="w-5 h-5 mr-2 text-blue-400"/> 2. Climatic Conditions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1 flex justify-between">Avg Temp (°C) <Thermometer className="w-4 h-4 text-orange-400"/></label>
                                    <input type="number" step="0.1" name="avg_temp" value={formData.avg_temp} onChange={handleInputChange} className="w-full rounded-lg p-2 border border-gray-300 shadow-sm bg-gray-50" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1 flex justify-between">Rainfall (mm) <Droplets className="w-4 h-4 text-blue-400"/></label>
                                    <input type="number" step="0.1" name="total_rainfall" value={formData.total_rainfall} onChange={handleInputChange} className="w-full rounded-lg p-2 border border-gray-300 shadow-sm bg-gray-50" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1 flex justify-between">Humidity (%) <Wind className="w-4 h-4 text-teal-400"/></label>
                                    <input type="number" step="0.1" name="humidity" value={formData.humidity} onChange={handleInputChange} className="w-full rounded-lg p-2 border border-gray-300 shadow-sm bg-gray-50" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Drought Index (0-1)</label>
                                    <input type="number" step="0.01" name="drought_index" value={formData.drought_index} onChange={handleInputChange} className="w-full rounded-lg p-2 border border-gray-300 shadow-sm bg-gray-50" required />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Soil details */}
                        <div className="space-y-4 col-span-1 lg:col-span-3 mt-4">
                            <h3 className="text-lg font-semibold text-gray-700 flex items-center"><Plant className="w-5 h-5 mr-2 text-earth-brown"/> 3. Soil & Fertilizers</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Soil Type</label>
                                    <select name="soil_type" value={formData.soil_type} onChange={handleInputChange} className="w-full rounded-lg p-2 border border-gray-300 shadow-sm bg-gray-50">
                                        <option value="alluvial">Alluvial</option>
                                        <option value="black">Black</option>
                                        <option value="red">Red</option>
                                        <option value="laterite">Laterite</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Soil Texture</label>
                                    <select name="soil_texture" value={formData.soil_texture} onChange={handleInputChange} className="w-full rounded-lg p-2 border border-gray-300 shadow-sm bg-gray-50">
                                        <option value="clayey">Clayey</option>
                                        <option value="loamy">Loamy</option>
                                        <option value="sandy">Sandy</option>
                                        <option value="silty">Silty</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Soil pH</label>
                                    <input type="number" step="0.1" name="soil_ph" value={formData.soil_ph} onChange={handleInputChange} className="w-full rounded-lg p-2 border border-gray-300 shadow-sm bg-gray-50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Soil Carbon (%)</label>
                                    <input type="number" step="0.01" name="soil_organic_carbon" value={formData.soil_organic_carbon} onChange={handleInputChange} className="w-full rounded-lg p-2 border border-gray-300 shadow-sm bg-gray-50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Fertilizer N (kg)</label>
                                    <input type="number" step="0.1" name="fertilizer_n" value={formData.fertilizer_n} onChange={handleInputChange} className="w-full rounded-lg p-2 border border-gray-300 shadow-sm bg-gray-50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Fertilizer P (kg)</label>
                                    <input type="number" step="0.1" name="fertilizer_p" value={formData.fertilizer_p} onChange={handleInputChange} className="w-full rounded-lg p-2 border border-gray-300 shadow-sm bg-gray-50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Fertilizer K (kg)</label>
                                    <input type="number" step="0.1" name="fertilizer_k" value={formData.fertilizer_k} onChange={handleInputChange} className="w-full rounded-lg p-2 border border-gray-300 shadow-sm bg-gray-50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">NDVI Mean</label>
                                    <input type="number" step="0.01" name="ndvi_mean" value={formData.ndvi_mean} onChange={handleInputChange} className="w-full rounded-lg p-2 border border-gray-300 shadow-sm bg-gray-50" />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={loadingPrediction}
                            className={`w-full font-bold text-lg py-4 rounded-xl shadow-lg transition-all flex items-center justify-center text-white
                                ${loadingPrediction ? 'bg-farmer-light/80 cursor-not-allowed' : 'bg-farmer-green hover:bg-earth-brown focus:ring-4 focus:ring-green-300'}`}
                        >
                            {loadingPrediction ? <><Loader2 className="w-6 h-6 animate-spin mr-2"/> Analyzing Soil & Weather Data...</> : "Predict Crop Yield"}
                        </button>
                    </div>
                </form>
            </motion.div>

            <AnimatePresence>
                {result && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl p-8 border-t-8 border-farmer-green text-center relative overflow-hidden"
                    >
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 text-green-50">
                            <Leaf size={150} />
                        </div>
                        
                        <div className="relative z-10">
                            <h3 className="text-xl text-gray-500 font-semibold mb-2 uppercase tracking-wide">Predicted {result.crop} Yield</h3>
                            <div className="flex items-baseline justify-center mt-4 mb-2 shadow-sm rounded-xl py-6 bg-farm-bg/50">
                                <span className="text-7xl font-extrabold text-farmer-green drop-shadow-sm">{result.yield_t_ha}</span>
                                <span className="text-2xl text-gray-500 ml-2 font-medium">tons / hectare</span>
                            </div>
                            <p className="text-gray-500 mt-6 max-w-lg mx-auto">
                                Based on your inputs and our trained ML models incorporating historical climatic and soil data, this is the expected yield magnitude.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
