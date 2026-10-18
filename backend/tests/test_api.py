import pytest
from fastapi.testclient import TestClient
import sys
import os

# Adjust sys.path to find the backend module
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data

def test_guest_unified_prediction():
    payload = {
        "age": 45,
        "gender": 1,
        "height": 160.0,
        "weight": 65.0,
        "systolic_bp": 120,
        "diastolic_bp": 80,
        "glucose": 95,
        "smoke": 0,
        "alcohol": 0,
        "active": 1,
        "salt_intake": 2,
        "family_history: ": 0,
        "pregnancies": 2,
        "sg": 1.020,
        "albumin": 0.0,
        "sugar": 0.0,
        "blood_urea": 35.0,
        "serum_creatinine": 0.9,
        "sodium": 138.0,
        "potassium": 4.2,
        "hemoglobin": 13.5,
        "pcv": 40.0,
        "mch": 30.0,
        "mchc": 33.5,
        "mcv": 90.0
    }
    response = client.post("/api/predict/unified", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    # Assert return structure
    assert "assessment" in data
    assert "predictions" in data
    assert len(data["predictions"]) == 5
    
    # Check predictions structure
    for pred in data["predictions"]:
        assert "disease" in pred
        assert "probability" in pred
        assert "risk_level" in pred
        assert "recommendations" in pred
        assert isinstance(pred["recommendations"], list)
