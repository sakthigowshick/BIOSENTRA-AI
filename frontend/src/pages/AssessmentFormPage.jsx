import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Activity, ArrowRight, ArrowLeft, Heart, User, ClipboardList, Thermometer, ShieldAlert } from 'lucide-react';

const AssessmentFormPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [includeLab, setIncludeLab] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Demographics
    age: 35,
    gender: 0, // 0: Male, 1: Female
    height: 170,
    weight: 70,
    
    // Step 2: Vitals
    systolic_bp: 120,
    diastolic_bp: 80,
    glucose: 90,
    
    // Step 3: Lifestyle
    smoke: 0,
    alcohol: 0,
    active: 1,
    salt_intake: 2, // 1: Low, 2: Normal, 3: High
    family_history: 0,
    pregnancies: 0,
    
    // Step 4: Laboratory
    sg: 1.020,
    albumin: 0,
    sugar: 0,
    blood_urea: 35,
    serum_creatinine: 0.9,
    sodium: 138,
    potassium: 4.2,
    hemoglobin: 14.2,
    pcv: 42,
    mch: 30,
    mchc: 33.5,
    mcv: 90,
    skin_thickness: 20,
    insulin: 80,
    dpf: 0.47
  });

  // Calculate BMI dynamically
  const heightM = formData.height / 100;
  const bmi = (formData.weight / (heightM * heightM)).toFixed(1);
  
  let bmiStatus = "Underweight";
  let bmiColor = "text-sky-400";
  if (bmi >= 18.5 && bmi < 25) {
    bmiStatus = "Normal Weight";
    bmiColor = "text-teal-400";
  } else if (bmi >= 25 && bmi < 30) {
    bmiStatus = "Overweight";
    bmiColor = "text-amber-400";
  } else if (bmi >= 30) {
    bmiStatus = "Obese";
    bmiColor = "text-red-400";
  }

  const handleInputChange = (name, value) => {
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate pcv (packed cell volume) from hemoglobin (Hb * 3)
      if (name === 'hemoglobin') {
        updated.pcv = Math.round(value * 3);
      }
      return updated;
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(prev => prev + 1);
  };

  const handlePrev = (e) => {
    e.preventDefault();
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    
    // Form validation check
    try {
      // Cast integers and floats
      const payload = {
        ...formData,
        age: parseInt(formData.age),
        gender: parseInt(formData.gender),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        systolic_bp: parseInt(formData.systolic_bp),
        diastolic_bp: parseInt(formData.diastolic_bp),
        glucose: parseInt(formData.glucose),
        smoke: parseInt(formData.smoke),
        alcohol: parseInt(formData.alcohol),
        active: parseInt(formData.active),
        salt_intake: parseInt(formData.salt_intake),
        family_history: parseInt(formData.family_history),
        pregnancies: parseInt(formData.pregnancies),
        sg: parseFloat(formData.sg),
        albumin: parseFloat(formData.albumin),
        sugar: parseFloat(formData.sugar),
        blood_urea: parseFloat(formData.blood_urea),
        serum_creatinine: parseFloat(formData.serum_creatinine),
        sodium: parseFloat(formData.sodium),
        potassium: parseFloat(formData.potassium),
        hemoglobin: parseFloat(formData.hemoglobin),
        pcv: parseFloat(formData.pcv),
        mch: parseFloat(formData.mch),
        mchc: parseFloat(formData.mchc),
        mcv: parseFloat(formData.mcv),
        skin_thickness: parseFloat(formData.skin_thickness),
        insulin: parseFloat(formData.insulin),
        dpf: parseFloat(formData.dpf)
      };

      // If user is guest, we call unified predict. Axios will not have Authorization header.
      // If user is logged in, Axios will automatically send user token.
      const response = await axios.post('/predict/unified', payload);
      setSubmitting(false);
      
      // Redirect to the assessment report details page by ID
      const reportId = response.data.assessment.id;
      navigate(`/report/${reportId}`);
    } catch (err) {
      setSubmitting(false);
      setError(err.response?.data?.detail || "An error occurred while running ML screening. Please check inputs.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl text-left">
      <div className="flex items-center gap-2 text-teal-400 font-bold text-lg mb-8 justify-center">
        <Activity className="h-6 w-6" />
        <span>BioSentra Health Assessment Form</span>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
        {[1, 2, 3, 4].map(idx => (
          <div key={idx} className="flex items-center flex-1 last:flex-initial">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              step === idx 
                ? 'bg-teal-400 text-slate-950 shadow-lg shadow-teal-400/20' 
                : step > idx 
                  ? 'bg-teal-950 border border-teal-500 text-teal-400' 
                  : 'bg-slate-900 border border-slate-800 text-slate-500'
            }`}>
              {idx}
            </div>
            {idx < 4 && (
              <div className={`h-0.5 flex-1 mx-2 ${
                step > idx ? 'bg-teal-500' : 'bg-slate-800'
              }`}></div>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs font-medium mb-6">
          {error}
        </div>
      )}

      {/* Form Content */}
      <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md">
        <form onSubmit={step === 4 ? handleSubmit : handleNext}>
          
          {/* STEP 1: DEMOGRAPHICS */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                <User className="h-4 w-4 text-teal-400" /> Demographics & Body Metrics
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Age (Years)</label>
                  <input 
                    type="number" 
                    min="1" max="120" required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Biological Sex</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', parseInt(e.target.value))}
                  >
                    <option value={0}>Male</option>
                    <option value={1}>Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Height (cm)</label>
                  <input 
                    type="number" 
                    min="50" max="250" required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', parseFloat(e.target.value))}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Weight (kg)</label>
                  <input 
                    type="number" 
                    min="10" max="300" required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              {/* Dynamic BMI calculator panel */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Body Mass Index</span>
                  <p className="text-xl font-bold text-white mt-0.5">{bmi} <span className="text-xs font-medium text-slate-400">kg/m²</span></p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Weight Class</span>
                  <p className={`text-sm font-bold ${bmiColor} mt-0.5`}>{bmiStatus}</p>
                </div>
              </div>

              {/* If Female, show pregnancies inputs */}
              {formData.gender === 1 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Number of Pregnancies</label>
                  <input 
                    type="number" 
                    min="0" max="20"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
                    value={formData.pregnancies}
                    onChange={(e) => handleInputChange('pregnancies', parseInt(e.target.value))}
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 2: VITALS */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                <Thermometer className="h-4 w-4 text-teal-400" /> Vitals & Blood Chemistry
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Systolic BP (mmHg)</label>
                  <input 
                    type="number" 
                    min="50" max="250" required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
                    value={formData.systolic_bp}
                    onChange={(e) => handleInputChange('systolic_bp', parseInt(e.target.value))}
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Top BP value (active pressure)</p>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Diastolic BP (mmHg)</label>
                  <input 
                    type="number" 
                    min="30" max="150" required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
                    value={formData.diastolic_bp}
                    onChange={(e) => handleInputChange('diastolic_bp', parseInt(e.target.value))}
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Bottom BP value (resting pressure)</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Plasma Glucose (mg/dL)</label>
                <input 
                  type="number" 
                  min="40" max="500" required
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
                  value={formData.glucose}
                  onChange={(e) => handleInputChange('glucose', parseInt(e.target.value))}
                />
                <p className="text-[10px] text-slate-500 mt-1">Normal: 70-100 (fasting), Pre-diabetic: 100-125, Diabetic: &ge;126</p>
              </div>
            </div>
          )}

          {/* STEP 3: LIFESTYLE */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                <Heart className="h-4 w-4 text-teal-400" /> Lifestyle & Family History
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Smoking Status</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
                    value={formData.smoke}
                    onChange={(e) => handleInputChange('smoke', parseInt(e.target.value))}
                  >
                    <option value={0}>Non-smoker</option>
                    <option value={1}>Active smoker</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Alcohol Consumption</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
                    value={formData.alcohol}
                    onChange={(e) => handleInputChange('alcohol', parseInt(e.target.value))}
                  >
                    <option value={0}>Rarely/Never</option>
                    <option value={1}>Regular consumption</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Physical Activity</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
                    value={formData.active}
                    onChange={(e) => handleInputChange('active', parseInt(e.target.value))}
                  >
                    <option value={1}>Active (exercises regularly)</option>
                    <option value={0}>Sedentary (inactive)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Salt Intake</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
                    value={formData.salt_intake}
                    onChange={(e) => handleInputChange('salt_intake', parseInt(e.target.value))}
                  >
                    <option value={1}>Low</option>
                    <option value={2}>Normal</option>
                    <option value={3}>High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Family History of Diabetes/Heart Disease</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
                  value={formData.family_history}
                  onChange={(e) => handleInputChange('family_history', parseInt(e.target.value))}
                >
                  <option value={0}>No known family history</option>
                  <option value={1}>Yes (Parents/siblings affected)</option>
                </select>
              </div>
            </div>
          )}

          {/* STEP 4: LABORATORY */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-teal-400" /> Laboratory Biomarkers
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Include lab test values</span>
                  <input 
                    type="checkbox"
                    className="w-4 h-4 rounded accent-teal-400 cursor-pointer"
                    checked={includeLab}
                    onChange={(e) => setIncludeLab(e.target.checked)}
                  />
                </div>
              </div>

              {!includeLab ? (
                <div className="p-6 rounded-xl border border-slate-800 bg-slate-950/60 text-xs text-slate-400 leading-relaxed text-center">
                  <ShieldAlert className="h-8 w-8 text-teal-500/40 mx-auto mb-3" />
                  We will use standardized clinical median parameters (e.g. Hemoglobin 14.0 g/dL, Serum Creatinine 0.9 mg/dL) for calculations. You can immediately submit the screening, or toggle "Include lab test values" above to input precise diagnostic biomarkers.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Hemoglobin (g/dL)</label>
                      <input 
                        type="number" step="0.1" min="2" max="25" required
                        className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        value={formData.hemoglobin}
                        onChange={(e) => handleInputChange('hemoglobin', parseFloat(e.target.value))}
                      />
                      <p className="text-[9px] text-slate-500 mt-1">Normal: 12-17.5. Lower suggests Anemia.</p>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Serum Creatinine (mg/dL)</label>
                      <input 
                        type="number" step="0.05" min="0.1" max="20" required
                        className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        value={formData.serum_creatinine}
                        onChange={(e) => handleInputChange('serum_creatinine', parseFloat(e.target.value))}
                      />
                      <p className="text-[9px] text-slate-500 mt-1">Normal: 0.6-1.2. Higher suggests kidney stress.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Blood Albumin (0-5 scale)</label>
                      <input 
                        type="number" min="0" max="5" required
                        className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        value={formData.albumin}
                        onChange={(e) => handleInputChange('albumin', parseInt(e.target.value))}
                      />
                      <p className="text-[9px] text-slate-500 mt-1">0 is Normal, higher values mean protein leak.</p>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Specific Gravity (sg)</label>
                      <select 
                        className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none"
                        value={formData.sg}
                        onChange={(e) => handleInputChange('sg', parseFloat(e.target.value))}
                      >
                        <option value={1.005}>1.005</option>
                        <option value={1.010}>1.010</option>
                        <option value={1.015}>1.015</option>
                        <option value={1.020}>1.020</option>
                        <option value={1.025}>1.025</option>
                      </select>
                      <p className="text-[9px] text-slate-500 mt-1">Kidney concentration index (Normal 1.010-1.025)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Blood Urea (mg/dL)</label>
                      <input 
                        type="number" min="1" max="400" required
                        className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3.5 py-2 text-[13px] text-slate-200 focus:outline-none"
                        value={formData.blood_urea}
                        onChange={(e) => handleInputChange('blood_urea', parseFloat(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Sodium (mEq/L)</label>
                      <input 
                        type="number" min="80" max="180" required
                        className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3.5 py-2 text-[13px] text-slate-200 focus:outline-none"
                        value={formData.sodium}
                        onChange={(e) => handleInputChange('sodium', parseFloat(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1.5">Potassium (mEq/L)</label>
                      <input 
                        type="number" step="0.1" min="1" max="10" required
                        className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3.5 py-2 text-[13px] text-slate-200 focus:outline-none"
                        value={formData.potassium}
                        onChange={(e) => handleInputChange('potassium', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-800">
            {step > 1 ? (
              <button 
                type="button" 
                onClick={handlePrev}
                className="flex items-center gap-1.5 border border-slate-700 bg-slate-950 text-slate-300 hover:text-white px-5 py-2.5 rounded-lg text-sm transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : (
              <div></div>
            )}
            
            {step < 4 ? (
              <button 
                type="submit"
                className="flex items-center gap-1.5 bg-teal-400 hover:bg-teal-500 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-sm transition-all"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button 
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 bg-teal-400 hover:bg-teal-500 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-sm transition-all shadow-lg shadow-teal-500/20"
              >
                {submitting ? "Analyzing Biomarkers..." : "Run AI Screening"}
              </button>
            )}
          </div>
          
        </form>
      </div>
      {!isAuthenticated && (
        <p className="text-[11px] text-slate-500 text-center mt-6">
          Note: You are screening as a **Guest Patient**. Register or log in to automatically save assessment reports to your profile and review historical risk charts.
        </p>
      )}
    </div>
  );
};

export default AssessmentFormPage;
