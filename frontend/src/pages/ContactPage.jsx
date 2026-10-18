import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquareCode } from 'lucide-react';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting feedback:", form);
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl text-left">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Contact BioSentra AI</h1>
      <p className="text-slate-400 text-sm max-w-xl mb-12">
        Have questions regarding our predictive screening models, deployment instructions, or clinical research integrations? Fill out the form or reach out via our medical support channels.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-teal-400">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Medical Support Email</h4>
              <p className="text-slate-400 text-xs mt-1">support@biosentra.ai</p>
              <p className="text-slate-500 text-[10px] mt-0.5">Response within 24 hours</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-teal-400">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Clinical Helpdesk</h4>
              <p className="text-slate-400 text-xs mt-1">+1 (800) 555-0199</p>
              <p className="text-slate-500 text-[10px] mt-0.5">Mon - Fri: 8:00 AM - 6:00 PM EST</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-teal-400">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Headquarters</h4>
              <p className="text-slate-400 text-xs mt-1">BioSentra Healthcare Labs</p>
              <p className="text-slate-400 text-xs">100 Biotech Research Blvd</p>
              <p className="text-slate-500 text-[10px] mt-0.5">Boston, MA 02111</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/10 text-xs text-slate-500 flex items-start gap-2.5">
            <MessageSquareCode className="h-5 w-5 text-teal-500/60 shrink-0 mt-0.5" />
            <span>
              If you are a medical researcher looking to integrate Custom ML models, please visit our documentation or contact our integration team directly.
            </span>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none transition-colors"
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
              <input 
                type="email" 
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none transition-colors"
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none transition-colors"
                value={form.subject} 
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Message</label>
              <textarea 
                rows="4" 
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none transition-colors resize-none"
                value={form.message} 
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              ></textarea>
            </div>

            {sent && (
              <div className="p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg text-teal-400 text-xs font-medium">
                Thank you! Your message has been sent successfully.
              </div>
            )}

            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 bg-teal-400 hover:bg-teal-500 text-slate-950 font-bold py-2.5 rounded-lg text-sm shadow-md transition-colors"
            >
              <Send className="h-4 w-4" /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
