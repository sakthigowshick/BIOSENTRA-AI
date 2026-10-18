import React from 'react';
import { Activity, ShieldCheck, Microscope, Heart } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl text-left">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">About BioSentra AI</h1>
      <p className="text-slate-400 text-base leading-relaxed mb-8">
        BioSentra AI is a comprehensive full-stack healthcare screening application designed to evaluate patient biomarkers, identify risk scores for critical chronic illnesses, and deliver automated clinical-grade recommendations. The platform is engineered as a modern clinical decision support system (CDSS) for preventive medicine.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <Microscope className="h-6 w-6 text-teal-400" />
            <h3 className="text-lg font-bold text-white">Machine Learning Models</h3>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            BioSentra AI trains multiple state-of-the-art classifiers, including Logistic Regression, Random Forest, and Gradient Boosting. During compilation, the script automatically evaluates performance using Stratified K-Fold validation and selects the algorithm that minimizes false negatives (maximizing screening sensitivity and recall).
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Preventative Recommendations</h3>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Upon predicting disease risks, our rules-based Recommendation Engine processes physiological parameters (such as BMI, Systolic BP, and age) to construct a structured preventative blueprint. This includes target sodium and sugar restrictions, aerobic guidelines, and diagnostic laboratory tests.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-10">
        <h2 className="text-xl font-bold text-white mb-4">Screening Methodology</h2>
        <div className="space-y-4 text-sm text-slate-300">
          <p>
            <strong className="text-teal-400">Diabetes:</strong> Analyzes glucose tolerance levels, insulin indices, and obesity markers (BMI) based on clinical data from the Pima Indians dataset.
          </p>
          <p>
            <strong className="text-rose-400">Cardiovascular:</strong> Evaluates systemic blood pressures, cholesterol indicators, smoking status, and physical activity to predict general heart risks.
          </p>
          <p>
            <strong className="text-sky-400">Chronic Kidney Disease:</strong> Evaluates serum creatinine and specific gravity variables to estimate filtration efficiency.
          </p>
          <p>
            <strong className="text-red-400">Anaemia:</strong> Uses complete blood count markers (hemoglobin, mean corpuscular volume, MCH, and MCHC) to predict red blood cell capacity.
          </p>
          <p>
            <strong className="text-amber-400">Hypertension:</strong> Examines blood pressure levels, smoking, active status, family history, and salt consumption to detect chronic high blood pressure.
          </p>
        </div>
      </div>

      <div className="mt-12 p-6 rounded-2xl border border-red-500/10 bg-red-950/5 text-xs text-slate-500 leading-relaxed border-l-4 border-l-red-500">
        <span className="font-bold text-slate-400 block mb-1">MEDICAL DISCLAIMER</span>
        BioSentra AI is a statistical risk screening tool. It does not replace medical laboratory testing, clinical diagnostics, or professional healthcare consultations. The probability statistics computed by the machine learning models are for general screening and lifestyle recommendations. Always consult a licensed clinical practitioner for medical checkups, diagnosis, and prescription.
      </div>
    </div>
  );
};

export default AboutPage;
