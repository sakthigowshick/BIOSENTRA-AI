from typing import List

def get_recommendations(
    disease: str,
    probability: float,
    risk_level: str,
    age: int,
    bmi: float,
    smoke: int,
    alcohol: int,
    active: int,
    family_history: int,
    systolic_bp: int = 120,
    diastolic_bp: int = 80,
    glucose: int = 100
) -> List[str]:
    recommendations = []
    
    # Generic BMI and Lifestyle advice (appended for moderate/high risk or generally)
    is_at_risk = risk_level in ["Moderate", "High"]
    
    if disease == "Diabetes":
        if is_at_risk:
            recommendations.append("[Diet] Restrict intake of refined sugars, sweet beverages, and simple carbohydrates. Focus on complex carbs with high fiber (oats, brown rice, non-starchy vegetables).")
            recommendations.append("[Exercise] Engage in at least 150 minutes of moderate-intensity aerobic exercise (e.g., brisk walking, swimming) per week, plus strength training twice weekly.")
            if bmi >= 25.0:
                recommendations.append(f"[Lifestyle] Weight management: A modest weight loss of 5-7% of body weight (currently BMI {bmi:.1f}) can significantly improve glycemic control.")
            recommendations.append("[Medical] Schedule a fasting blood glucose and HbA1c test with a primary care provider to confirm glycemic status.")
            recommendations.append("[Follow-up] Check blood glucose levels weekly if pre-diabetic, or as directed by a healthcare professional.")
        else:
            recommendations.append("[Diet] Maintain a balanced diet rich in whole grains, lean proteins, and leafy greens to prevent future insulin resistance.")
            recommendations.append("[Exercise] Remain physically active; make daily walking a habit.")
            recommendations.append("[Follow-up] Routine screening of fasting blood sugar every 1-2 years is recommended for adults over 45.")

    elif disease == "Cardiovascular":
        if is_at_risk:
            recommendations.append("[Diet] Implement the Mediterranean or DASH diet. Limit saturated fats, trans fats, and excess dietary sodium.")
            recommendations.append("[Exercise] Perform regular aerobic exercises (30-45 minutes daily) to strengthen the heart muscle and lower resting heart rate.")
            if smoke == 1:
                recommendations.append("[Lifestyle] Smoking Cessation: Nicotine constricts blood vessels and dramatically increases atherosclerotic plaque risk. Seek smoking cessation support.")
            if alcohol == 1:
                recommendations.append("[Lifestyle] Limit alcohol consumption. Excess alcohol elevates blood pressure and damages cardiac tissue.")
            recommendations.append("[Medical] Consult a cardiologist for a comprehensive lipid profile panel (Total Cholesterol, HDL, LDL, Triglycerides) and an ECG.")
            recommendations.append("[Follow-up] Monitor blood pressure weekly and keep a log for your doctor.")
        else:
            recommendations.append("[Diet] Incorporate heart-healthy fats (olive oil, avocados, nuts) and omega-3 fatty acids (salmon, flaxseeds) into your diet.")
            recommendations.append("[Exercise] Maintain regular physical activity to support optimal cardiovascular health.")
            recommendations.append("[Follow-up] Get cholesterol checked every 4-6 years if normal, or annually if family history exists.")

    elif disease == "Kidney":
        if is_at_risk:
            recommendations.append("[Diet] Maintain a moderate protein intake. Avoid excessively high-protein diets which place heavy work strain on the kidneys. Limit high-sodium foods.")
            if systolic_bp >= 130 or diastolic_bp >= 80:
                recommendations.append("[Lifestyle] Blood Pressure Management: Keeping blood pressure strictly controlled (< 130/80 mmHg) is paramount to prevent kidney nephron damage.")
            recommendations.append("[Lifestyle] Avoid overuse of NSAID pain relievers (like Ibuprofen, Naproxen) as they decrease renal blood flow and can induce acute kidney injury.")
            recommendations.append("[Medical] Consult a nephrologist or primary care physician for a urinalysis (to check for microalbumin/proteinuria) and an eGFR blood test.")
            recommendations.append("[Follow-up] Re-test kidney functions (Serum Creatinine and Albumin-to-Creatinine Ratio) in 3 to 6 months.")
        else:
            recommendations.append("[Diet] Stay adequately hydrated by drinking plenty of water throughout the day to support kidney filtration.")
            recommendations.append("[Lifestyle] Limit self-medication and processed foods that contain high quantities of sodium and artificial preservatives.")
            recommendations.append("[Follow-up] Annual screening is recommended if you have diabetes or hypertension.")

    elif disease == "Anemia":
        if is_at_risk:
            recommendations.append("[Diet] Increase dietary iron intake with heme iron (lean red meats, poultry, seafood) and non-heme iron (spinach, beans, lentils, iron-fortified cereals).")
            recommendations.append("[Diet] Pair iron-rich meals with Vitamin C (oranges, bell peppers, tomatoes) to double iron absorption. Avoid tea or coffee within 1 hour of meals.")
            recommendations.append("[Medical] Consult a physician to check a Complete Blood Count (CBC) with differential, and a serum ferritin/iron studies panel.")
            recommendations.append("[Medical] If anemia is severe or chronic, discuss the necessity of oral iron supplements or vitamin B12/folate checks with your doctor.")
            recommendations.append("[Follow-up] Re-evaluate hemoglobin levels in 4-6 weeks after initiating dietary changes or supplementation.")
        else:
            recommendations.append("[Diet] Ensure sufficient dietary intake of iron, vitamin B12, and folic acid to support healthy red blood cell production.")
            recommendations.append("[Follow-up] Routine blood counts as part of annual physical exams are sufficient.")

    elif disease == "Hypertension":
        if is_at_risk:
            recommendations.append("[Diet] Strictly limit sodium intake to less than 1,500 mg per day. Increase potassium-rich foods (bananas, sweet potatoes, spinach) which help relax blood vessels.")
            recommendations.append("[Exercise] Focus on regular aerobic exercise (brisk walking, cycling) to reduce arterial stiffness. Avoid heavy powerlifting without doctor approval.")
            if active == 0:
                recommendations.append("[Exercise] Avoid a sedentary lifestyle. Even 10-minute micro-walks throughout the day help lower blood pressure.")
            recommendations.append("[Lifestyle] Learn stress reduction techniques such as mindful breathing, yoga, or meditation to minimize temporary BP spikes.")
            recommendations.append("[Medical] Arrange for professional blood pressure measurements at a clinic, or carry out a 24-hour ambulatory blood pressure monitoring (ABPM) test.")
            recommendations.append("[Follow-up] Check blood pressure at home twice daily (morning and evening) and keep a record.")
        else:
            recommendations.append("[Diet] Follow a low-sodium, high-potassium eating plan to maintain healthy blood pressure levels.")
            recommendations.append("[Lifestyle] Maintain healthy weight and manage stress levels to prevent gradual onset of arterial stiffness.")
            recommendations.append("[Follow-up] Screen blood pressure at least once a year at any standard clinic or pharmacy.")

    return recommendations
