import unittest
from fastapi.testclient import TestClient
from main import app, prepare_features, MODEL_PATH
import os
import numpy as np


class TestDeteclimaMLService(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_endpoint(self):
        """Test the health check endpoint returns 200 and expected structure."""
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("status", data)
        self.assertIn("model_loaded", data)

    def test_metrics_endpoint(self):
        """Test the metrics endpoint structure."""
        response = self.client.get("/metrics")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("metrics", data)
        self.assertIn("model_version", data)

    def test_pydantic_input_validation(self):
        """Test that the /predict endpoint validates latitude and longitude boundaries using Pydantic."""
        # Test invalid latitude > 90
        response = self.client.post("/predict", json={"latitude": 95.0, "longitude": -75.0})
        self.assertEqual(response.status_code, 422)  # Unprocessable Entity for Pydantic validation errors

        # Test invalid longitude < -180
        response = self.client.post("/predict", json={"latitude": -12.0, "longitude": -190.0})
        self.assertEqual(response.status_code, 422)

        # Test invalid field types
        response = self.client.post("/predict", json={"latitude": "not-a-number", "longitude": -75.0})
        self.assertEqual(response.status_code, 422)

    def test_prepare_features_shapes(self):
        """Test the prepare_features function with mock data to verify data prep logic."""
        mock_data = {
            "hourly": {
                "time": [f"2026-05-22T{h:02d}:00" for h in range(48)],
                "temperature_2m": [20.0 + (i % 5) for i in range(48)],
                "relative_humidity_2m": [60.0 for _ in range(48)],
                "wind_speed_10m": [10.0 for _ in range(48)],
                "surface_pressure": [1013.0 for _ in range(48)],
                "shortwave_radiation": [150.0 for _ in range(48)],
            }
        }
        X, y = prepare_features(mock_data)
        # 48 hours - 24 offset = 24 samples
        self.assertEqual(X.shape[0], 24)
        self.assertEqual(y.shape[0], 24)
        # Should have 8 features: Temp, Hum, Wind, Press, Rad, Hour, Day, Month
        self.assertEqual(X.shape[1], 8)


if __name__ == "__main__":
    unittest.main()
