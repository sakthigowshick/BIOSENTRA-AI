from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# --- User Schemas ---
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Assessment Schemas ---
class AssessmentCreate(BaseModel):
    # Demographics
    age: int = Field(..., ge=1, le=120)
    gender: int = Field(..., description="0 for Male, 1 for Female")
    height: float = Field(..., ge=50.0, le=250.0) # in cm
    weight: float = Field(..., ge=10.0, le=300.0) # in kg
    
    # Vitals
    systolic_bp: int = Field(..., ge=50, le=250)
    diastolic_bp: int = Field(..., ge=30, le=150)
    glucose: int = Field(..., ge=40, le=500)
    
    # Lifestyle
    smoke: int = Field(0, description="0: No, 1: Yes")
    alcohol: int = Field(0, description="0: No, 1: Yes")
    active: int = Field(1, description="0: No, 1: Yes")
    salt_intake: int = Field(2, description="1: Low, 2: Normal, 3: High")
    family_history: int = Field(0, description="0: No, 1: Yes")
    
    # Optional Lab / Advanced values (with clinic typical default fallbacks)
    pregnancies: Optional[int] = Field(0, ge=0, le=20)
    skin_thickness: Optional[float] = Field(20.0, ge=0.0, le=100.0)
    insulin: Optional[float] = Field(80.0, ge=0.0, le=1000.0)
    dpf: Optional[float] = Field(0.47, ge=0.0, le=3.0) # Diabetes Pedigree Function
    
    # Kidney Specific
    sg: Optional[float] = Field(1.020, ge=1.000, le=1.035) # Specific gravity
    albumin: Optional[float] = Field(0.0, ge=0.0, le=5.0)  # Albumin (0-5 scale)
    sugar: Optional[float] = Field(0.0, ge=0.0, le=5.0)     # Sugar (0-5 scale)
    blood_urea: Optional[float] = Field(35.0, ge=1.0, le=400.0)
    serum_creatinine: Optional[float] = Field(0.9, ge=0.1, le=20.0)
    sodium: Optional[float] = Field(138.0, ge=80.0, le=180.0)
    potassium: Optional[float] = Field(4.2, ge=1.0, le=10.0)
    
    # Anemia Specific
    hemoglobin: Optional[float] = Field(14.0, ge=2.0, le=25.0)
    mch: Optional[float] = Field(30.0, ge=10.0, le=50.0)
    mchc: Optional[float] = Field(33.5, ge=20.0, le=45.0)
    mcv: Optional[float] = Field(90.0, ge=40.0, le=150.0)
    pcv: Optional[float] = Field(42.0, ge=10.0, le=60.0)

# --- Recommendation Schemas ---
class RecommendationResponse(BaseModel):
    id: int
    recommendation_text: str

    class Config:
        from_attributes = True

# --- Prediction Schemas ---
class PredictionResponse(BaseModel):
    disease: str
    probability: float
    risk_level: str
    recommendations: List[str]

    class Config:
        from_attributes = True

# --- Report / Details Schemas ---
class AssessmentResponse(BaseModel):
    id: int
    user_id: Optional[int]
    age: int
    gender: int
    height: float
    weight: float
    bmi: float
    systolic_bp: int
    diastolic_bp: int
    glucose: int
    smoke: int
    alcohol: int
    active: int
    created_at: datetime

    class Config:
        from_attributes = True

class ReportDetailsResponse(BaseModel):
    assessment: AssessmentResponse
    predictions: List[PredictionResponse]

    class Config:
        from_attributes = True
