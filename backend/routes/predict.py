import os
import joblib
import numpy as np
import pandas as pd
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend import models, schemas
from backend.services import recommendation as rec_service
from backend.routes.auth import get_current_user_optional

router = APIRouter(prefix="/predict", tags=["Predictions"])

MODELS_CACHE = {}

def get_model_payload(model_name: str):
    if model_name not in MODELS_CACHE:
        # Check standard locations
        possible_paths = [
            f"models/{model_name}.pkl",
            f"../models/{model_name}.pkl",
            f"/app/models/{model_name}.pkl" # for Docker container
        ]
        
        path = None
        for p in possible_paths:
            if os.path.exists(p):
                path = p
                break
                
        if not path:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Machine Learning model '{model_name}.pkl' is not loaded on the server. Please run model training."
            )
        MODELS_CACHE[model_name] = joblib.load(path)
        
    return MODELS_CACHE[model_name]

# Helper function to compute predictions
def predict_disease_risk(model_name: str, features_dict: dict) -> tuple:
    payload = get_model_payload(model_name)
    pipeline = payload["pipeline"]
    feature_names = payload["features"]
    
    # Arrange features in the exact order model was trained on
    ordered_features = []
    for col in feature_names:
        if col not in features_dict:
            # Fallback for missing features (imputer will handle, but nice to provide default)
            ordered_features.append(0.0)
        else:
            ordered_features.append(features_dict[col])
            
    features_arr = np.array(ordered_features).reshape(1, -1)
    
    # Predict probability
    prob = float(pipeline.predict_proba(features_arr)[0, 1] * 100)
    
    # Classify risk level
    if prob >= 70.0:
        risk_level = "High"
    elif prob >= 30.0:
        risk_level = "Moderate"
    else:
        risk_level = "Low"
        
    return prob, risk_level

# --- Individual Prediction Endpoints ---

@router.post("/diabetes", response_model=schemas.PredictionResponse)
def predict_diabetes(assessment: schemas.AssessmentCreate):
    features = {
        "Pregnancies": assessment.pregnancies,
        "Glucose": assessment.glucose,
        "BloodPressure": assessment.diastolic_bp,
        "SkinThickness": assessment.skin_thickness,
        "Insulin": assessment.insulin,
        "BMI": assessment.weight / ((assessment.height / 100) ** 2),
        "DiabetesPedigreeFunction": assessment.dpf,
        "Age": assessment.age
    }
    
    prob, risk = predict_disease_risk("diabetes", features)
    bmi = features["BMI"]
    recs = rec_service.get_recommendations(
        "Diabetes", prob, risk, assessment.age, bmi,
        assessment.smoke, assessment.alcohol, assessment.active, assessment.family_history,
        assessment.systolic_bp, assessment.diastolic_bp, assessment.glucose
    )
    return {"disease": "Diabetes", "probability": prob, "risk_level": risk, "recommendations": recs}

@router.post("/anemia", response_model=schemas.PredictionResponse)
def predict_anemia(assessment: schemas.AssessmentCreate):
    features = {
        "Gender": assessment.gender,
        "Hemoglobin": assessment.hemoglobin,
        "MCH": assessment.mch,
        "MCHC": assessment.mchc,
        "MCV": assessment.mcv
    }
    
    prob, risk = predict_disease_risk("anemia", features)
    bmi = assessment.weight / ((assessment.height / 100) ** 2)
    recs = rec_service.get_recommendations(
        "Anemia", prob, risk, assessment.age, bmi,
        assessment.smoke, assessment.alcohol, assessment.active, assessment.family_history,
        assessment.systolic_bp, assessment.diastolic_bp, assessment.glucose
    )
    return {"disease": "Anaemia", "probability": prob, "risk_level": risk, "recommendations": recs}

@router.post("/heart", response_model=schemas.PredictionResponse)
def predict_heart(assessment: schemas.AssessmentCreate):
    # Mapping gender: 1 for Female, 2 for Male (dataset specific)
    gender_mapped = 2 if assessment.gender == 0 else 1
    
    # Map glucose to 1, 2, or 3
    gluc_mapped = 1
    if assessment.glucose >= 200:
        gluc_mapped = 3
    elif assessment.glucose >= 140:
        gluc_mapped = 2
        
    # Map cholesterol level based on age and vitals (defaults to 1, normal)
    chol_mapped = 1
    bmi = assessment.weight / ((assessment.height / 100) ** 2)
    if bmi >= 30.0 or assessment.systolic_bp >= 140:
        chol_mapped = 2
    if bmi >= 35.0 and assessment.systolic_bp >= 160:
        chol_mapped = 3
        
    features = {
        "age": assessment.age,
        "gender": gender_mapped,
        "height": int(assessment.height),
        "weight": int(assessment.weight),
        "ap_hi": assessment.systolic_bp,
        "ap_lo": assessment.diastolic_bp,
        "cholesterol": chol_mapped,
        "gluc": gluc_mapped,
        "smoke": assessment.smoke,
        "alco": assessment.alcohol,
        "active": assessment.active
    }
    
    prob, risk = predict_disease_risk("heart", features)
    recs = rec_service.get_recommendations(
        "Cardiovascular", prob, risk, assessment.age, bmi,
        assessment.smoke, assessment.alcohol, assessment.active, assessment.family_history,
        assessment.systolic_bp, assessment.diastolic_bp, assessment.glucose
    )
    return {"disease": "Cardiovascular", "probability": prob, "risk_level": risk, "recommendations": recs}

@router.post("/kidney", response_model=schemas.PredictionResponse)
def predict_kidney(assessment: schemas.AssessmentCreate):
    # Map hypertension binary, diabetes mellitus, anemia binaries based on clinical stats
    htn_val = 1 if (assessment.systolic_bp >= 130 or assessment.diastolic_bp >= 80) else 0
    dm_val = 1 if assessment.glucose >= 126 else 0
    
    # Anemia threshold
    ane_val = 0
    if assessment.gender == 0 and assessment.hemoglobin < 13.5:
        ane_val = 1
    elif assessment.gender == 1 and assessment.hemoglobin < 12.0:
        ane_val = 1
        
    features = {
        "age": assessment.age,
        "bp": assessment.diastolic_bp,
        "sg": assessment.sg,
        "al": assessment.albumin,
        "su": assessment.sugar,
        "bgr": assessment.glucose,
        "bu": assessment.blood_urea,
        "sc": assessment.serum_creatinine,
        "sod": assessment.sodium,
        "pot": assessment.potassium,
        "hemo": assessment.hemoglobin,
        "pcv": assessment.pcv,
        "htn": htn_val,
        "dm": dm_val,
        "ane": ane_val
    }
    
    prob, risk = predict_disease_risk("kidney", features)
    bmi = assessment.weight / ((assessment.height / 100) ** 2)
    recs = rec_service.get_recommendations(
        "Kidney", prob, risk, assessment.age, bmi,
        assessment.smoke, assessment.alcohol, assessment.active, assessment.family_history,
        assessment.systolic_bp, assessment.diastolic_bp, assessment.glucose
    )
    return {"disease": "Chronic Kidney Disease", "probability": prob, "risk_level": risk, "recommendations": recs}

@router.post("/hypertension", response_model=schemas.PredictionResponse)
def predict_hypertension(assessment: schemas.AssessmentCreate):
    bmi = assessment.weight / ((assessment.height / 100) ** 2)
    features = {
        "Age": assessment.age,
        "Gender": assessment.gender,
        "BMI": bmi,
        "SystolicBP": assessment.systolic_bp,
        "DiastolicBP": assessment.diastolic_bp,
        "Smoke": assessment.smoke,
        "Active": assessment.active,
        "FamilyHistory": assessment.family_history,
        "SaltIntake": assessment.salt_intake
    }
    
    prob, risk = predict_disease_risk("hypertension", features)
    recs = rec_service.get_recommendations(
        "Hypertension", prob, risk, assessment.age, bmi,
        assessment.smoke, assessment.alcohol, assessment.active, assessment.family_history,
        assessment.systolic_bp, assessment.diastolic_bp, assessment.glucose
    )
    return {"disease": "Hypertension", "probability": prob, "risk_level": risk, "recommendations": recs}

# --- Unified Screening Endpoint ---

@router.post("/unified", response_model=schemas.ReportDetailsResponse)
def predict_unified(
    assessment_data: schemas.AssessmentCreate,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user_optional)
):
    """
    Runs all 5 models in parallel, generates recommendations,
    persists records to database (optionally linked to authenticated user),
    and returns full diagnostic report.
    """
    bmi_calc = assessment_data.weight / ((assessment_data.height / 100) ** 2)
    
    # Create Assessment DB Record
    db_assessment = models.Assessment(
        user_id=current_user.id if current_user else None,
        age=assessment_data.age,
        gender=assessment_data.gender,
        height=assessment_data.height,
        weight=assessment_data.weight,
        bmi=bmi_calc,
        systolic_bp=assessment_data.systolic_bp,
        diastolic_bp=assessment_data.diastolic_bp,
        glucose=assessment_data.glucose,
        smoke=assessment_data.smoke,
        alcohol=assessment_data.alcohol,
        active=assessment_data.active,
        salt_intake=assessment_data.salt_intake,
        family_history=assessment_data.family_history,
        pregnancies=assessment_data.pregnancies,
        skin_thickness=assessment_data.skin_thickness,
        insulin=assessment_data.insulin,
        dpf=assessment_data.dpf,
        sg=assessment_data.sg,
        albumin=assessment_data.albumin,
        sugar=assessment_data.sugar,
        blood_urea=assessment_data.blood_urea,
        serum_creatinine=assessment_data.serum_creatinine,
        sodium=assessment_data.sodium,
        potassium=assessment_data.potassium,
        hemoglobin=assessment_data.hemoglobin,
        pcv=assessment_data.pcv,
        mch=assessment_data.mch,
        mchc=assessment_data.mchc,
        mcv=assessment_data.mcv
    )
    
    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)
    
    # Predict for each of the 5 diseases
    diseases = ["Diabetes", "Cardiovascular", "Kidney", "Anemia", "Hypertension"]
    predictions_list = []
    
    for dis in diseases:
        prob = 0.0
        risk = "Low"
        
        if dis == "Diabetes":
            features = {
                "Pregnancies": assessment_data.pregnancies,
                "Glucose": assessment_data.glucose,
                "BloodPressure": assessment_data.diastolic_bp,
                "SkinThickness": assessment_data.skin_thickness,
                "Insulin": assessment_data.insulin,
                "BMI": bmi_calc,
                "DiabetesPedigreeFunction": assessment_data.dpf,
                "Age": assessment_data.age
            }
            prob, risk = predict_disease_risk("diabetes", features)
            
        elif dis == "Cardiovascular":
            gender_mapped = 2 if assessment_data.gender == 0 else 1
            gluc_mapped = 1
            if assessment_data.glucose >= 200:
                gluc_mapped = 3
            elif assessment_data.glucose >= 140:
                gluc_mapped = 2
                
            chol_mapped = 1
            if bmi_calc >= 30.0 or assessment_data.systolic_bp >= 140:
                chol_mapped = 2
            if bmi_calc >= 35.0 and assessment_data.systolic_bp >= 160:
                chol_mapped = 3
                
            features = {
                "age": assessment_data.age,
                "gender": gender_mapped,
                "height": int(assessment_data.height),
                "weight": int(assessment_data.weight),
                "ap_hi": assessment_data.systolic_bp,
                "ap_lo": assessment_data.diastolic_bp,
                "cholesterol": chol_mapped,
                "gluc": gluc_mapped,
                "smoke": assessment_data.smoke,
                "alco": assessment_data.alcohol,
                "active": assessment_data.active
            }
            prob, risk = predict_disease_risk("heart", features)
            
        elif dis == "Kidney":
            htn_val = 1 if (assessment_data.systolic_bp >= 130 or assessment_data.diastolic_bp >= 80) else 0
            dm_val = 1 if assessment_data.glucose >= 126 else 0
            ane_val = 0
            if assessment_data.gender == 0 and assessment_data.hemoglobin < 13.5:
                ane_val = 1
            elif assessment_data.gender == 1 and assessment_data.hemoglobin < 12.0:
                ane_val = 1
                
            features = {
                "age": assessment_data.age,
                "bp": assessment_data.diastolic_bp,
                "sg": assessment_data.sg,
                "al": assessment_data.albumin,
                "su": assessment_data.sugar,
                "bgr": assessment_data.glucose,
                "bu": assessment_data.blood_urea,
                "sc": assessment_data.serum_creatinine,
                "sod": assessment_data.sodium,
                "pot": assessment_data.potassium,
                "hemo": assessment_data.hemoglobin,
                "pcv": assessment_data.pcv,
                "htn": htn_val,
                "dm": dm_val,
                "ane": ane_val
            }
            prob, risk = predict_disease_risk("kidney", features)
            
        elif dis == "Anemia":
            features = {
                "Gender": assessment_data.gender,
                "Hemoglobin": assessment_data.hemoglobin,
                "MCH": assessment_data.mch,
                "MCHC": assessment_data.mchc,
                "MCV": assessment_data.mcv
            }
            prob, risk = predict_disease_risk("anemia", features)
            
        elif dis == "Hypertension":
            features = {
                "Age": assessment_data.age,
                "Gender": assessment_data.gender,
                "BMI": bmi_calc,
                "SystolicBP": assessment_data.systolic_bp,
                "DiastolicBP": assessment_data.diastolic_bp,
                "Smoke": assessment_data.smoke,
                "Active": assessment_data.active,
                "FamilyHistory": assessment_data.family_history,
                "SaltIntake": assessment_data.salt_intake
            }
            prob, risk = predict_disease_risk("hypertension", features)
            
        # Get recommendations
        recs = rec_service.get_recommendations(
            dis, prob, risk, assessment_data.age, bmi_calc,
            assessment_data.smoke, assessment_data.alcohol, assessment_data.active, assessment_data.family_history,
            assessment_data.systolic_bp, assessment_data.diastolic_bp, assessment_data.glucose
        )
        
        # Save Prediction DB Record
        db_prediction = models.Prediction(
            assessment_id=db_assessment.id,
            disease="Anaemia" if dis == "Anemia" else dis, # spelling correction
            probability=prob,
            risk_level=risk
        )
        db.add(db_prediction)
        db.commit()
        db.refresh(db_prediction)
        
        # Save Recommendations DB Records
        for rec_text in recs:
            db_rec = models.Recommendation(
                prediction_id=db_prediction.id,
                recommendation_text=rec_text
            )
            db.add(db_rec)
            
        db.commit()
        
        predictions_list.append({
            "disease": "Anaemia" if dis == "Anemia" else dis,
            "probability": prob,
            "risk_level": risk,
            "recommendations": recs
        })
        
    return {
        "assessment": db_assessment,
        "predictions": predictions_list
    }
