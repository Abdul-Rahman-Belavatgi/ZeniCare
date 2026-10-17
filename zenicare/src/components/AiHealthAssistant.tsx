import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building2,
  Stethoscope,
  Send,
  HelpCircle,
  Copy,
  Download,
  Info,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Search,
} from 'lucide-react';
import { AiHealthBrief, MedicalReport } from '../types/index.ts';

interface AiHealthAssistantProps {
  healthBrief: AiHealthBrief;
  reports: MedicalReport[];
  onOpenReport?: (reportId: string) => void;
  onOpenAppointments?: () => void;
}

export const AiHealthAssistant: React.FC<AiHealthAssistantProps> = ({
  healthBrief,
  reports,
  onOpenReport,
  onOpenAppointments,
}) => {
  const [activeTab, setActiveTab] = useState<'brief' | 'qa' | 'term_explainer'>('brief');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; citations?: string[] }>>([
    {
      sender: 'ai',
      text: 'Hello Alex! I am your MediBridge AI Health Assistant. I can summarize your medical records, explain complex clinical terminology in plain language, and help you prepare for upcoming appointments. How can I assist you today?',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<string>('Paroxysmal Atrial Fibrillation');

  const termsDatabase: Record<string, { plainMeaning: string; clinicalContext: string; relatedReport: string }> = {
    'Paroxysmal Atrial Fibrillation': {
      plainMeaning:
        'An irregular, often very rapid heartbeat that starts and stops suddenly on its own. The upper chambers (atria) of the heart beat out of coordination with the lower chambers.',
      clinicalContext:
        'Documented during your Sept 15-18 stay at St. Jude Hospital. You are prescribed Warfarin 5mg to prevent blood clots from forming during irregular rhythms.',
      relatedReport: 'St. Jude Cardiology Discharge Summary',
    },
    'Hemoglobin A1c (HbA1c)': {
      plainMeaning:
        'A blood test that measures your average blood sugar levels over the past 2 to 3 months. Normal is below 5.7%, while for diabetes management, staying below 7.0% is typically recommended.',
      clinicalContext:
        'Your most recent test on Oct 4 at Quest Diagnostics was 5.8%, reflecting excellent blood sugar control with your current diet, exercise, and Metformin regimen.',
      relatedReport: 'Quest Diagnostics Comprehensive Metabolic Panel',
    },
    'Anticoagulant (Warfarin)': {
      plainMeaning:
        'A medicine that slows down your body’s process of making blood clots, often called a "blood thinner". It protects against strokes and clot complications.',
      clinicalContext:
        'Prescribed by Dr. Marcus Vance. Requires regular INR blood tests (target: 2.0 - 3.0) and avoidance of conflicting antiplatelet drugs like Aspirin.',
      relatedReport: 'Active Outpatient Prescription: Warfarin Sodium 5mg',
    },
    'Anaphylaxis': {
      plainMeaning:
        'A severe, potentially life-threatening allergic reaction that happens rapidly (within minutes to hours) and can cause breathing difficulties, swelling, and a sudden drop in blood pressure.',
      clinicalContext:
        'Recorded for Penicillin (Beta-lactam antibiotics) in 2019 at Metro Health Trauma. You must strictly avoid all penicillin-derivative antibiotics.',
      relatedReport: 'Metro Health Emergency Trauma Admission',
    },
    'Normotensive BP (122/78 mmHg)': {
      plainMeaning:
        'Normal, healthy blood pressure. The top number (systolic) is pressure when the heart beats, and the bottom (diastolic) is pressure when the heart rests.',
      clinicalContext:
        'Recorded during your Oct 12 wellness visit with Dr. Meera Patel at North Valley Family Clinic.',
      relatedReport: 'North Valley Family Clinic Annual Wellness Visit',
    },
  };

  const handleSendQuery = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim()) return;

    setChatMessages((prev) => [...prev, { sender: 'user', text: q }]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      let citations: string[] = [];

      const lower = q.toLowerCase();
      if (lower.includes('a1c') || lower.includes('sugar') || lower.includes('glucose')) {
        reply =
          'Your latest Hemoglobin A1c test from Quest Diagnostics (Oct 4, 2026) was 5.8%, with fasting glucose at 98 mg/dL. This is considered optimal glycemic control and indicates your Type 2 Diabetes is well-managed with your current Metformin 500mg twice daily and lifestyle routines.';
        citations = ['Quest Comprehensive Metabolic & Lipid Panel (Oct 4, 2026)'];
      } else if (lower.includes('aspirin') || lower.includes('warfarin') || lower.includes('conflict') || lower.includes('interaction')) {
        reply =
          'A safety conflict was detected because Warfarin (prescribed by St. Jude) and Aspirin 81mg (recorded by North Valley) both reduce blood clotting through different pathways. Taking both simultaneously significantly increases the risk of bleeding. During your Oct 12 visit, Dr. Meera Patel advised discontinuing Aspirin to stay safely on Warfarin.';
        citations = [
          'St. Jude Cardiology Discharge Summary',
          'North Valley Annual Comprehensive Wellness Visit',
        ];
      } else if (lower.includes('appointment') || lower.includes('doctor') || lower.includes('next')) {
        reply =
          'You have two upcoming appointments scheduled:\n1. Dr. Marcus Vance (Cardiology at St. Jude) on Oct 28, 2026 at 10:30 AM for your post-discharge anticoagulation check.\n2. Dr. Meera Patel (Primary Care at North Valley) on Nov 12, 2026 at 02:30 PM for quarterly blood pressure review.';
        citations = ['Upcoming Appointments Master Schedule'];
      } else if (lower.includes('allerg') || lower.includes('penicillin')) {
        reply =
          'Your records document a critical allergy to Penicillin G & V (Beta-Lactams), verified at Metro Health in 2019 following an anaphylactoid reaction with bronchospasm. You also have a documented peanut allergy. All clinicians on the MediBridge network receive an immediate safety warning before prescribing beta-lactams.';
        citations = ['Metro Health Master Allergy Intolerance Registry'];
      } else {
        reply =
          `Based on your unified health records, your chronic conditions (Type 2 Diabetes, Hypertension, and Atrial Fibrillation) are currently in stable status. Your vitals show a resting blood pressure of 122/78 mmHg and heart rate of 72 bpm. Please remember to schedule your routine repeat INR check as recommended by Dr. Vance.`;
        citations = ['MediBridge Synthesized Longitudinal Health Brief'];
      }

      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply, citations }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                AI Health Assistant
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Plain-English summaries, medical term explanations, and doctor-ready health briefs.
              </p>
            </div>
          </div>
        </div>

        {/* Workspace Mode Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('brief')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'brief' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AI Health Brief
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'qa' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Interactive Q&A
          </button>
          <button
            onClick={() => setActiveTab('term_explainer')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'term_explainer' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Plain Medical Glossary
          </button>
        </div>
      </div>

      {/* Principle #3 Safety Banner */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-start space-x-3 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">AI-Assisted, Not AI-Controlled</span>
          <p className="text-blue-800 text-[11px] leading-relaxed">
            MediBridge AI organizes, explains, and connects information from your existing medical documents. It never independently diagnoses, prescribes medications, or replaces clinical consultations with your licensed physician.
          </p>
        </div>
      </div>

      {/* TAB 1: Structured AI Health Brief */}
      {activeTab === 'brief' && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Longitudinal Health Summary Brief
                </h2>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Synthesized: {healthBrief.generatedAt}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed p-4 bg-slate-50 rounded-xl border border-slate-200 font-medium">
              {healthBrief.overallSummary}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100">
              <div className="flex items-center space-x-2 text-slate-500 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified across 5 clinical hospital and laboratory endpoints</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(healthBrief.overallSummary);
                  alert('AI Health Brief copied to clipboard!');
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center space-x-1"
              >
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Copy Brief for Doctor</span>
              </button>
            </div>
          </div>

          {/* Grid of Key Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recorded Conditions */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                <span>Recorded Conditions</span>
              </h3>
              <div className="space-y-2">
                {healthBrief.recordedConditions.map((cond, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{cond.name}</span>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {cond.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Source: {cond.source}</span>
                      <span>{cond.date}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recorded Allergies */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Recorded Allergies & Intolerances</span>
              </h3>
              <div className="space-y-2">
                {healthBrief.recordedAllergies.map((all, i) => (
                  <div key={i} className="p-3 bg-rose-50/50 rounded-xl border border-rose-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-950">{all.substance}</span>
                      <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                        {all.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-800 font-medium">{all.reaction}</p>
                    <p className="text-[10px] text-slate-400">Ref: {all.source}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Recorded Medications */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Active Prescriptions</span>
              </h3>
              <div className="space-y-2">
                {healthBrief.activeMedications.map((med, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{med.name} ({med.dosage})</span>
                      <span className="text-[10px] font-semibold text-slate-500">{med.frequency}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Prescribed by {med.prescribedBy} • {med.facility}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing or Conflicting Information Alert */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Missing or Conflicting Information</span>
              </h3>
              <div className="space-y-2">
                {healthBrief.missingOrConflictingInfo.map((item, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      item.severity === 'high'
                        ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{item.title}</span>
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-700">
                        {item.severity} Priority
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{item.description}</p>
                    <div className="p-2 bg-white/70 rounded-lg text-[11px] font-semibold text-slate-700 mt-1">
                      💡 Recommendation: {item.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Interactive Q&A */}
      {activeTab === 'qa' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[520px] overflow-hidden">
          {/* Quick Prompts */}
          <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center space-x-2 overflow-x-auto text-[11px]">
            <span className="font-bold text-slate-400 shrink-0">Try asking:</span>
            <button
              onClick={() => handleSendQuery('Can you explain my last HbA1c test result in plain words?')}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg border border-slate-200 whitespace-nowrap font-medium"
            >
              Explain my HbA1c result
            </button>
            <button
              onClick={() => handleSendQuery('Why is my Warfarin prescription conflicting with Aspirin?')}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg border border-slate-200 whitespace-nowrap font-medium"
            >
              Why are Warfarin and Aspirin conflicting?
            </button>
            <button
              onClick={() => handleSendQuery('What upcoming doctor appointments do I have?')}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg border border-slate-200 whitespace-nowrap font-medium"
            >
              What are my upcoming appointments?
            </button>
            <button
              onClick={() => handleSendQuery('Tell me about my Penicillin allergy history.')}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg border border-slate-200 whitespace-nowrap font-medium"
            >
              My penicillin allergy record
            </button>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-xl p-3.5 rounded-2xl space-y-1.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Supporting Document Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
                      <span className="font-bold block uppercase tracking-wider text-slate-400">
                        Supporting Sources:
                      </span>
                      {msg.citations.map((c, ci) => (
                        <div key={ci} className="flex items-center space-x-1 font-semibold text-blue-700">
                          <FileText className="w-3 h-3" />
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-2 text-slate-400 text-xs italic">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>MediBridge AI is analyzing your medical records...</span>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="p-3 border-t border-slate-100 bg-white flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask a question about your medical history, tests, or prescriptions..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1 shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Plain Medical Glossary */}
      {activeTab === 'term_explainer' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Term List */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2">
              Select Term to Explain:
            </span>
            {Object.keys(termsDatabase).map((term) => (
              <button
                key={term}
                onClick={() => setSelectedTerm(term)}
                className={`w-full text-left p-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  selectedTerm === term
                    ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600 pl-2 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{term}</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>
            ))}
          </div>

          {/* Explanation View */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Plain English Explanation
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">{selectedTerm}</h3>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                What this means for you:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {termsDatabase[selectedTerm]?.plainMeaning}
              </p>
            </div>

            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                Your Personal Context in MediBridge:
              </span>
              <p className="text-xs text-blue-900 leading-relaxed font-medium">
                {termsDatabase[selectedTerm]?.clinicalContext}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 text-slate-500">
              <span className="flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Documented in: <strong>{termsDatabase[selectedTerm]?.relatedReport}</strong></span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
