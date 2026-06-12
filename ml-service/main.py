from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import numpy as np
import requests
import os
import pickle
import logging
import json
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

# Structured JSON Logger Setup
class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "timestamp": datetime.now().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "name": record.name
        }
        if record.exc_info:
            log_record["exc_info"] = self.formatException(record.exc_info)
        return json.dumps(log_record)

logger = logging.getLogger("deteclima_ml")
log_handler = logging.StreamHandler()
log_handler.setFormatter(JsonFormatter())
logger.addHandler(log_handler)
logger.setLevel(logging.INFO)

app = FastAPI(title="Deteclima ML Service", version="1.0.0")

# Explicit CORS allowed origins
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001,https://deteclima.vercel.app").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model state
model = None
model_metrics = {"r2": 0, "mae": 0, "rmse": 0}
model_version = "1.0.0"
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "model.pkl")


def load_saved_model():
    """Load model and metrics from .pkl file if it exists."""
    global model, model_metrics
    if os.path.exists(MODEL_PATH):
        try:
            with open(MODEL_PATH, "rb") as f:
                saved_data = pickle.load(f)
                model = saved_data["model"]
                model_metrics = saved_data["metrics"]
            logger.info(f"Successfully loaded model from {MODEL_PATH}")
        except Exception as e:
            logger.error(f"Error loading model from {MODEL_PATH}", exc_info=True)


@app.on_event("startup")
def startup_event():
    load_saved_model()


class PredictRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude between -90 and 90")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude between -180 and 180")


class PredictionItem(BaseModel):
    time: str
    temperature: float
    confidence: float


class PredictResponse(BaseModel):
    predictions: list[PredictionItem]
    metrics: dict
    model_version: str


def fetch_historical_data(lat: float, lon: float, days: int = 30):
    """Fetch historical weather data from Open-Meteo."""
    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")

    url = "https://archive-api.open-meteo.com/v1/archive"
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": start_date,
        "end_date": end_date,
        "hourly": "temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure,shortwave_radiation",
        "timezone": "auto",
    }

    response = requests.get(url, params=params, timeout=30)
    response.raise_for_status()
    return response.json()


def prepare_features(data: dict):
    """Extract features from weather data for training."""
    hourly = data["hourly"]
    times = hourly["time"]

    X, y = [], []
    for i in range(len(times) - 24):
        dt = datetime.fromisoformat(times[i])
        features = [
            hourly["temperature_2m"][i] if hourly["temperature_2m"][i] is not None else 0,
            hourly["relative_humidity_2m"][i] if hourly["relative_humidity_2m"][i] is not None else 0,
            hourly["wind_speed_10m"][i] if hourly["wind_speed_10m"][i] is not None else 0,
            hourly["surface_pressure"][i] if hourly["surface_pressure"][i] is not None else 0,
            hourly["shortwave_radiation"][i] if hourly["shortwave_radiation"][i] is not None else 0,
            dt.hour,
            dt.weekday(),
            dt.month,
        ]

        target = hourly["temperature_2m"][i + 24]
        if target is not None:
            X.append(features)
            y.append(target)

    return np.array(X), np.array(y)


def train_model(lat: float, lon: float):
    """Train a Random Forest model with historical data."""
    global model, model_metrics

    try:
        data = fetch_historical_data(lat, lon)
        X, y = prepare_features(data)

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        rf = RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42, n_jobs=-1)
        rf.fit(X_train, y_train)

        y_pred = rf.predict(X_test)
        model_metrics = {
            "r2": round(r2_score(y_test, y_pred), 4),
            "mae": round(mean_absolute_error(y_test, y_pred), 4),
            "rmse": round(float(np.sqrt(mean_squared_error(y_test, y_pred))), 4),
        }

        model = rf

        # Save model and metrics to .pkl
        try:
            os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
            with open(MODEL_PATH, "wb") as f:
                pickle.dump({"model": rf, "metrics": model_metrics}, f)
            logger.info(f"Successfully saved model and metrics to {MODEL_PATH}")
        except Exception as e:
            logger.error(f"Error saving model to {MODEL_PATH}", exc_info=True)

        return rf
    except Exception as e:
        logger.error(f"Error training model: {str(e)}", exc_info=True)
        raise RuntimeError(f"Error training model: {str(e)}")


@app.post("/predict", response_model=PredictResponse)
async def predict(req: PredictRequest):
    global model

    try:
        if model is None:
            train_model(req.latitude, req.longitude)

        # Get current conditions for prediction
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": req.latitude,
            "longitude": req.longitude,
            "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure,shortwave_radiation",
            "timezone": "auto",
        }
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        current = response.json()["current"]

        predictions = []
        now = datetime.now()

        for hour_offset in range(24):
            future_dt = now + timedelta(hours=hour_offset + 1)
            features = np.array([[
                current["temperature_2m"],
                current["relative_humidity_2m"],
                current["wind_speed_10m"],
                current["surface_pressure"],
                current["shortwave_radiation"],
                future_dt.hour,
                future_dt.weekday(),
                future_dt.month,
            ]])

            pred_temp = model.predict(features)[0]
            predictions.append(PredictionItem(
                time=future_dt.strftime("%Y-%m-%dT%H:00"),
                temperature=round(float(pred_temp), 1),
                confidence=round(model_metrics["r2"] * 100, 1),
            ))

        logger.info(f"Prediction generated successfully for lat: {req.latitude}, lon: {req.longitude}")
        return PredictResponse(
            predictions=predictions,
            metrics=model_metrics,
            model_version=model_version,
        )
    except Exception as e:
        logger.error("Error in prediction endpoint", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error in prediction: {str(e)}")


@app.post("/train")
async def trigger_train(req: PredictRequest):
    try:
        logger.info(f"Starting model training for lat: {req.latitude}, lon: {req.longitude}")
        train_model(req.latitude, req.longitude)
        logger.info(f"Model trained successfully. New metrics: {model_metrics}")
        return {"status": "success", "metrics": model_metrics, "model_version": model_version}
    except Exception as e:
        logger.error("Error in train endpoint", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/metrics")
async def get_metrics():
    return {"metrics": model_metrics, "model_version": model_version}


@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": model is not None}
