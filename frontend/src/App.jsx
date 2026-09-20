import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Leaf, CloudRain } from 'lucide-react';
import PredictionForm from './components/PredictionForm';
import WeatherForecast from './components/WeatherForecast';

function Navigation() {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Yield Prediction', icon: <Leaf className="w-5 h-5 mr-2" /> },
    { path: '/weather', label: '7-Day Forecast', icon: <CloudRain className="w-5 h-5 mr-2" /> },
  ];

  return (
    <nav className="bg-white shadow-md rounded-xl p-2 mb-8 mx-auto max-w-lg mt-8 flex justify-between">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg font-medium transition-colors ${
            location.pathname === item.path
              ? 'bg-farmer-light text-white'
              : 'text-gray-600 hover:bg-green-50 hover:text-farmer-green'
          }`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen relative flex flex-col font-sans">
        <header className="bg-farmer-green text-white py-6 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 flex items-center">
            <Leaf className="w-8 h-8 mr-3 text-green-200" />
            <h1 className="text-3xl font-bold tracking-tight">SmartAgri Predictor</h1>
          </div>
        </header>

        <main className="flex-grow w-full max-w-6xl mx-auto px-4 pb-12">
          <Navigation />
          <Routes>
            <Route path="/" element={<PredictionForm />} />
            <Route path="/weather" element={<WeatherForecast />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
