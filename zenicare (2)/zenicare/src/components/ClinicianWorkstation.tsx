import React, { useState } from 'react';
import {
  Stethoscope,
  ShieldAlert,
  Send,
  Building2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Plus,
  Radio,
  Pill,
  Lock,
  Unlock,
} from 'lucide-react';
import {
  PatientDemographics,
  ChronicCondition,
  AllergyAlert,
  ClinicalEncounter,
} from '../types/index.ts';
import { Medication, DrugDiscrepancy } from '../utils/healthLogic.ts';
import { CLINICIAN_PERSONA } from '../data/mockData.ts';

interface ClinicianWorkstationProps {
  patient: PatientDemographics;
  conditions: ChronicCondition[];
  allergies: AllergyAlert[];
  medications: Medication[];
  discrepancies: DrugDiscrepancy[];
  onAddEncounter: (enc: ClinicalEncounter) => void;
  isBreakGlassActive: boolean;
  onOpenReconcileModal: () => void;
}

export const ClinicianWorkstation: React.FC<ClinicianWorkstationProps> = ({
  patient,
  conditions,
  allergies,
  medications,
  discrepancies,
  onAddEncounter,
  isBreakGlassActive,
  onOpenReconcileModal,
}) => {
  const [reason, setReason] = useState('Emergency Department Comprehensive Re-evaluation');
  const [subjective, setSubjective] = useState(
    'Alex is alert and oriented x4. Discussed medication reconciliation regarding concurrent Warfarin and Aspirin prescribed across St. Jude and North Valley.'
  );
  const [objective, setObjective] = useState(
    'Vitals: BP 122/78 mmHg, HR 72 regular, SpO2 98%. Skin warm, no overt petechiae or bruising.'
  );
  const [assessment, setAssessment] = useState(
    'Clinical stability verified. Co-prescribed antithrombotics require immediate formal reconciliation to mitigate hemorrhage hazard.'
  );
  const [plan, setPlan] = useState(
    'Contact Dr. Robert Chen (St. Jude) and Dr. Meera Patel (North Valley). Discontinue Aspirin 81mg; maintain Warfarin 5mg with 4-week INR interval.'
  );
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handleBroadcastSoap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !assessment) return;

    const newEnc: ClinicalEncounter = {
      id: `enc-dr-vance-${Date.now()}`,
      facility: 'Metro Health System (ER & Trauma)',
      facilityType: 'Emergency Dept',
      encounterClass: 'Emergency',
      department: 'Department of Emergency Medicine',
      date: new Date().toISOString().split('T')[0],
      reasonForVisit: reason,
      attendingPhysician: CLINICIAN_PERSONA.name,
      specialty: 'Emergency Medicine',
      soapNotes: {
        subjective,
        objective,
        assessment,
        plan,
      },
      fhirEncounterId: `enc-fhir-vance-${Date.now().toString().slice(-5)}`,
      status: 'Finished',
      isSensitiveCategory: 'general',
    };

    onAddEncounter(newEnc);
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Clinician Persona Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300">
            <Stethoscope className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black">{CLINICIAN_PERSONA.name}</h1>
              <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {CLINICIAN_PERSONA.title}
              </span>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5">
              {CLINICIAN_PERSONA.facility} • NPI: {CLINICIAN_PERSONA.npi} • {CLINICIAN_PERSONA.licenseState}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs text-right">
            <span className="text-emerald-200 block text-[10px] uppercase font-bold">
              Access Token Role
            </span>
            <span className="font-bold">Attending / Emergency Chief</span>
          </div>

          <div
            className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
              isBreakGlassActive
                ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                : 'bg-white/10 border-white/10 text-slate-300'
            }`}
          >
            {isBreakGlassActive ? <Unlock className="w-4 h-4 text-amber-400" /> : <Lock className="w-4 h-4" />}
            <div>
              <span className="block text-[10px] uppercase font-bold">Break-Glass State</span>
              <span className="font-bold">{isBreakGlassActive ? 'OVERRIDDEN' : 'Standard RBAC'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Hospital Clinical Synthesis Dashboard */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Cross-Hospital Clinical Synthesis: {patient.fullName} (ID: #{patient.id})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time federated view combining Cardiology (St. Jude), Primary Care (North Valley), and Trauma (Metro Health)
            </p>
          </div>

          {discrepancies.length > 0 && (
            <button
              onClick={onOpenReconcileModal}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs"
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Reconcile Warfarin + Aspirin</span>
            </button>
          )}
        </div>

        {/* 3 Synthesis Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* St. Jude Specialty Input */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block text-xs flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>St. Jude Memorial Hospital</span>
            </span>
            <p className="text-slate-600 text-[11px]">
              Cardiology management for Paroxysmal Atrial Fibrillation (I48.91). Warfarin 5mg daily prescribed with latest therapeutic INR 2.4.
            </p>
            <span className="inline-block text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              Active Anticoagulation
            </span>
          </div>

          {/* North Valley Primary Care */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block text-xs flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>North Valley Family Clinic</span>
            </span>
            <p className="text-slate-600 text-[11px]">
              Comprehensive annual management. Type 2 Diabetes well-controlled (HbA1c 5.8% on Metformin 500mg). Lisinopril 10mg. Aspirin 81mg added.
            </p>
            <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              PCP Primary Anchor
            </span>
          </div>

          {/* Metro Health Trauma / ER */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block text-xs flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Metro Health System (Trauma)</span>
            </span>
            <p className="text-slate-600 text-[11px]">
              Prior syncopal workup negative for intracranial bleed. Strict Penicillin Anaphylaxis alert documented on master allergy registry.
            </p>
            <span className="inline-block text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
              Critical Beta-Lactam Contraindication
            </span>
          </div>
        </div>
      </div>

      {/* SOAP Documentation Drawer with Automated Network Broadcast */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Radio className="w-4 h-4 text-blue-600" />
              <span>Clinician SOAP Documentation & Automated Network Broadcast</span>
            </h3>
            <p className="text-xs text-slate-500">
              When saved, this SOAP progress note is instantly published to the federated FHIR network and reflected on Alex's timeline
            </p>
          </div>

          {broadcastSuccess && (
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold animate-bounce">
              <CheckCircle2 className="w-4 h-4" />
              <span>Broadcasted to Federated EHRs!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleBroadcastSoap} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Encounter Reason / Clinical Episode *
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Subjective (Chief Complaint & Patient History)
              </label>
              <textarea
                rows={3}
                value={subjective}
                onChange={(e) => setSubjective(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Objective (Physical Examination, Vitals, Labs)
              </label>
              <textarea
                rows={3}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Assessment (Differential & Working Diagnosis) *
              </label>
              <textarea
                rows={3}
                required
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Plan (Therapeutic Orders & Network Follow-up)
              </label>
              <textarea
                rows={3}
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-400">
              Signer: Dr. Elena Vance, MD • Metro Health System ER
            </span>

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center space-x-2 transition-all shadow-md shadow-emerald-600/30"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Encounter Note to Network</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
