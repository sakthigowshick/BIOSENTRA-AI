import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, Heart, Droplet, ChevronRight, CheckCircle2, ArrowRight, ClipboardList } from 'lucide-react';

const LandingPage = () => {
  const diseases = [
    {
      name: "Diabetes",
      icon: <Activity className="h-8 w-8 text-teal-400" />,
      desc: "Analyze blood glucose, insulin response, and BMI indicators to screen for early insulin resistance.",
      color: "from-teal-500/10 to-teal-500/5 hover:border-teal-500/30"
    },
    {
      name: "Cardiovascular Disease",
      icon: <Heart className="h-8 w-8 text-rose-400" />,
      desc: "Screen for atherosclerosis and general heart risks based on age, blood pressure, cholesterol, and lifestyle.",
      color: "from-rose-500/10 to-rose-500/5 hover:border-rose-500/30"
    },
    {
      name: "Chronic Kidney Disease",
      icon: <ClipboardList className="h-8 w-8 text-sky-400" />,
      desc: "Evaluate kidney filtration efficiency using serum creatinine, specific gravity, and albumin biomarkers.",
      color: "from-sky-500/10 to-sky-500/5 hover:border-sky-500/30"
    },
    {
      name: "Anaemia",
      icon: <Droplet className="h-8 w-8 text-red-400" />,
      desc: "Predict blood iron levels and oxygen-carrying capacity from hemoglobin, MCV, MCH, and MCHC values.",
      color: "from-red-500/10 to-red-500/5 hover:border-red-500/30"
    },
    {
      name: "Hypertension",
      icon: <Activity className="h-8 w-8 text-amber-400" />,
      desc: "Detect chronic high blood pressure risks using arterial systolic/diastolic measurements and lifestyle factors.",
      color: "from-amber-500/10 to-amber-500/5 hover:border-amber-500/30"
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center max-w-4xl flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-950/30 text-xs text-teal-400 font-medium mb-6">
          <ShieldAlert className="h-3.5 w-3.5" /> Next-Generation Preventive Screening
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Intelligent Disease Screening <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-emerald-400 to-sky-400">
            Powered by Clinical AI
          </span>
        </h1>
        
        <p className="text-base sm:text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          BioSentra AI runs advanced machine learning models against standard health indicators and biomarkers, providing early detection, instant risk analysis, and personalized physician-backed recommendations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/assessment" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-teal-400 hover:bg-teal-500 text-slate-950 font-bold px-8 py-4 rounded-xl shadow-xl shadow-teal-500/20 transition-all hover:scale-105"
          >
            <span>Start Free Screening</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link 
            to="/register" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-700 bg-slate-900/60 backdrop-blur hover:bg-slate-900 text-slate-200 px-8 py-4 rounded-xl transition-all"
          >
            <span>Create Patient Profile</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mt-20 p-6 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm">
          <div>
            <p className="text-3xl font-extrabold text-teal-400">5</p>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Diseases Screened</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-teal-400">98%</p>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Model Accuracy</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-teal-400">&lt; 3s</p>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Inference Speed</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-teal-400">100%</p>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">Privacy Secured</p>
          </div>
        </div>
      </div>

      {/* Features Grid Section */}
      <section className="w-full border-t border-slate-900 bg-slate-950 py-24 relative">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Supported Screening Capabilities</h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm">
              Our clinical screening algorithms evaluate key hematological, physiological, and demographic factors in real-time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {diseases.map((d, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-2xl border border-slate-800 bg-gradient-to-b ${d.color} transition-all duration-300 flex flex-col gap-4 text-left group`}
              >
                <div className="p-3 bg-slate-900/60 rounded-xl w-fit border border-slate-850 group-hover:scale-110 transition-transform">
                  {d.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{d.name}</h3>
                <p className="text-slate-400 text-xs leading-relaxed flex-1">{d.desc}</p>
                <Link to="/assessment" className="text-xs text-teal-400 font-semibold flex items-center gap-1 mt-2 hover:underline">
                  Screen now <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="w-full border-t border-slate-900 bg-slate-900/20 py-24">
        <div className="container mx-auto px-4 max-w-4xl flex flex-col md:flex-row items-center gap-12 text-left">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-6">Designed with Clinicians, Secured for Patients</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-slate-200 font-bold text-sm">Encrypted Patient Information</h4>
                  <p className="text-slate-400 text-xs mt-1">Your biomarker inputs and generated reports are stored with secure SHA-256 JWT validations.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-slate-200 font-bold text-sm">Interactive Dashboard & Insights</h4>
                  <p className="text-slate-400 text-xs mt-1">Review disease trends, BMI variations, and health status indicators dynamically with custom visual charts.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-slate-200 font-bold text-sm">Actionable Lifestyle Mitigations</h4>
                  <p className="text-slate-400 text-xs mt-1">Receive precise daily actions spanning diet restrictions, exercise goals, and medical consultation directives.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <div className="w-72 h-72 rounded-full bg-teal-500/10 border border-teal-500/20 absolute -z-10 blur-xl"></div>
            <div className="border border-slate-800 bg-slate-950 p-6 rounded-2xl shadow-2xl max-w-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-900">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-teal-400" />
                  <span className="font-bold text-xs text-white">Risk Summary Card</span>
                </div>
                <span className="text-[10px] text-slate-500">Live Prediction</span>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Cardiovascular Risk</span>
                  <span className="text-teal-400 font-semibold">12.4% (Low)</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal-400 h-full w-[12%]"></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Diabetes Risk</span>
                  <span className="text-amber-400 font-semibold">43.7% (Moderate)</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[43%]"></div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Hypertension Risk</span>
                  <span className="text-red-400 font-semibold">82.1% (High)</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-400 h-full w-[82%]"></div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-900 text-center">
                <Link to="/assessment" className="inline-flex items-center gap-1 text-xs text-teal-400 font-bold hover:underline">
                  Take Your Test <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
