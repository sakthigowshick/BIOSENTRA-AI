from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    assessments = relationship("Assessment", back_populates="user", cascade="all, delete-orphan")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True) # Nullable for guest assessment support
    
    # Demographics
    age = Column(Integer, nullable=False)
    gender = Column(Integer, nullable=False) # 0: Male, 1: Female (as in clinical codes)
    height = Column(Float, nullable=False)   # in cm
    weight = Column(Float, nullable=False)   # in kg
    bmi = Column(Float, nullable=False)
    
    # Vitals
    systolic_bp = Column(Integer, nullable=False)
    diastolic_bp = Column(Integer, nullable=False)
    glucose = Column(Integer, nullable=False)
    
    # Lifestyle
    smoke = Column(Integer, nullable=False)           # 0: No, 1: Yes
    alcohol = Column(Integer, nullable=False)         # 0: No, 1: Yes
    active = Column(Integer, nullable=False)          # 0: No, 1: Yes
    salt_intake = Column(Integer, nullable=False)     # 1: Low, 2: Normal, 3: High
    family_history = Column(Integer, nullable=False)  # 0: No, 1: Yes
    
    # Advanced / Lab Values (with default fallbacks)
    pregnancies = Column(Integer, default=0)
    skin_thickness = Column(Float, default=20.0)
    insulin = Column(Float, default=80.0)
    dpf = Column(Float, default=0.47) # Diabetes Pedigree Function
    
    # Kidney specific
    sg = Column(Float, default=1.020) # Specific Gravity
    albumin = Column(Float, default=0.0) # Albumin (0-5)
    sugar = Column(Float, default=0.0)   # Sugar (0-5)
    blood_urea = Column(Float, default=35.0)
    serum_creatinine = Column(Float, default=0.9)
    sodium = Column(Float, default=138.0)
    potassium = Column(Float, default=4.2)
    
    # Anemia specific
    hemoglobin = Column(Float, default=14.0)
    mch = Column(Float, default=30.0)
    mchc = Column(Float, default=33.5)
    mcv = Column(Float, default=90.0)
    pcv = Column(Float, default=42.0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="assessments")
    predictions = relationship("Prediction", back_populates="assessment", cascade="all, delete-orphan")

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False)
    disease = Column(String(50), nullable=False) # e.g., 'Diabetes', 'Cardiovascular', etc.
    probability = Column(Float, nullable=False)   # in percentage (0.0 to 100.0)
    risk_level = Column(String(20), nullable=False)  # 'Low', 'Moderate', 'High'
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    assessment = relationship("Assessment", back_populates="predictions")
    recommendations = relationship("Recommendation", back_populates="prediction", cascade="all, delete-orphan")

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    prediction_id = Column(Integer, ForeignKey("predictions.id", ondelete="CASCADE"), nullable=False)
    recommendation_text = Column(Text, nullable=False)

    prediction = relationship("Prediction", back_populates="recommendations")
