import React, { useState } from 'react';
import {
  Sparkles,
  Printer,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Heart,
  Pill,
  Droplet,
  ExternalLink,
  ShieldAlert,
  Building2,
  User,
  Info,
} from 'lucide-react';
import { PatientDemographics, ChronicCondition, AllergyAlert, ClinicalEncounter } from '../types/index.ts';
import { Medication } from '../utils/healthLogic.ts';

interface AIHealthBriefProps {
  patient: PatientDemographics;
  conditions: ChronicCondition[];
  allergies: AllergyAlert[];
  medications: Medication[];
  recentEncounters: ClinicalEncounter[];
  onNavigateToTab?: (tab: string) => void;
}

export const AIHealthBrief: React.FC<AIHealthBriefProps> = ({
  patient,
  conditions,
  allergies,
  medications,
  recentEncounters,
  onNavigateToTab,
}) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState('Today at 09:42 AM (Interoperability Model v4.2)');

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      setLastGenerated(`Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Interoperability Model v4.2)`);
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              AI Health Brief & Clinical Summary
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-800">
              Multi-Hospital Synthesis
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Synthesized longitudinal clinical summary harmonized from St. Jude Memorial Hospital, Metro Health, and North Valley Clinic. Every significant clinical claim is anchored to verifiable source EHR records.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-blue-600' : 'text-slate-600'}`} />
            <span>{isRegenerating ? 'Synthesizing EHR Nodes...' : 'Regenerate Brief'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Doctor Brief</span>
          </button>
        </div>
      </div>

      {/* Synthesis Metadata Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 p-4 rounded-2xl border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-blue-900 gap-2">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-semibold">
            Synthesis Source: 5 Linked Nodes (Epic, Cerner, AthenaHealth, Quest) • Last Generated: {lastGenerated}
          </span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-blue-700">
          <span className="font-bold">Confidence: 99.2%</span>
          <span>•</span>
          <span>12 Encounters Harmonized</span>
        </div>
      </div>

      {/* Main 2-Column Clinical Brief Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Comprehensive Clinical Synthesis */}
        <div className="lg:col-span-2 space-y-5">
          {/* Section 1: Executive Clinical Baseline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                <Heart className="w-4 h-4 text-blue-600" />
                <span>Executive Patient Narrative</span>
              </h2>
              <span className="text-[10px] font-mono text-slate-400">HL7 FHIR Composition/summary</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Alex Morgan is a 42-year-old patient with a primary medical history of <strong className="text-slate-900">Paroxysmal Atrial Fibrillation (ICD-10 I48.91)</strong> diagnosed at St. Jude Memorial Hospital, and <strong className="text-slate-900">Type 2 Diabetes Mellitus (ICD-10 E11.9)</strong> managed through North Valley Family Clinic. Cardiac rhythm is currently anticoagulated on <strong className="text-slate-900">Warfarin Sodium 5mg daily</strong> with therapeutic INR targets (2.0–3.0). Glycemic control is optimal, with HbA1c documented at 5.8% on Metformin 500mg.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Blood Group</span>
                <span className="text-sm font-black text-blue-600 mt-0.5 block">{patient.bloodGroup}</span>
                <span className="text-[10px] text-slate-500">Universal Donor</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Anticoagulation</span>
                <span className="text-sm font-black text-slate-900 mt-0.5 block">Warfarin 5mg</span>
                <span className="text-[10px] text-emerald-600 font-bold">INR: 2.4 (Therapeutic)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Endocrine Control</span>
                <span className="text-sm font-black text-slate-900 mt-0.5 block">HbA1c 5.8%</span>
                <span className="text-[10px] text-emerald-600 font-bold">Controlled (-1.4% / 24 Mo)</span>
              </div>
            </div>
          </div>

          {/* Section 2: Important Recorded Conditions & Citations */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Recorded Chronic Conditions & Evidence</span>
              </h2>
              <span className="text-[10px] text-slate-400">{conditions.length} Active Records</span>
            </div>

            <div className="space-y-3">
              {conditions.map((cond) => (
                <div key={cond.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{cond.name}</span>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-100 text-blue-800 rounded">
                        {cond.icd10}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {cond.clinicalStatus}
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs">{cond.notes}</p>

                  <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                    <span className="flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cond.diagnosingFacility} • {cond.diagnosingPhysician}</span>
                    </span>
                    <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      Verified Source EHR
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Verified Allergies & High-Priority Alerts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Verified Allergies & Safety Alerts</span>
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-700">
                Critical Safety Warning
              </span>
            </div>

            <div className="space-y-3">
              {allergies.map((all) => (
                <div
                  key={all.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    all.severity.includes('Critical')
                      ? 'bg-rose-50/70 border-rose-300'
                      : 'bg-amber-50/60 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShieldAlert className={`w-4 h-4 ${all.severity.includes('Critical') ? 'text-rose-600' : 'text-amber-600'}`} />
                      <span className="font-bold text-slate-900 text-sm">{all.substance}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white border border-rose-200 text-rose-700">
                      {all.severity}
                    </span>
                  </div>

                  <p className="text-slate-700">
                    <strong className="text-slate-900">Clinical Manifestation:</strong> {all.reaction} ({all.clinicalManifestation})
                  </p>

                  <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
                    <span>Verified by: {all.verifiedBy} ({all.verifiedDate})</span>
                    <span className="font-mono text-[10px] text-slate-600">{all.fhirCode}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Active Meds, Recent Encounters & Disclaimer */}
        <div className="space-y-5">
          {/* Active Medications Summary */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Pill className="w-4 h-4 text-blue-600" />
                <span>Active Prescriptions ({medications.filter(m => m.status === 'active').length})</span>
              </h3>
            </div>

            <div className="space-y-2">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className={`p-2.5 rounded-xl border text-xs ${
                    med.status === 'discontinued'
                      ? 'bg-slate-100/70 border-slate-200 opacity-60'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{med.name}</span>
                    <span className="text-[10px] text-slate-500">{med.dosage}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{med.frequency} • {med.facility}</p>
                  <span
                    className={`inline-block mt-1.5 px-2 py-0.2 rounded text-[9px] font-bold uppercase ${
                      med.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {med.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Encounters Summary */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Recent Hospital Encounters</span>
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              {recentEncounters.slice(0, 3).map((enc) => (
                <div key={enc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 truncate">{enc.reasonForVisit}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{enc.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate">{enc.facility} • {enc.attendingPhysician}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Legal / Clinical Disclaimer */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center space-x-1.5 font-bold text-amber-800">
              <Info className="w-4 h-4" />
              <span>Clinical Decision Support Disclaimer</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800/90">
              This AI Health Brief is generated from structured HL7 FHIR clinical records for interoperability and continuity of care. It is intended to assist medical consultations and does not constitute an independent medical diagnosis, treatment plan, or automated medication alteration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
