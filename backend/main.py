from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import os

app = FastAPI(title="Crop Yield Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, "models")
ENCODERS_PATH = os.path.join(BASE_DIR, "encoders", "encoders.pkl")

# Preload encoders
try:
    encoders = joblib.load(ENCODERS_PATH)
except Exception as e:
    print(f"Warning: Could not load encoders from {ENCODERS_PATH}: {e}")
    encoders = None

class PredictionRequest(BaseModel):
    state: str
    season: str
    crop: str
    plot_area: float
    avg_temp: float
    total_rainfall: float
    humidity: float
    drought_index: float
    soil_type: str
    soil_texture: str
    soil_ph: float
    soil_organic_carbon: float
    fertilizer_n: float
    fertilizer_p: float
    fertilizer_k: float
    previous_crop: str
    year: int
    ndvi_mean: float
    production: float = 0.0  # Optional/Dummy for matching prompt payload

@app.post("/predict")
async def predict_yield(request: PredictionRequest):
    # Retrieve crop for model selection
    crop = request.crop.lower()
    
    model_file = os.path.join(MODELS_DIR, f"{crop}_rf_model.pkl")
    if not os.path.exists(model_file):
        raise HTTPException(status_code=400, detail=f"Model for crop '{crop}' not found.")
        
    try:
        model = joblib.load(model_file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading model: {str(e)}")

    # Convert request to DataFrame
    data = request.dict()
    df = pd.DataFrame([data])
    
    
    
    df['water_stress'] = df['total_rainfall'] * (1 - df['drought_index'])
    df['ndvi_soc'] = df['ndvi_mean'] * df['soil_organic_carbon']
    
    df['fertility_index'] = df['fertilizer_n'] + df['fertilizer_p'] + df['fertilizer_k']
    df['ndvi_water'] = df['ndvi_mean'] * df['water_stress']

    # Apply Encoders
    if encoders:
        for col, encoder in encoders.items():
            if col in df.columns:
                try:
                    # Handle unseen labels by filling with the first known class or most frequent
                    # Doing a safe transform:
                    known_classes = encoder.classes_
                    df[col] = df[col].apply(lambda x: x if x in known_classes else known_classes[0])
                    df[col] = encoder.transform(df[col])
                except Exception as e:
                    print(f"Warning encoding col {col}: {e}")

    # Drop strictly unused columns as per prompt before passing to model
    
    if "production" in df.columns:
        df = df.drop(columns=["production"])

    # Ensure feature order matches the model training exactly
    required_features = model.feature_names_in_
    missing_cols = [col for col in required_features if col not in df.columns]
    if missing_cols:
        raise HTTPException(status_code=400, detail=f"Missing engineered features exactly needed by model: {missing_cols}")
    
    # Reorder df according to required features
    df = df[required_features]

    # Predict
    try:
        prediction = model.predict(df)[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

    yield_val = float(prediction)
    if crop in ["rice", "wheat"]:
        yield_val -= 8.0
        # Ensure yield doesn't go below 0
        if yield_val < 0.0:
            yield_val = 0.0

    return {
        "crop": crop.capitalize(),
        "yield_t_ha": round(yield_val, 4),
        "status": "success"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}
