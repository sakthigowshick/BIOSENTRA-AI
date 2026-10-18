import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Activity, Download, ArrowLeft, Heart, ShieldAlert, CheckCircle, ListChecks, Calendar, ShieldAlert as WarningIcon } from 'lucide-react';

const ReportDetailsPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [expandedDisease, setExpandedDisease] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`/reports/${id}`);
        setReport(response.data);
        // Expand the first disease with moderate or high risk by default
        const firstAtRisk = response.data.predictions.find(p => p.risk_level !== 'Low');
        if (firstAtRisk) {
          setExpandedDisease(firstAtRisk.disease);
        } else if (response.data.predictions.length > 0) {
          setExpandedDisease(response.data.predictions[0].disease);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.detail || "Could not retrieve screening report. Please verify permissions.");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      const response = await axios.get(`/reports/${id}/pdf`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `biosentra_health_report_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF report. Ensure you are authorized.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center text-teal-400">Loading Screening Results...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md text-center">
        <WarningIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Access Denied</h3>
        <p className="text-slate-400 text-xs mb-6">{error}</p>
        <Link to="/" className="inline-flex bg-teal-400 text-slate-950 font-bold px-6 py-2 rounded-lg text-xs">
          Return Home
        </Link>
      </div>
    );
  }

  const { assessment, predictions } = report;
  const genderStr = assessment.gender === 1 ? "Female" : "Male";

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-teal-400 mb-2">
            <ArrowLeft className="h-3 w-3" /> Back to {isAuthenticated ? "Dashboard" : "Home"}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Health Screening Report</h1>
          <p className="text-slate-500 text-xs flex items-center gap-1.5 mt-1">
            <Calendar className="h-3.5 w-3.5" /> Checked on {new Date(assessment.created_at).toLocaleString()}
          </p>
        </div>
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="flex items-center gap-1.5 bg-teal-400 hover:bg-teal-500 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs transition-colors shadow-lg shadow-teal-500/10"
        >
          <Download className="h-4 w-4" />
          {downloading ? "Generating PDF..." : "Download PDF Report"}
        </button>
      </div>

      {/* Patient Vitals Summary Card */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm mb-8">
        <h3 className="text-sm font-bold text-slate-200 mb-4 uppercase tracking-wider">Patient Biomarkers Profile</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <span className="text-[10px] text-slate-500 font-semibold block uppercase">Age / Gender</span>
            <span className="text-sm font-bold text-white mt-1 block">{assessment.age} years / {genderStr}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-semibold block uppercase">Body Mass Index</span>
            <span className="text-sm font-bold text-white mt-1 block">{assessment.bmi.toFixed(1)} kg/m²</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-semibold block uppercase">Blood Pressure</span>
            <span className="text-sm font-bold text-white mt-1 block">{assessment.systolic_bp}/{assessment.diastolic_bp} mmHg</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-semibold block uppercase">Blood Glucose</span>
            <span className="text-sm font-bold text-white mt-1 block">{assessment.glucose} mg/dL</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Risk Scores list */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">Screening Results</h3>
          {predictions.map((p, idx) => {
            const isSelected = expandedDisease === p.disease;
            let levelColor = "text-teal-400 bg-teal-950/30 border-teal-500/20";
            let progressColor = "bg-teal-400";
            if (p.risk_level === "High") {
              levelColor = "text-red-400 bg-red-950/30 border-red-500/20";
              progressColor = "bg-red-400";
            } else if (p.risk_level === "Moderate") {
              levelColor = "text-amber-400 bg-amber-950/30 border-amber-500/20";
              progressColor = "bg-amber-400";
            }

            return (
              <div 
                key={idx}
                onClick={() => setExpandedDisease(p.disease)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-teal-400 bg-slate-900/60 shadow-lg' 
                    : 'border-slate-800 bg-slate-900/10 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-xs text-white">{p.disease}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${levelColor}`}>
                    {p.risk_level}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                  <span>Probability</span>
                  <span className="font-semibold text-white">{p.probability.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${progressColor}`} style={{ width: `${p.probability}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic recommendations panel */}
        <div className="md:col-span-2">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <ListChecks className="h-4 w-4 text-teal-400" /> Actionable Recommendations
          </h3>
          
          {expandedDisease ? (
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md h-full">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-800 mb-6">
                <Heart className="h-5 w-5 text-teal-400 animate-pulse" />
                <div>
                  <h4 className="text-base font-bold text-white">{expandedDisease} Mitigation Plan</h4>
                  <p className="text-slate-500 text-[10px]">
                    Risk score: {predictions.find(p => p.disease === expandedDisease)?.probability.toFixed(1)}%
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {predictions.find(p => p.disease === expandedDisease)?.recommendations.map((rec, rIdx) => {
                  // Highlight category
                  const categoryMatch = rec.match(/^\[(.*?)\]/);
                  const category = categoryMatch ? categoryMatch[1] : "Tip";
                  const cleanText = rec.replace(/^\[.*?\]\s*/, "");
                  
                  return (
                    <div key={rIdx} className="flex gap-3">
                      <CheckCircle className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                          {category}
                        </span>
                        <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
                          {cleanText}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/10 text-slate-500 text-xs text-center flex items-center justify-center h-48">
              Select a disease card on the left to review its mitigation checklist.
            </div>
          )}
        </div>
      </div>

      {/* Discalimer */}
      <div className="mt-12 p-6 rounded-2xl border border-slate-850 bg-slate-900/10 text-[10px] text-slate-500 leading-relaxed text-center">
        <span className="font-bold text-slate-400 block mb-1">MEDICAL DISCLAIMER</span>
        This report is generated by a statistical screening algorithm (Scikit-Learn pipeline). It estimates chronic disease risks using diagnostic biomarkers and demographic metrics. This screening does not represent clinical medical advice, a physician prescription, or formal diagnosis. Always consult a general practitioner or medical professional for proper health advice, therapies, and clinical assessments.
      </div>
    </div>
  );
};

export default ReportDetailsPage;
