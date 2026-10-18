import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { Activity, Plus, ArrowRight, ClipboardList, ShieldAlert, Heart, Scale, Calendar } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestReport, setLatestReport] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const listResponse = await axios.get('/reports');
        setAssessments(listResponse.data);
        
        if (listResponse.data.length > 0) {
          // Fetch full predictions for the latest report
          const latestId = listResponse.data[0].id;
          const detailResponse = await axios.get(`/reports/${latestId}`);
          setLatestReport(detailResponse.data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center text-teal-400">Loading Dashboard...</div>;
  }

  if (error) {
    return <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center text-red-400">{error}</div>;
  }

  // Prep Chart Data: Historical Risk Trends (oldest to newest)
  // We need to fetch details of each assessment to show historical disease probabilities,
  // but to avoid massive API spam, we can construct the historical trend using the assessments list 
  // and load details dynamically, OR we can mock/estimate some trends, OR since the database is local 
  // and we want this to be extremely authentic, we can write a quick custom backend endpoint, 
  // or simply display BMI history which is already available in the list response!
  // In the list response, we have `id`, `bmi`, `systolic_bp`, `diastolic_bp`, `glucose`, `created_at`.
  // Let's create a beautiful BMI & Glucose history line chart from the list response!
  const historyData = [...assessments].reverse().map(item => ({
    date: new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    BMI: parseFloat(item.bmi.toFixed(1)),
    Glucose: item.glucose,
    SystolicBP: item.systolic_bp,
    DiastolicBP: item.diastolic_bp
  }));

  // Latest Screening Bar Chart Data
  const latestBarData = latestReport ? latestReport.predictions.map(p => ({
    name: p.disease,
    Probability: parseFloat(p.probability.toFixed(1))
  })) : [];

  const latestAssessment = assessments[0];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Patient Dashboard</h1>
          <p className="text-slate-400 text-xs">Review your clinical screening history and risk mitigations</p>
        </div>
        <Link 
          to="/assessment" 
          className="inline-flex items-center gap-1 bg-teal-400 hover:bg-teal-500 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs transition-all hover:scale-105 shadow-lg shadow-teal-500/10"
        >
          <Plus className="h-4 w-4" /> Run New Screening
        </Link>
      </div>

      {assessments.length === 0 ? (
        /* Empty State */
        <div className="p-8 sm:p-12 text-center rounded-2xl border border-slate-850 bg-slate-900/20 max-w-lg mx-auto mt-12">
          <ClipboardList className="h-12 w-12 text-teal-500/40 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Welcome, {user?.name}!</h3>
          <p className="text-slate-400 text-xs mb-8">
            You haven't run any health screenings yet. Perform your first unified assessment to screen for diabetes, cardiovascular, kidney, hypertension, and anemia risks.
          </p>
          <Link 
            to="/assessment" 
            className="inline-flex items-center gap-1 bg-teal-400 hover:bg-teal-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20"
          >
            Start First Screening <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        /* Dashboard Layout */
        <div className="space-y-8">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30">
              <span className="text-[10px] text-slate-500 font-semibold block uppercase">Total Assessments</span>
              <span className="text-xl font-bold text-white mt-1 block">{assessments.length}</span>
            </div>
            
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">Latest BMI</span>
                <span className="text-xl font-bold text-white mt-1 block">{latestAssessment.bmi.toFixed(1)}</span>
              </div>
              <Scale className="h-5 w-5 text-teal-400" />
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">Blood Pressure</span>
                <span className="text-xl font-bold text-white mt-1 block">{latestAssessment.systolic_bp}/{latestAssessment.diastolic_bp}</span>
              </div>
              <Heart className="h-5 w-5 text-rose-400" />
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">Blood Glucose</span>
                <span className="text-xl font-bold text-white mt-1 block">{latestAssessment.glucose} <span className="text-xs font-normal text-slate-400">mg/dL</span></span>
              </div>
              <Activity className="h-5 w-5 text-sky-400" />
            </div>
          </div>

          {/* Visual Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Latest Risk Scores */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Latest Screening Risks (%)</h3>
              {latestReport ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={latestBarData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                        itemStyle={{ color: '#2dd4bf' }}
                      />
                      <Bar dataKey="Probability" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-500 text-xs">No prediction metrics available.</div>
              )}
            </div>

            {/* Chart 2: BMI & Glucose History */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">Vitals & Weight History</h3>
              {historyData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                      />
                      <Legend verticalAlign="top" height={36} fontSize={10} />
                      <Line type="monotone" dataKey="BMI" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Glucose" stroke="#fbbf24" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-500 text-xs">No historical trend data.</div>
              )}
            </div>
          </div>

          {/* Historical Screening Records List */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <ClipboardList className="h-4 w-4 text-teal-400" /> Screening Records
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-500 text-xs">
                    <th className="pb-3 text-left font-semibold">Date performed</th>
                    <th className="pb-3 text-left font-semibold">BMI</th>
                    <th className="pb-3 text-left font-semibold">Blood Pressure</th>
                    <th className="pb-3 text-left font-semibold">Blood Glucose</th>
                    <th className="pb-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {assessments.map((a, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/20 transition-colors">
                      <td className="py-3 text-slate-300 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        {new Date(a.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-slate-300">{a.bmi.toFixed(1)}</td>
                      <td className="py-3 text-slate-300">{a.systolic_bp}/{a.diastolic_bp} mmHg</td>
                      <td className="py-3 text-slate-300">{a.glucose} mg/dL</td>
                      <td className="py-3 text-right">
                        <Link 
                          to={`/report/${a.id}`}
                          className="inline-flex items-center gap-0.5 text-teal-400 font-semibold hover:underline"
                        >
                          View Details <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
