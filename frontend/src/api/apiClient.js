import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 10000,
});

export const predictYield = async (data) => {
    try {
        const response = await api.post('/predict', data);
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || error.message || 'An error occurred';
    }
};

export const fetchWeatherForecast = async (lat, lon) => {
    try {
        const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,rain_sum,relative_humidity_2m_max&timezone=auto`);
        return response.data;
    } catch (error) {
        throw error.message || 'Failed to fetch weather';
    }
};

export const fetchCurrentWeather = async (lat, lon) => {
    try {
        const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,rain&timezone=auto`);
        return response.data;
    } catch (error) {
        throw error.message || 'Failed to fetch current weather';
    }
};

export const reverseGeocodeState = async (lat, lon) => {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
        if (response.data && response.data.address) {
            return response.data.address.state || response.data.address.region || '';
        }
        return '';
    } catch (error) {
        throw error.message || 'Failed to geocode location';
    }
};
