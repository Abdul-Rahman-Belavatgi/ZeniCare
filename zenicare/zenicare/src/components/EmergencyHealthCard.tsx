import React, { useState } from 'react';
import {
  QrCode,
  AlertTriangle,
  Download,
  Share2,
  Lock,
  Unlock,
  ShieldAlert,
  Phone,
  User,
  Heart,
  Droplet,
  FileCheck,
  CheckCircle2,
  Printer,
  Sparkles,
  X,
} from 'lucide-react';
import { PatientDemographics, ChronicCondition, AllergyAlert, SecurityAuditEntry } from '../types/index.ts';
import { Medication } from '../utils/healthLogic.ts';

interface EmergencyHealthCardProps {
  patient: PatientDemographics;
  allergies: AllergyAlert[];
  conditions: ChronicCondition[];
  medications: Medication[];
  onBreakGlassOverride: (justification: string, clinicianName: string, npi: string) => void;
  isBreakGlassActive: boolean;
}

export const EmergencyHealthCard: React.FC<EmergencyHealthCardProps> = ({
  patient,
  allergies,
  conditions,
  medications,
  onBreakGlassOverride,
  isBreakGlassActive,
}) => {
  const [showBreakGlassModal, setShowBreakGlassModal] = useState(false);
  const [clinicianName, setClinicianName] = useState('Dr. Elena Vance, MD');
  const [npi, setNpi] = useState('1982736450');
  const [justification, setJustification] = useState(
    'Acute trauma resuscitation / severe emergency evaluation requiring un-redacted history.'
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [showLockscreenModal, setShowLockscreenModal] = useState(false);

  const handleExecuteBreakGlass = (e: React.FormEvent) => {
    e.preventDefault();
    onBreakGlassOverride(justification, clinicianName, npi);
    setShowBreakGlassModal(false);
  };

  const handleCopyEmergencyLink = () => {
    navigator.clipboard?.writeText?.(
      `https://medibridge.health/emergency/${patient.id}?auth=EMERG_LEVEL_1`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Universal Emergency Health Passport
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-red-100 text-red-800">
              High-Priority Triage
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Universal scannable summary card designed for emergency first responders, trauma bays, and paramedics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Dedicated Emergency Lock-screen View Button */}
          <button
            onClick={() => setShowLockscreenModal(true)}
            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            <span>Emergency Lock-Screen View</span>
          </button>

          <button
            onClick={handleCopyEmergencyLink}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Scannable URL'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>

          {/* Clinician Break-Glass Trigger */}
          <button
            onClick={() => setShowBreakGlassModal(true)}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all shadow-md ${
              isBreakGlassActive
                ? 'bg-amber-500 text-slate-950 animate-pulse'
                : 'bg-rose-700 hover:bg-rose-800 text-white shadow-rose-600/30'
            }`}
          >
            <Unlock className="w-4 h-4" />
            <span>{isBreakGlassActive ? 'Break-Glass ACTIVE (Unlocked)' : 'Clinician Break-Glass Override'}</span>
          </button>
        </div>
      </div>

      {/* Break-Glass active status banner */}
      {isBreakGlassActive && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 text-xs text-amber-950 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-extrabold block">
                EMERGENCY BREAK-GLASS OVERRIDE ENGAGED
              </span>
              <span className="text-amber-800">
                All patient privacy blackouts temporarily bypassed by Dr. Elena Vance, MD (NPI: #1982736450) under emergency trauma protocol.
              </span>
            </div>
          </div>
          <span className="font-mono text-[11px] font-bold text-amber-700">Audit Log Locked</span>
        </div>
      )}

      {/* High-Contrast Emergency Health Card matching Reference Image Screen 12 */}
      <div className="max-w-3xl mx-auto bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-8 text-white shadow-2xl border-2 border-red-500/80 relative overflow-hidden">
        {/* Subtle decorative watermark */}
        <div className="absolute right-[-40px] top-[-40px] opacity-5 pointer-events-none">
          <Heart className="w-96 h-96" />
        </div>

        {/* Card Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/40">
              <Heart className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-red-400 block">
                Universal Medical Emergency Passport
              </span>
              <h2 className="text-2xl font-black tracking-tight">MediBridge Health Card</h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Group</span>
            <span className="text-2xl font-black text-red-400">{patient.bloodGroup}</span>
          </div>
        </div>

        {/* Main Content Grid: Demographics + QR Code */}
        <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-white/10">
          {/* Left 2 Cols: Vital Patient Data */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Name</span>
              <h3 className="text-2xl font-black text-white">{patient.fullName}</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                ID: <span className="font-mono text-emerald-400 font-bold">{patient.id}</span> • DOB: {patient.birthDate} ({patient.age} yrs)
              </p>
            </div>

            {/* Critical Allergy Warning */}
            <div className="bg-red-950/80 p-3.5 rounded-2xl border border-red-600/60 text-xs">
              <div className="flex items-center space-x-2 text-red-400 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span className="uppercase tracking-wider text-[11px]">CRITICAL ALLERGY ALERT:</span>
              </div>
              <p className="text-sm font-black text-white mt-1">
                PENICILLIN & BETA-LACTAMS (Anaphylaxis / Stridor)
              </p>
              <p className="text-[11px] text-red-300 mt-0.5">
                Also allergic to: Peanuts (Severe Urticaria / Angioedema)
              </p>
            </div>

            {/* Chronic Conditions / Anticoagulation */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Cardiovascular Status
                </span>
                <span className="font-bold text-white block mt-0.5">Atrial Fibrillation (I48.91)</span>
                <span className="text-[10px] text-amber-300 block">Anticoagulated on Warfarin</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Endocrine / Metabolic
                </span>
                <span className="font-bold text-white block mt-0.5">Type 2 Diabetes (E11.9)</span>
                <span className="text-[10px] text-emerald-400 block">HbA1c: 5.8% (Target Controlled)</span>
              </div>
            </div>
          </div>

          {/* Right Col: High-Res Scannable QR Code */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-xl text-slate-900">
            {/* SVG Representation of a clinical QR Code */}
            <div className="p-2 border-2 border-slate-900 rounded-xl bg-white">
              <svg
                viewBox="0 0 120 120"
                className="w-36 h-36 fill-current text-slate-900"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* QR Positioning Squares */}
                <rect x="10" y="10" width="30" height="30" rx="4" fill="black" />
                <rect x="16" y="16" width="18" height="18" fill="white" />
                <rect x="20" y="20" width="10" height="10" fill="black" />

                <rect x="80" y="10" width="30" height="30" rx="4" fill="black" />
                <rect x="86" y="16" width="18" height="18" fill="white" />
                <rect x="90" y="20" width="10" height="10" fill="black" />

                <rect x="10" y="80" width="30" height="30" rx="4" fill="black" />
                <rect x="16" y="86" width="18" height="18" fill="white" />
                <rect x="20" y="90" width="10" height="10" fill="black" />

                {/* Simulated Data Pattern Matrix */}
                <rect x="48" y="12" width="6" height="6" />
                <rect x="58" y="12" width="6" height="6" />
                <rect x="68" y="18" width="6" height="6" />
                <rect x="48" y="24" width="6" height="6" />
                <rect x="62" y="28" width="6" height="6" />

                <rect x="12" y="48" width="6" height="6" />
                <rect x="22" y="58" width="6" height="6" />
                <rect x="34" y="48" width="6" height="6" />

                <rect x="46" y="46" width="10" height="10" fill="#dc2626" />
                <rect x="64" y="46" width="6" height="6" />
                <rect x="54" y="60" width="6" height="6" />
                <rect x="70" y="64" width="6" height="6" />

                <rect x="84" y="48" width="6" height="6" />
                <rect x="94" y="58" width="6" height="6" />
                <rect x="104" y="48" width="6" height="6" />

                <rect x="48" y="84" width="6" height="6" />
                <rect x="60" y="88" width="6" height="6" />
                <rect x="70" y="98" width="6" height="6" />
                <rect x="84" y="84" width="6" height="6" />
                <rect x="96" y="92" width="6" height="6" />
                <rect x="104" y="82" width="6" height="6" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mt-2">
              Scan for EMT Triage
            </span>
            <span className="text-[9px] font-mono text-slate-400">NX-88204-EMERG</span>
          </div>
        </div>

        {/* Card Footer: Emergency Contacts */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/10">
            <Phone className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">
                Primary Emergency Proxy (Spouse)
              </span>
              <span className="font-bold text-white">{patient.emergencyContact.name}</span>
              <span className="text-red-300 font-mono block">{patient.emergencyContact.phone}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/10">
            <User className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">
                Attending Cardiologist
              </span>
              <span className="font-bold text-white">Dr. Robert Chen, MD, FACC</span>
              <span className="text-blue-300 font-mono block">St. Jude Memorial Hospital</span>
            </div>
          </div>
        </div>
      </div>

      {/* Break-Glass Modal */}
      {showBreakGlassModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center space-x-3 text-rose-600 mb-3">
              <ShieldAlert className="w-7 h-7" />
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Clinician Break-Glass Override Protocol
                </h3>
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
                  Emergency Medical Resuscitation Only
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Under HL7 FHIR Security & HIPAA Emergency Exemption Rules, licensed emergency physicians may temporarily unlock excluded sensitive records (behavioral health, substance use, toxicology) when patient consciousness or life is in imminent danger.
            </p>

            <form onSubmit={handleExecuteBreakGlass} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Attending Clinician Full Name
                </label>
                <input
                  type="text"
                  required
                  value={clinicianName}
                  onChange={(e) => setClinicianName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  National Provider Identifier (NPI)
                </label>
                <input
                  type="text"
                  required
                  value={npi}
                  onChange={(e) => setNpi(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Emergency Clinical Justification *
                </label>
                <textarea
                  rows={3}
                  required
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="State specific medical emergency justification..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-[11px] text-rose-900">
                <span className="font-bold block">Legal & Audit Notice:</span>
                This action is permanently stamped into the immutable cryptographic audit ledger and notified to the patient upon session conclusion.
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBreakGlassModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-black shadow-md"
                >
                  Engage Emergency Break-Glass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Emergency Lock-screen View Modal */}
      {showLockscreenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 text-white border-2 border-red-500 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-red-400 block">
                    Lock-Screen Critical Access
                  </span>
                  <h3 className="text-base font-bold text-white">First Responder Triage Summary</h3>
                </div>
              </div>
              <button
                onClick={() => setShowLockscreenModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <h4 className="text-xl font-black text-white">{patient.fullName}</h4>
                <span className="text-xl font-black text-red-400">{patient.bloodGroup}</span>
              </div>
              <p className="text-xs text-slate-400">
                Age {patient.age} yrs • DOB: {patient.birthDate} • ID: #{patient.id}
              </p>
            </div>

            {/* Life-Saving Allergy Warning */}
            <div className="p-3 rounded-xl bg-red-950 border border-red-600/80 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-red-400 font-bold uppercase text-[10px]">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Critical Allergy Alert (DO NOT ADMINISTER):</span>
              </div>
              <p className="text-sm font-bold text-white">
                PENICILLIN & BETA-LACTAMS (Anaphylaxis / Stridor)
              </p>
              <p className="text-[11px] text-red-300">
                Secondary: Peanut Protein (Facial angioedema)
              </p>
            </div>

            {/* Critical Conditions & Anticoagulation */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                  Cardiovascular
                </span>
                <span className="font-bold text-white block mt-0.5">Atrial Fibrillation</span>
                <span className="text-[10px] text-amber-300 font-medium block">
                  Anticoagulated on Warfarin 5mg
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                  Endocrine
                </span>
                <span className="font-bold text-white block mt-0.5">Type 2 Diabetes</span>
                <span className="text-[10px] text-emerald-400 font-medium block">
                  HbA1c 5.8% (Controlled)
                </span>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 text-xs">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                Emergency Next-of-Kin Contact:
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-white block">{patient.emergencyContact.name}</strong>
                  <span className="text-slate-400 text-[11px]">{patient.emergencyContact.relationship}</span>
                </div>
                <a
                  href={`tel:${patient.emergencyContact.phone}`}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {patient.emergencyContact.phone}</span>
                </a>
              </div>
            </div>

            {/* Export and Wallet Pass */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export-to-PDF</span>
              </button>
              <button
                onClick={() => alert('Downloaded Emergency Medical Pass for Apple / Google Wallet (.pkpass)')}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Wallet Pass Option</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
