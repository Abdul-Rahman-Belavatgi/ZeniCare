import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Activity,
  FileText,
  UserCheck,
  ChevronRight,
  AlertTriangle,
  Building2,
  Clock,
  Eye,
  Share2,
  Pill,
  Upload,
  CheckCircle2,
  QrCode,
  Search,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  PatientDemographics,
  VitalSign,
  ChronicCondition,
  AllergyAlert,
  ClinicalEncounter,
  MedicalReport,
  SecurityAuditEntry,
  PrivacyConsentConfig,
} from '../types/index.ts';
import { DrugDiscrepancy } from '../utils/healthLogic.ts';
import { NavTab } from './Sidebar.tsx';

interface OverviewDashboardProps {
  patient: PatientDemographics;
  vitals: VitalSign[];
  conditions: ChronicCondition[];
  allergies: AllergyAlert[];
  recentEncounters: ClinicalEncounter[];
  discrepancies: DrugDiscrepancy[];
  reports?: MedicalReport[];
  auditTrail?: SecurityAuditEntry[];
  consentConfig?: PrivacyConsentConfig;
  onNavigate: (tab: NavTab) => void;
  onOpenReconcileModal: () => void;
  onAddReport?: (report: MedicalReport) => void;
  onOpenEmergencyCard?: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  patient,
  vitals,
  conditions,
  allergies,
  recentEncounters,
  discrepancies,
  reports = [],
  consentConfig,
  onNavigate,
}) => {
  const [recordFilterTab, setRecordFilterTab] = useState<'All' | 'Diagnostics' | 'Prescriptions' | 'Imaging' | 'Vaccines'>('All');
  const [recordSearch, setRecordSearch] = useState('');

  const [liveEncounters, setLiveEncounters] = useState<ClinicalEncounter[]>(recentEncounters);
  const [liveReports, setLiveReports] = useState<MedicalReport[]>(reports);
  const [liveMedCount, setLiveMedCount] = useState<number>(7);

  const [viewingReport, setViewingReport] = useState<MedicalReport | null>(null);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [isLockscreenModalOpen, setIsLockscreenModalOpen] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);

  const fetchLiveBackend = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/records');
      if (response.ok) {
        const data = await response.json();
        const records = data.records || data || [];

        const backendEncounters: ClinicalEncounter[] = records.map((rec: any, idx: number) => ({
          id: `sqlite-enc-${rec.id || idx}`,
          facility: rec.hospital_name || 'Lilavati Hospital & Research Centre',
          facilityType: 'Hospital',
          encounterClass: 'Outpatient',
          department: 'General Medicine',
          date: rec.date || new Date().toISOString().split('T')[0],
          reasonForVisit: rec.diagnosis || 'Clinical Consultation',
          attendingPhysician: rec.doctor_name || 'Dr. Meera Joshi, MD',
          specialty: 'Internal Medicine',
          soapNotes: {
            subjective: rec.raw_text || 'Patient consultation notes.',
            objective: `Extracted: ${(rec.medications || []).join(', ') || 'Standard vitals'}.`,
            assessment: rec.diagnosis || 'Controlled condition',
            plan: `Rx: ${(rec.medications || []).join(', ') || 'Standard regimen.'}`,
          },
          fhirEncounterId: `enc-sqlite-${rec.id || idx}`,
          status: 'Finished',
          isSensitiveCategory: 'general',
        }));

        const backendReports: MedicalReport[] = records.map((rec: any, idx: number) => ({
          id: `rep-sqlite-${rec.id || idx}`,
          title: `${rec.hospital_name || 'Clinical'} - ${rec.diagnosis || 'Medical Note'}`,
          providerName: rec.hospital_name || 'Lilavati Hospital',
          reportDate: rec.date || new Date().toISOString().split('T')[0],
          category: (rec.medications && rec.medications.length > 0) ? 'Prescriptions' : 'Laboratory Tests',
          uploadDate: new Date().toISOString().split('T')[0],
          verificationStatus: 'Patient Verified',
          processingStatus: 'AI Extracted',
          fileFormat: 'TXT',
          fileSize: '1.2 KB',
          summary: `Extracted from local offline Ollama engine. Diagnosis: ${rec.diagnosis || 'N/A'}. Medications: ${(rec.medications || []).join(', ')}.`,
          aiConfidence: 98.5,
          extractedFields: {
            dates: [rec.date || new Date().toISOString().split('T')[0]],
            medicationsOrTests: rec.medications || [],
            results: [],
            physicianName: rec.doctor_name || 'Dr. Meera Joshi, MD',
            keyFindings: [rec.diagnosis || 'Standard assessment'],
          },
          originalPreviewText: rec.raw_text || 'Official offline record.',
        }));

        setLiveEncounters([...backendEncounters, ...recentEncounters]);
        setLiveReports([...backendReports, ...reports]);
        setLiveMedCount(Math.max(7, records.length + 5));
      }
    } catch (err) {
      console.warn('Backend offline, using mock state.', err);
    }
  };

  useEffect(() => {
    fetchLiveBackend();
  }, [recentEncounters, reports]);

  const filteredRecords = liveReports.filter((rep) => {
    let matchesTab = true;
    if (recordFilterTab === 'Diagnostics') matchesTab = rep.category === 'Laboratory Tests';
    else if (recordFilterTab === 'Prescriptions') matchesTab = rep.category === 'Prescriptions';
    else if (recordFilterTab === 'Imaging') matchesTab = rep.category === 'Scans and Imaging';
    else if (recordFilterTab === 'Vaccines') matchesTab = rep.category === 'Vaccination Records';

    const matchesSearch =
      recordSearch === '' ||
      rep.title.toLowerCase().includes(recordSearch.toLowerCase()) ||
      rep.providerName.toLowerCase().includes(recordSearch.toLowerCase()) ||
      rep.summary.toLowerCase().includes(recordSearch.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. TOP BAR: PATIENT IDENTIFIER */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-base shrink-0 tracking-wider">
              AS
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 truncate">
                  Aarav Sharma
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  Male, 42 yrs
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
                  Blood Group: B+
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1" />
                  ABHA Verified
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                <span>
                  ABHA ID: <strong className="font-mono text-slate-800">91-4491-0283-9912</strong>
                </span>
                <span>•</span>
                <span>
                  MRN: <strong className="font-mono text-slate-800">#MUM-449102</strong>
                </span>
                <span>•</span>
                <span>
                  Primary Physician: <strong className="text-slate-800">Dr. Neha Shah, MD</strong>
                </span>
                <span>•</span>
                <span>
                  Height/Weight: <strong className="text-slate-800">176 cm (5 ft 9 in) / 72 kg (158.7 lbs)</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsLockscreenModalOpen(true)}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Emergency Lock-Screen</span>
            </button>
            <button
              onClick={() => setIsConsentModalOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Records</span>
            </button>
          </div>
        </div>

        {/* Active Allergies Banner */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-start sm:items-center space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="font-bold text-amber-900 uppercase tracking-wide text-[11px] mr-2">
                  ACTIVE VERIFIED ALLERGIES:
                </span>
                <span className="font-medium text-amber-900">
                  Penicillin G & V (Anaphylaxis, Laryngeal Stridor) • Peanut Proteins (Facial Urticaria)
                </span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('consent')}
              className="text-amber-800 hover:text-amber-950 font-semibold underline text-xs shrink-0 sm:ml-4 text-left"
            >
              Manage Safety & Consent &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* 2. KPI METRICS (Cleaned icon fit) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div
          onClick={() => onNavigate('reports')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-medium text-slate-500 block">Unified Records</span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{liveReports.length}</div>
            <span className="inline-flex items-center text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
              SQLite Synced
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        {/* KPI 2 */}
        <div
          onClick={() => onNavigate('timeline')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-medium text-slate-500 block">Active Regimens</span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{liveMedCount} Active</div>
            <span className="inline-flex items-center text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 mt-1">
              1 Safety Alert
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Pill className="w-5 h-5" />
          </div>
        </div>

        
  {/* KPI: Linked Facilities */}
<div
  onClick={() => onNavigate('timeline')}
  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-between"
>
  <div>
    <span className="text-xs font-medium text-slate-500 block">Linked Facilities</span>
    <div className="text-2xl font-bold text-slate-900 mt-0.5">5 Hospitals</div>
    <span className="inline-flex items-center text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 mt-1">
      Lilavati, Apollo
    </span>
  </div>
  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
    <Building2 className="w-5 h-5 text-emerald-600" />
  </div>
</div>

        {/* KPI 4 */}
        <div
          onClick={() => onNavigate('consent')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-medium text-slate-500 block">Consent Grants</span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">3 Active</div>
            <span className="inline-flex items-center text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 mt-1">
              Zero-Trust Guard
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* 3. CENTER + RIGHT SPLIT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          {/* Ollama Callout */}
          <section className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-200 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                <span>Offline Ollama Clinical Lab</span>
              </span>
              <h3 className="text-lg font-bold">Have a new clinic note or prescription?</h3>
              <p className="text-xs text-blue-100 max-w-md">
                Upload clinic discharge papers, lab tests, or prescriptions. Local Ollama extracts diagnoses and persists them straight to your SQLite database.
              </p>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="px-5 py-2.5 bg-white hover:bg-blue-50 text-slate-900 font-bold rounded-xl text-xs transition-all shadow-md shrink-0 flex items-center space-x-1.5 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Open Document Lab</span>
            </button>
          </section>

          {/* Timeline Feed */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Recent Clinical Encounters</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Chronological unified feed synced with local SQLite and connected health networks
                </p>
              </div>
              <button
                onClick={() => onNavigate('timeline')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
              >
                <span>Full Timeline</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {liveEncounters.slice(0, 4).map((enc, idx) => (
                <div
                  key={enc.id || idx}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {enc.reasonForVisit}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {enc.facility}
                      </span>
                      {enc.fhirEncounterId.includes('sqlite') && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          SQLite
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-xs">
                      Attending Physician: <strong className="text-slate-800">{enc.attendingPhysician}</strong>
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                      "{enc.soapNotes?.assessment || 'Routine clinical assessment and longitudinal maintenance.'}"
                    </p>
                  </div>

                  <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span className="font-medium text-slate-500 font-mono text-[11px]">
                      {enc.date}
                    </span>
                    <button
                      onClick={() => onNavigate('timeline')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      View Full SOAP &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Document Table */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Medical Records & Document Library</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Searchable, category-filtered clinical records with date stamps and physician authorizations
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={recordSearch}
                  onChange={(e) => setRecordSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-1 pb-3 mb-3 border-b border-slate-200 overflow-x-auto text-xs font-medium">
              {(['All', 'Diagnostics', 'Prescriptions', 'Imaging', 'Vaccines'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRecordFilterTab(tab)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    recordFilterTab === tab
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Document Title</th>
                    <th className="py-2.5 px-3">Facility</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.slice(0, 5).map((rep) => (
                    <tr key={rep.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-900 max-w-[200px] truncate">
                        {rep.title}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">{rep.providerName}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{rep.reportDate}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {rep.verificationStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => setViewingReport(rep)}
                          className="p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* RIGHT PANEL */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Doctor Quick Share</h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                15-Min Token
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-2.5">
              Generate a time-limited OTP and authorization QR for your consulting physician.
            </p>

            {generatedOtp ? (
              <div className="mt-4 p-4 rounded-xl bg-slate-900 text-center space-y-3">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono block">
                  Single-Use Access OTP
                </span>
                <div className="font-mono text-3xl font-black tracking-widest text-emerald-400">
                  {generatedOtp}
                </div>
                <button
                  onClick={() => setGeneratedOtp(null)}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Dismiss Code
                </button>
              </div>
            ) : (
              <div className="mt-4">
                <button
                  onClick={() => setGeneratedOtp('842-194')}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Generate Quick OTP & QR</span>
                </button>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onNavigate('consent')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 cursor-pointer"
              >
                <span>Privacy & Consent Center</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Reconciled Vitals */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Reconciled Vitals</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified Normal
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {vitals.slice(0, 4).map((vital) => (
                <div key={vital.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                  <span className="text-[10px] text-slate-500 block truncate">{vital.type}</span>
                  <div className="font-black text-slate-900 text-sm mt-0.5">
                    {vital.value} <span className="text-[10px] font-normal text-slate-500">{vital.unit}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 block truncate mt-1">{vital.facility}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SHARE RECORDS MODAL (Working trigger) */}
      {isConsentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Share Patient Records
                  </h3>
                  <p className="text-xs text-slate-500">
                    Grant time-bound consent to external hospitals
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsConsentModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Clinician / Hospital:</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <option>Dr. Meera Joshi, MD (Lilavati Hospital - Cardiology)</option>
                  <option>Dr. Rajesh Mehta, MD (P.D. Hinduja Hospital)</option>
                  <option>Emergency EMT Responders (Any Trauma Unit)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Access Duration:</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <option>24 Hours (Urgent Care)</option>
                  <option>7 Days (Consultation Episode)</option>
                  <option>30 Days (Ongoing Treatment)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => setIsConsentModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Authorization Token Generated! Encrypted FHIR consent broadcast to provider.');
                  setIsConsentModalOpen(false);
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Sign & Authorize Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOCKSCREEN MODAL */}
      {isLockscreenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 text-white border-2 border-red-500 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-black">Emergency First Responder Triage</h3>
              </div>
              <button
                onClick={() => setIsLockscreenModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-2xl font-black">Aarav Sharma</h4>
                <p className="text-xs text-slate-400">Male, 42 yrs • Blood B+</p>
              </div>
              <span className="text-2xl font-black text-red-400">B+</span>
            </div>

            <div className="p-3.5 bg-red-950/80 border border-red-700 rounded-2xl text-xs space-y-1">
              <span className="text-red-400 font-bold uppercase text-[10px] block">
                Critical Allergy Warning (DO NOT ADMINISTER):
              </span>
              <p className="text-sm font-bold text-white">PENICILLIN & BETA-LACTAMS (Anaphylaxis)</p>
            </div>

            <div className="p-3 bg-slate-800 rounded-xl text-xs flex justify-between items-center">
              <span className="text-slate-400">Emergency Proxy (Spouse): Priya Patil</span>
              <span className="font-mono text-emerald-400 font-bold">+91 98192 33811</span>
            </div>

            <button
              onClick={() => setIsLockscreenModalOpen(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* VIEW REPORT MODAL */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                  {viewingReport.category}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">{viewingReport.title}</h3>
                <p className="text-xs text-slate-500">{viewingReport.providerName} • {viewingReport.reportDate}</p>
              </div>
              <button onClick={() => setViewingReport(null)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
              {viewingReport.summary}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setViewingReport(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};