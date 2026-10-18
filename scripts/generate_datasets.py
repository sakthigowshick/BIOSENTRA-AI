import os
import numpy as np
import pandas as pd

# Set random seed for reproducibility
np.random.seed(42)

# Ensure datasets directory exists
os.makedirs("datasets", exist_ok=True)

# 1. Generate Diabetes Dataset (Pima Indians style)
def generate_diabetes(n=2000):
    age = np.random.randint(21, 81, n)
    pregnancies = np.random.randint(0, 15, n)
    pregnancies = np.where(age < 25, np.random.randint(0, 3, n), pregnancies)
    
    glucose = np.random.normal(120, 30, n).astype(int)
    glucose = np.clip(glucose, 50, 220)
    
    bp = np.random.normal(72, 12, n).astype(int)
    bp = np.clip(bp, 40, 122)
    
    skin = np.random.normal(20, 10, n).astype(int)
    skin = np.clip(skin, 0, 99)
    
    insulin = np.random.normal(80, 50, n).astype(int)
    insulin = np.clip(insulin, 0, 846)
    
    bmi = np.random.normal(32, 6, n)
    bmi = np.clip(bmi, 15.0, 60.0).round(1)
    
    dpf = np.random.exponential(0.4, n)
    dpf = np.clip(dpf, 0.08, 2.5).round(3)
    
    logits = -6.0 + 0.025 * glucose + 0.08 * bmi + 0.015 * age + 1.2 * dpf
    prob = 1 / (1 + np.exp(-logits))
    outcome = np.random.binomial(1, prob)
    
    df = pd.DataFrame({
        "Pregnancies": pregnancies,
        "Glucose": glucose,
        "BloodPressure": bp,
        "SkinThickness": skin,
        "Insulin": insulin,
        "BMI": bmi,
        "DiabetesPedigreeFunction": dpf,
        "Age": age,
        "Outcome": outcome
    })
    df.to_csv("datasets/diabetes_data.csv", index=False)
    print(f"Generated Diabetes Dataset: {df.shape}")

# 2. Generate Cardiovascular Disease Dataset (Cardio-system style)
def generate_cardio(n=2000):
    age = np.random.randint(30, 80, n)
    gender = np.random.choice([1, 2], n)
    height = np.where(gender == 2, np.random.normal(175, 7, n), np.random.normal(162, 6, n)).astype(int)
    weight = np.where(gender == 2, np.random.normal(80, 15, n), np.random.normal(70, 14, n)).astype(int)
    
    ap_hi = np.random.normal(126, 17, n).astype(int)
    ap_hi = np.clip(ap_hi, 80, 200)
    ap_lo = np.random.normal(81, 10, n).astype(int)
    ap_lo = np.clip(ap_lo, 50, 120)
    ap_hi = np.where(ap_hi <= ap_lo, ap_lo + 40, ap_hi)
    
    cholesterol = np.random.choice([1, 2, 3], n, p=[0.7, 0.2, 0.1])
    gluc = np.random.choice([1, 2, 3], n, p=[0.8, 0.15, 0.05])
    
    smoke = np.random.choice([0, 1], n, p=[0.85, 0.15])
    smoke = np.where((gender == 2) & (np.random.rand(n) < 0.2), 1, smoke)
    alco = np.random.choice([0, 1], n, p=[0.9, 0.1])
    active = np.random.choice([0, 1], n, p=[0.2, 0.8])
    
    bmi = weight / ((height / 100) ** 2)
    logits = -7.5 + 0.05 * age + 0.04 * (ap_hi - 120) + 0.6 * (cholesterol - 1) + 0.4 * smoke - 0.5 * active + 0.05 * bmi
    prob = 1 / (1 + np.exp(-logits))
    cardio = np.random.binomial(1, prob)
    
    df = pd.DataFrame({
        "age": age,
        "gender": gender,
        "height": height,
        "weight": weight,
        "ap_hi": ap_hi,
        "ap_lo": ap_lo,
        "cholesterol": cholesterol,
        "gluc": gluc,
        "smoke": smoke,
        "alco": alco,
        "active": active,
        "cardio": cardio
    })
    df.to_csv("datasets/cardio_data.csv", index=False)
    print(f"Generated Cardiovascular Dataset: {df.shape}")

# 3. Generate Chronic Kidney Disease Dataset (CKD)
def generate_ckd(n=2000):
    age = np.random.randint(15, 90, n)
    bp = np.random.normal(76, 12, n).astype(int)
    bp = np.clip(bp, 50, 120)
    
    sg = np.random.choice([1.005, 1.010, 1.015, 1.020, 1.025], n, p=[0.05, 0.1, 0.15, 0.4, 0.3])
    al = np.random.choice([0, 1, 2, 3, 4, 5], n, p=[0.75, 0.1, 0.06, 0.04, 0.03, 0.02])
    su = np.random.choice([0, 1, 2, 3, 4, 5], n, p=[0.85, 0.05, 0.04, 0.03, 0.02, 0.01])
    
    bgr = np.random.normal(130, 50, n).astype(int)
    bgr = np.clip(bgr, 70, 450)
    
    bu = np.random.normal(35, 30, n).astype(int)
    bu = np.clip(bu, 5, 300)
    
    sc = np.random.normal(1.2, 1.5, n).round(2)
    sc = np.clip(sc, 0.4, 15.0)
    
    sod = np.random.normal(137, 5, n).astype(int)
    sod = np.clip(sod, 110, 160)
    pot = np.random.normal(4.3, 0.8, n).round(1)
    pot = np.clip(pot, 2.5, 7.5)
    
    hemo = np.random.normal(13.0, 2.5, n).round(1)
    hemo = np.clip(hemo, 3.0, 18.0)
    
    pcv = (hemo * 3.1 + np.random.normal(0, 2, n)).astype(int)
    pcv = np.clip(pcv, 10, 54)
    
    htn = np.random.choice([0, 1], n, p=[0.65, 0.35])
    dm = np.random.choice([0, 1], n, p=[0.7, 0.3])
    ane = np.where(hemo < 11.5, 1, np.random.choice([0, 1], n, p=[0.95, 0.05]))
    
    logits = -4.5 + 2.2 * sc + 1.5 * al - 0.4 * hemo + 1.2 * htn + 1.0 * dm - 2.5 * (sg - 1.020)
    prob = 1 / (1 + np.exp(-logits))
    class_label = np.random.binomial(1, prob)
    
    sc = np.where(class_label == 1, np.maximum(sc, np.random.normal(2.5, 1.5, n).round(2)), sc)
    sc = np.clip(sc, 0.4, 15.0)
    al = np.where(class_label == 1, np.maximum(al, np.random.choice([1, 2, 3, 4, 5], n, p=[0.2, 0.3, 0.2, 0.15, 0.15])), al)
    hemo = np.where(class_label == 1, np.minimum(hemo, np.random.normal(10.5, 1.8, n).round(1)), hemo)
    hemo = np.clip(hemo, 3.0, 18.0)
    pcv = (hemo * 3.0).astype(int)
    
    df = pd.DataFrame({
        "age": age,
        "bp": bp,
        "sg": sg,
        "al": al,
        "su": su,
        "bgr": bgr,
        "bu": bu,
        "sc": sc,
        "sod": sod,
        "pot": pot,
        "hemo": hemo,
        "pcv": pcv,
        "htn": htn,
        "dm": dm,
        "ane": ane,
        "class": class_label
    })
    df.to_csv("datasets/kidney_data.csv", index=False)
    print(f"Generated CKD Dataset: {df.shape}")

# 4. Generate Anaemia Dataset
def generate_anemia(n=2000):
    gender = np.random.choice([0, 1], n)
    
    hemo = np.where(gender == 0, np.random.normal(14.2, 2.2, n), np.random.normal(12.5, 2.0, n)).round(1)
    hemo = np.clip(hemo, 5.0, 20.0)
    
    mcv = np.random.normal(88, 8, n).round(1)
    mcv = np.clip(mcv, 50.0, 120.0)
    
    mch = (mcv * 0.32 + np.random.normal(0, 1.5, n)).round(1)
    mch = np.clip(mch, 15.0, 40.0)
    
    mchc = (mch / mcv * 100 + np.random.normal(0, 0.8, n)).round(1)
    mchc = np.clip(mchc, 25.0, 40.0)
    
    prob_anemia = np.where(
        gender == 0,
        1 / (1 + np.exp(-3.0 * (13.2 - hemo))),
        1 / (1 + np.exp(-3.0 * (11.8 - hemo)))
    )
    result = np.random.binomial(1, prob_anemia)
    
    hemo = np.where(result == 1, np.minimum(hemo, np.random.normal(10.0, 1.2, n).round(1)), hemo)
    hemo = np.clip(hemo, 4.0, 20.0)
    
    df = pd.DataFrame({
        "Gender": gender,
        "Hemoglobin": hemo,
        "MCH": mch,
        "MCHC": mchc,
        "MCV": mcv,
        "Result": result
    })
    df.to_csv("datasets/anemia_data.csv", index=False)
    print(f"Generated Anaemia Dataset: {df.shape}")

# 5. Generate Hypertension Dataset
def generate_hypertension(n=2000):
    age = np.random.randint(18, 85, n)
    gender = np.random.choice([0, 1], n)
    bmi = np.random.normal(26.5, 5.5, n)
    bmi = np.clip(bmi, 15.0, 50.0).round(1)
    
    ap_hi = np.random.normal(122, 16, n).astype(int)
    ap_hi = np.clip(ap_hi, 85, 200)
    ap_lo = np.random.normal(78, 10, n).astype(int)
    ap_lo = np.clip(ap_lo, 55, 120)
    ap_hi = np.where(ap_hi <= ap_lo, ap_lo + 35, ap_hi)
    
    smoke = np.random.choice([0, 1], n, p=[0.8, 0.2])
    active = np.random.choice([0, 1], n, p=[0.25, 0.75])
    family_history = np.random.choice([0, 1], n, p=[0.7, 0.3])
    salt_intake = np.random.choice([1, 2, 3], n, p=[0.2, 0.6, 0.2])
    
    logits = -8.0 + 0.05 * (ap_hi - 110) + 0.06 * (ap_lo - 70) + 0.08 * bmi + 0.02 * age + 0.8 * family_history + 0.5 * salt_intake + 0.4 * smoke - 0.5 * active
    prob = 1 / (1 + np.exp(-logits))
    outcome = np.random.binomial(1, prob)
    
    ap_hi = np.where(outcome == 1, np.maximum(ap_hi, np.random.randint(130, 190, n)), ap_hi)
    ap_lo = np.where(outcome == 1, np.maximum(ap_lo, np.random.randint(80, 115, n)), ap_lo)
    
    df = pd.DataFrame({
        "Age": age,
        "Gender": gender,
        "BMI": bmi,
        "SystolicBP": ap_hi,
        "DiastolicBP": ap_lo,
        "Smoke": smoke,
        "Active": active,
        "FamilyHistory": family_history,
        "SaltIntake": salt_intake,
        "Outcome": outcome
    })
    df.to_csv("datasets/hypertension_data.csv", index=False)
    print(f"Generated Hypertension Dataset: {df.shape}")

if __name__ == "__main__":
    print("Generating synthetic datasets...")
    generate_diabetes()
    generate_cardio()
    generate_ckd()
    generate_anemia()
    generate_hypertension()
    print("All datasets generated successfully!")
