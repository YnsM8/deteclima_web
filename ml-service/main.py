from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import requests
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

app = FastAPI(title="Deteclima ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model state
model = None
model_metrics = {"r2": 0, "mae": 0, "rmse": 0}
model_version = "1.0.0"


class PredictRequest(BaseModel):
    latitude: float
    longitude: float


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
    return rf


@app.post("/predict", response_model=PredictResponse)
async def predict(req: PredictRequest):
    global model

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

    return PredictResponse(
        predictions=predictions,
        metrics=model_metrics,
        model_version=model_version,
    )


@app.get("/metrics")
async def get_metrics():
    return {"metrics": model_metrics, "model_version": model_version}


@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": model is not None}
