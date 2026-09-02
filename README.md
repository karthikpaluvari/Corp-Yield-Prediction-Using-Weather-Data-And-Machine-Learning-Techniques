# Crop Yield Prediction

A full-stack machine learning application that predicts crop yield based on various environmental and agricultural factors. This project combines a Python backend with a React frontend to provide an intuitive interface for crop yield forecasting.

## Features

- **Accurate Predictions**: ML models trained on comprehensive crop production datasets
- **Real-time Weather Integration**: Incorporates rainfall and temperature data for predictions
- **User-Friendly Interface**: Interactive frontend for easy prediction queries
- **Data Validation**: Comprehensive data preprocessing and validation pipelines
- **Multiple Datasets**: Support for various crop, fertilizer, and weather datasets

## Tech Stack

### Backend
- **Python 3.x**
- **Flask/FastAPI** (API server)
- **scikit-learn** (ML models)
- **pandas** (Data processing)
- **numpy** (Numerical computations)

### Frontend
- **React** (UI framework)
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **ESLint** (Code quality)

### Data & Models
- **Datasets**: CSV files for crops, production, yield, fertilizers, rainfall, and temperature
- **Encoders**: Pre-trained sklearn encoders for categorical variables

## Project Structure

```
crop-yield-prediction/
├── backend/                          # Python backend
│   ├── main.py                      # Main application entry point
│   └── requirements.txt             # Python dependencies
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── PredictionForm.jsx   # Form for yield predictions
│   │   │   └── WeatherForecast.jsx  # Weather data display
│   │   ├── api/
│   │   │   └── apiClient.js         # API communication
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # React entry point
│   ├── package.json                 # Node dependencies
│   ├── vite.config.js               # Vite configuration
│   └── tailwind.config.js           # Tailwind CSS config
├── models/                          # Trained ML models
├── encoders/                        # Sklearn encoders
├── data/                            # Processed data
├── datasets/                        # Raw datasets
│   ├── Crop_production.csv
│   ├── crop_yield.csv
│   ├── Fertilizer.csv
│   ├── final_rainfall.csv
│   ├── final_temperature.csv
│   └── ... (additional datasets)
└── README.md                        # This file
```

## Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Train the Models
   - Train the models using anaconda navigator and provided ipynb file
### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run the backend server:
```bash
python main.py
```

The backend will be available at `http://localhost:5000` (or configured port).

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Usage

1. **Start Backend**: Run the Python server from the backend directory
2. **Start Frontend**: Run the development server from the frontend directory
3. **Make Predictions**: 
   - Fill in the prediction form with crop details
   - Input environmental factors (rainfall, temperature)
   - Submit to receive yield predictions

## Data Description

### Datasets
- **Crop Production**: Contains historical crop production data
- **Crop Yield**: Yield per unit area for various crops
- **Fertilizer Data**: Fertilizer usage patterns and effects
- **Weather Data**: Historical rainfall and temperature records
- **Validation Sets**: Dedicated validation datasets for model evaluation

### Preprocessing
All datasets have been preprocessed and cleaned:
- Missing values handled
- Outliers removed
- Features normalized
- Categorical variables encoded

## Model Training

Models are trained on historical data covering multiple seasons and regions:
- Feature engineering applied for weather conditions
- Cross-validation for robust performance
- Hyperparameter tuning completed
- Model performance validated on test sets

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Future Enhancements

- [ ] Add regional crop predictions
- [ ] Integrate satellite imagery data
- [ ] Deploy to cloud platform
- [ ] Add visualization dashboards
- [ ] Implement time-series forecasting
- [ ] Add pest/disease risk predictions


---

**Project maintained by**: [Harsha Vardhan](https://github.com/harsha-vardh)
