import React, { useState } from 'react';
import {
  ShieldAlert,
  Activity,
  FileText,
  UserCheck,
  ChevronRight,
  AlertTriangle,
  Stethoscope,
  Building2,
  Clock,
  Eye,
  Download,
  Share2,
  Pill,
  Upload,
  CheckCircle2,
  QrCode,
  Lock,
  Calendar,
  Search,
  Filter,
  Check,
  X,
  FileSpreadsheet,
  AlertCircle,
  ExternalLink,
  Shield,
  Printer,
  Sparkles,
  ShieldCheck,
  Phone,
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
  ReportCategory,
} from '../types/index.ts';
import { DrugDiscrepancy, Medication } from '../utils/healthLogic.ts';
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
  auditTrail = [],
  consentConfig,
  onNavigate,
  onOpenReconcileModal,
  onAddReport,
  onOpenEmergencyCard,
}) => {
  // Medical Records Filter Tab
  const [recordFilterTab, setRecordFilterTab] = useState<'All' | 'Diagnostics' | 'Prescriptions' | 'Imaging' | 'Vaccines'>('All');
  const [recordSearch, setRecordSearch] = useState('');

  // Selected report for viewing
  const [viewingReport, setViewingReport] = useState<MedicalReport | null>(null);

  // Granular Consent Modal State
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const [consentPermissions, setConsentPermissions] = useState({
    generalVitals: true,
    bloodReports: true,
    radiologyScans: true,
    activePrescriptions: true,
    behavioralHealth: false,
    substanceUse: false,
    genetics: false,
  });
  const [consentExpiry, setConsentExpiry] = useState<'24h' | '7d' | '30d' | 'encounter'>('7d');
  const [selectedDoctorForSharing, setSelectedDoctorForSharing] = useState('Dr. Meera Joshi, MD (Lilavati Hospital)');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpRemainingSeconds, setOtpRemainingSeconds] = useState(900); // 15 mins

  // Emergency Lockscreen View Modal State
  const [isLockscreenModalOpen, setIsLockscreenModalOpen] = useState(false);

  // Document Upload & AI Structuring State
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'processing' | 'verified'>('idle');
  const [uploadedDocData, setUploadedDocData] = useState<{
    fileName: string;
    fileSize: string;
    doctorName: string;
    facility: string;
    date: string;
    documentType: string;
    diagnoses: string[];
    medications: Array<{ name: string; dose: string; freq: string; duration: string }>;
    referenceRanges: Array<{ test: string; result: string; unit: string; range: string; status: 'normal' | 'high' }>;
    physicianLicense: string;
  } | null>(null);

  // Filter records based on category tab & search query
  const filteredRecords = reports.filter((rep) => {
    let matchesTab = true;
    if (recordFilterTab === 'Diagnostics') {
      matchesTab = rep.category === 'Laboratory Tests';
    } else if (recordFilterTab === 'Prescriptions') {
      matchesTab = rep.category === 'Prescriptions';
    } else if (recordFilterTab === 'Imaging') {
      matchesTab = rep.category === 'Scans and Imaging';
    } else if (recordFilterTab === 'Vaccines') {
      matchesTab = rep.category === 'Vaccination Records';
    }

    const matchesSearch =
      recordSearch === '' ||
      rep.title.toLowerCase().includes(recordSearch.toLowerCase()) ||
      rep.providerName.toLowerCase().includes(recordSearch.toLowerCase()) ||
      rep.summary.toLowerCase().includes(recordSearch.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Handler for uploading or dropping sample prescription
  const handleLoadSampleUpload = (type: 'prescription' | 'lab') => {
    setUploadState('processing');
    setTimeout(() => {
      if (type === 'prescription') {
        setUploadedDocData({
          fileName: 'Rx_Lilavati_Cardiology_2026.pdf',
          fileSize: '1.4 MB',
          doctorName: 'Dr. Meera Joshi, MD (D.M. Cardiology)',
          facility: 'Lilavati Hospital & Research Centre, Bandra West',
          date: '2026-10-14',
          documentType: 'Prescription & Clinical Consultation Sheet',
          diagnoses: ['Essential Hypertension (ICD-10 I10)', 'Atrial Fibrillation - Paroxysmal (I48.91)'],
          medications: [
            { name: 'Telmisartan Tablets', dose: '40 mg', freq: 'Once daily morning', duration: '90 days' },
            { name: 'Metoprolol Succinate ER', dose: '25 mg', freq: 'Once daily morning', duration: '90 days' },
            { name: 'Warfarin Sodium', dose: '5 mg', freq: 'Once daily 20:00 (Target INR 2.0-3.0)', duration: 'Continued' },
          ],
          referenceRanges: [
            { test: 'Blood Pressure in Clinic', result: '128/82', unit: 'mmHg', range: '<130/80', status: 'normal' },
            { test: 'Heart Rate (Resting)', result: '72', unit: 'bpm', range: '60-100', status: 'normal' },
          ],
          physicianLicense: 'MCI / MMC Reg. #2004/08/3120',
        });
      } else {
        setUploadedDocData({
          fileName: 'Hinduja_Lipid_Metabolic_Panel.pdf',
          fileSize: '890 KB',
          doctorName: 'Dr. Rajesh Mehta, MD (Pathologist)',
          facility: 'P.D. Hinduja Hospital Diagnostic Lab, Mahim',
          date: '2026-10-12',
          documentType: 'Automated Serum Biochemistry & Lipid Profile',
          diagnoses: ['Mixed Dyslipidemia (ICD-10 E78.2)', 'Type 2 Diabetes Mellitus Surveillance (E11.9)'],
          medications: [
            { name: 'Atorvastatin Calcium', dose: '10 mg', freq: 'Once daily night', duration: 'Ongoing' },
            { name: 'Metformin HCl ER', dose: '500 mg', freq: 'Twice daily with meals', duration: 'Ongoing' },
          ],
          referenceRanges: [
            { test: 'Total Cholesterol', result: '178', unit: 'mg/dL', range: '<200', status: 'normal' },
            { test: 'Triglycerides', result: '142', unit: 'mg/dL', range: '<150', status: 'normal' },
            { test: 'HDL Cholesterol', result: '48', unit: 'mg/dL', range: '>40', status: 'normal' },
            { test: 'LDL Cholesterol', result: '101', unit: 'mg/dL', range: '<100', status: 'high' },
            { test: 'Glycated HbA1c', result: '5.8', unit: '%', range: '<5.7 Normal, <6.5 Controlled', status: 'normal' },
          ],
          physicianLicense: 'NABL Certified Lab #MC-2490',
        });
      }
      setUploadState('verified');
    }, 1200);
  };

  const handleApproveAndAddRecord = () => {
    if (!uploadedDocData) return;

    const newReport: MedicalReport = {
      id: `rep-upl-${Date.now()}`,
      title: uploadedDocData.documentType,
      providerName: uploadedDocData.facility,
      reportDate: uploadedDocData.date,
      category: uploadedDocData.documentType.includes('Prescription') ? 'Prescriptions' : 'Laboratory Tests',
      uploadDate: new Date().toISOString().split('T')[0],
      verificationStatus: 'Patient Verified',
      processingStatus: 'AI Extracted',
      fileFormat: 'PDF',
      fileSize: uploadedDocData.fileSize,
      summary: `Clinically structured document from ${uploadedDocData.facility}. Extracted diagnoses: ${uploadedDocData.diagnoses.join(', ')}.`,
      aiConfidence: 98.6,
      extractedFields: {
        dates: [uploadedDocData.date],
        medicationsOrTests: uploadedDocData.medications.map((m) => `${m.name} ${m.dose}`),
        results: uploadedDocData.referenceRanges.map((r) => ({
          label: r.test,
          value: r.result,
          unit: r.unit,
          status: r.status,
        })),
        physicianName: uploadedDocData.doctorName,
        keyFindings: uploadedDocData.diagnoses,
      },
      originalPreviewText: `OFFICIAL CLINICAL RECORD\nProvider: ${uploadedDocData.facility}\nAttending: ${uploadedDocData.doctorName} (${uploadedDocData.physicianLicense})\nDate: ${uploadedDocData.date}\nPrescribed Items: ${uploadedDocData.medications.map((m) => `${m.name} ${m.dose} (${m.freq})`).join('; ')}\nVerified by ZeniCare Platform.`,
    };

    if (onAddReport) {
      onAddReport(newReport);
    }
    setUploadState('idle');
    setUploadedDocData(null);
  };

  const handleGenerateShareOtp = () => {
    const randomOtp = `MB-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedOtp(randomOtp);
    setOtpRemainingSeconds(900);
  };

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* 1. TOP BAR: PATIENT QUICK-GLANCE BANNER                 */}
      {/* ======================================================== */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Patient Core Identifier Block */}
          <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
            <div className="w-12 h-12 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-base shrink-0 tracking-wider">
              {patient.fullName.includes('Aarav') ? 'AS' : 'AM'}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 truncate">
                  {patient.fullName}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {patient.gender}, {patient.age} yrs
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
                  Blood Group: {patient.bloodGroup}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1" />
                  ABHA Verified
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                <span>
                  ABHA ID: <strong className="font-mono text-slate-800">{patient.fullName.includes('Aarav') ? '91-4491-0283-9912' : '14-8820-4109-2234'}</strong>
                </span>
                <span>•</span>
                <span>
                  MRN: <strong className="font-mono text-slate-800">#{patient.id}</strong>
                </span>
                <span>•</span>
                <span>
                  Primary Physician: <strong className="text-slate-800">{patient.primaryCarePhysician?.name || 'Dr. Rajesh Mehta'}</strong>
                </span>
                <span>•</span>
                <span>
                  Height/Weight: <strong className="text-slate-800">{patient.height} / {patient.weight}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsLockscreenModalOpen(true)}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Emergency Lock-Screen</span>
            </button>
            <button
              onClick={() => setIsConsentModalOpen(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Records</span>
            </button>
          </div>
        </div>

        {/* Soft Amber Active Allergies Banner */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-start sm:items-center space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <span className="font-bold text-amber-900 uppercase tracking-wide text-[11px] mr-2">
                  Active Verified Allergies:
                </span>
                <span className="font-medium text-amber-900">
                  {allergies.map((a) => `${a.substance} (${a.reaction})`).join(' • ')}
                </span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('allergies')}
              className="text-amber-800 hover:text-amber-950 font-semibold underline text-xs shrink-0 sm:ml-4 text-left"
            >
              View Allergy Registry &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. "AT-A-GLANCE" METRICS: 4 CLEAN KPI CARDS              */}
      {/* ======================================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Recent Records */}
        <div
          onClick={() => onNavigate('reports')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-medium text-slate-500 block">Unified Records</span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">{reports.length}</div>
            <span className="inline-flex items-center text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200 mt-1">
              +3 synced this week
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <FileText className="w-5 h-5 text-sky-700" />
          </div>
        </div>

        {/* KPI 2: Active Medications */}
        <div
          onClick={() => onNavigate('medications')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-medium text-slate-500 block">Active Medications</span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">5 Prescriptions</div>
            <span
              className={`inline-flex items-center text-[11px] font-medium px-2 py-0.2 rounded border mt-1 ${
                discrepancies.length > 0
                  ? 'bg-red-50 text-red-800 border-red-200 font-semibold'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {discrepancies.length > 0 ? '1 Safety Discrepancy' : 'All Cross-Checked'}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Pill className="w-5 h-5 text-slate-700" />
          </div>
        </div>

        {/* KPI 3: Linked Clinics */}
        <div
          onClick={() => onNavigate('connected_systems')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-medium text-slate-500 block">Linked Clinics & Labs</span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">5 Facilities</div>
            <span className="inline-flex items-center text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.2 rounded border border-slate-200 mt-1 truncate max-w-[150px]">
              Lilavati, Hinduja, Kokilaben
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-slate-700" />
          </div>
        </div>

        {/* KPI 4: Pending Consent Requests */}
        <div
          onClick={() => onNavigate('consent')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-medium text-slate-500 block">Pending Consent Requests</span>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">2 Requests</div>
            <span className="inline-flex items-center text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.2 rounded border border-amber-200 mt-1">
              Review & Authorize
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-sky-700" />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. 2-COLUMN SPLIT: MAIN CENTER STREAM (8) + RIGHT (4)     */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* ====================================================== */}
        {/* MAIN CENTER STREAM (COL 1 TO 8)                         */}
        {/* ====================================================== */}
        <div className="xl:col-span-8 space-y-6">
          {/* Document Upload & AI Structuring Section */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900 flex items-center space-x-2">
                  <Upload className="w-4 h-4 text-sky-700" />
                  <span>Clinical Document Upload & Verification</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Drop scanned prescriptions, laboratory sheets, or discharge summaries for 2-step structured extraction
                </p>
              </div>
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 hidden sm:inline">
                PDF • JPG • PNG (Max 25MB)
              </span>
            </div>

            {uploadState === 'idle' && (
              <div>
                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingFile(true);
                  }}
                  onDragLeave={() => setIsDraggingFile(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingFile(false);
                    handleLoadSampleUpload('prescription');
                  }}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                    isDraggingFile
                      ? 'border-sky-600 bg-sky-50/40'
                      : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
                  }`}
                >
                  <div className="w-10 h-10 mx-auto rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-2xs mb-2">
                    <FileText className="w-5 h-5 text-sky-700" />
                  </div>
                  <h3 className="text-xs font-semibold text-slate-800">
                    Drag and drop your medical report here, or click to browse
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    AI structures medications, reference intervals, diagnosis codes, and physician signatures
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => handleLoadSampleUpload('prescription')}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center space-x-1"
                    >
                      <span>Load Sample: Lilavati Hospital Prescription (PDF)</span>
                    </button>
                    <button
                      onClick={() => handleLoadSampleUpload('lab')}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center space-x-1"
                    >
                      <span>Load Sample: Hinduja Hospital Lab Panel (PDF)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {uploadState === 'processing' && (
              <div className="py-10 text-center space-y-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="inline-flex p-3 rounded-full bg-sky-50 text-sky-700 animate-spin">
                  <Activity className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Parsing Clinical Entities & OCR Layer...
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Extracting ICD-10 diagnostic codes, dosage frequencies, and checking values against Indian & standard adult reference ranges.
                </p>
              </div>
            )}

            {uploadState === 'verified' && uploadedDocData && (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900">
                  <span className="flex items-center space-x-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>OCR Extraction Complete • 98.6% Verification Confidence</span>
                  </span>
                  <button
                    onClick={() => setUploadState('idle')}
                    className="text-slate-500 hover:text-slate-800 font-semibold"
                  >
                    Reset
                  </button>
                </div>

                {/* 2-Step Verification Preview: Left = Scanned Document, Right = Extracted Entities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-200 rounded-xl p-4 bg-slate-50/40">
                  {/* Left: Scanned Document Preview */}
                  <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs font-mono text-[11px] space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">{uploadedDocData.facility}</span>
                        <span className="text-[10px] text-slate-500">Department of Internal Medicine & Diagnostics</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                        Scanned PDF
                      </span>
                    </div>

                    <div className="text-slate-700 space-y-1 text-[11px]">
                      <div>
                        <span className="text-slate-400">Attending:</span> {uploadedDocData.doctorName}
                      </div>
                      <div>
                        <span className="text-slate-400">Date:</span> {uploadedDocData.date}
                      </div>
                      <div>
                        <span className="text-slate-400">Patient:</span> {patient.fullName} (Age {patient.age}, {patient.gender})
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-slate-400 font-bold block text-[10px] uppercase">Original Rx Body:</span>
                      <div className="mt-1 p-2 bg-slate-50 rounded text-slate-800 text-[10px] space-y-1">
                        {uploadedDocData.medications.map((m, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>Rx: {m.name} ({m.dose})</span>
                            <span className="text-slate-500">{m.freq}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-1 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>{uploadedDocData.physicianLicense}</span>
                      <span className="text-emerald-700 font-semibold">Digitally Signed</span>
                    </div>
                  </div>

                  {/* Right: Extracted Clinical Entities */}
                  <div className="space-y-3 text-xs">
                    <div className="font-semibold text-slate-800 text-xs">
                      Extracted Clinical Entities (Structured FHIR Representation)
                    </div>

                    <div>
                      <span className="text-slate-500 text-[11px] font-medium block mb-1">Coded Diagnoses:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {uploadedDocData.diagnoses.map((d, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-medium border border-slate-200 text-[11px]"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 text-[11px] font-medium block mb-1">Prescribed Regimens:</span>
                      <div className="space-y-1.5">
                        {uploadedDocData.medications.map((m, i) => (
                          <div
                            key={i}
                            className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between text-[11px]"
                          >
                            <div>
                              <strong className="text-slate-900">{m.name}</strong> • {m.dose}
                              <span className="block text-slate-500 text-[10px]">{m.freq}</span>
                            </div>
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {m.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {uploadedDocData.referenceRanges.length > 0 && (
                      <div>
                        <span className="text-slate-500 text-[11px] font-medium block mb-1">Vitals & Lab Values:</span>
                        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                          {uploadedDocData.referenceRanges.map((r, i) => (
                            <div key={i} className="p-1.5 rounded bg-white border border-slate-200">
                              <span className="text-slate-500 block text-[10px] truncate">{r.test}</span>
                              <strong className="text-slate-900">{r.result} {r.unit}</strong>
                              <span className="text-[10px] text-slate-400 block font-normal">Ref: {r.range}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setUploadState('idle')}
                        className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
                      >
                        Discard
                      </button>
                      <button
                        onClick={handleApproveAndAddRecord}
                        className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve & Add to Record</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Longitudinal Health Timeline Feed */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-sky-700" />
                  <span>Longitudinal Health Timeline</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Chronological unified feed grouped by month/year with cross-hospital facility badges
                </p>
              </div>
              <button
                onClick={() => onNavigate('timeline')}
                className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center space-x-1"
              >
                <span>Full Timeline</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {recentEncounters.slice(0, 4).map((enc, idx) => (
                <div
                  key={enc.id || idx}
                  className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-900 text-sm">
                        {enc.reasonForVisit}
                      </span>
                      {/* Clear facility badge */}
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        {enc.facility} — {enc.encounterClass}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-500 bg-slate-50">
                        {enc.department}
                      </span>
                    </div>

                    <p className="text-slate-600 text-xs">
                      Attending Physician: <strong className="text-slate-800">{enc.attendingPhysician}</strong>
                      <span className="text-slate-400 mx-1.5">•</span>
                      <span>Specialty: {enc.specialty}</span>
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
                      className="text-xs font-semibold text-sky-700 hover:text-sky-800 hover:underline"
                    >
                      View SOAP Note &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Medical Records Table/List with Filter Tabs */}
          <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-sky-700" />
                  <span>Medical Records & Document Library</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Searchable, category-filtered clinical records with date stamps and physician authorizations
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={recordSearch}
                  onChange={(e) => setRecordSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1 pb-3 mb-3 border-b border-slate-200 overflow-x-auto text-xs font-medium">
              {(['All', 'Diagnostics', 'Prescriptions', 'Imaging', 'Vaccines'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setRecordFilterTab(tab)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    recordFilterTab === tab
                      ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
              <span className="text-slate-400 text-xs ml-auto pl-2 hidden md:inline">
                {filteredRecords.length} records found
              </span>
            </div>

            {/* Clean Enterprise Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Document Title</th>
                    <th className="py-2.5 px-3">Facility / Clinician</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Date Stamp</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.slice(0, 6).map((rep) => (
                    <tr key={rep.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-[200px] truncate">
                        <span className="block truncate">{rep.title}</span>
                        <span className="text-[10px] font-normal text-slate-400 font-mono">
                          {rep.fileFormat} • {rep.fileSize}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 max-w-[180px] truncate">
                        <span className="block truncate font-medium text-slate-800">{rep.providerName}</span>
                        <span className="text-[10px] text-slate-400 truncate block">
                          {rep.extractedFields?.physicianName || 'Verified Medical Officer'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
                          {rep.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {rep.reportDate}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium ${
                            rep.verificationStatus.includes('Verified')
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {rep.verificationStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setViewingReport(rep)}
                            className="p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                            title="View Document Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              alert(`Downloading verified copy of "${rep.title}" (${rep.fileFormat})`);
                            }}
                            className="p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setIsConsentModalOpen(true)}
                            className="p-1.5 rounded hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                            title="Share with Clinician"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRecords.length > 6 && (
              <div className="mt-3 text-center">
                <button
                  onClick={() => onNavigate('reports')}
                  className="text-xs font-semibold text-sky-700 hover:text-sky-800"
                >
                  View all {filteredRecords.length} records in full repository &rarr;
                </button>
              </div>
            )}
          </section>
        </div>

        {/* ====================================================== */}
        {/* RIGHT CONTEXT PANEL (COL 9 TO 12)                       */}
        {/* ====================================================== */}
        <div className="xl:col-span-4 space-y-6">
          {/* Quick "Share Records" Card with Time-Limited OTP / QR */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-md bg-sky-50 text-sky-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Doctor Share & Access Code
                </h3>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Time-Bound OTP
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-2.5">
              Generate a time-limited 15-minute OTP and authorization QR for your consulting physician.
            </p>

            {generatedOtp ? (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
                  Active Doctor Verification Code
                </span>
                <div className="font-mono text-2xl font-bold tracking-widest text-slate-900">
                  {generatedOtp}
                </div>
                <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded p-1.5 font-medium flex items-center justify-center space-x-1">
                  <Clock className="w-3 h-3 text-amber-700" />
                  <span>Valid for consultation: {Math.floor(otpRemainingSeconds / 60)}m {otpRemainingSeconds % 60}s</span>
                </div>

                {/* Scannable Doctor Access QR representation */}
                <div className="pt-2 flex flex-col items-center">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    <svg viewBox="0 0 100 100" className="w-24 h-24 fill-current text-slate-900">
                      <rect x="5" y="5" width="26" height="26" rx="2" fill="black" />
                      <rect x="10" y="10" width="16" height="16" fill="white" />
                      <rect x="14" y="14" width="8" height="8" fill="black" />
                      <rect x="69" y="5" width="26" height="26" rx="2" fill="black" />
                      <rect x="74" y="10" width="16" height="16" fill="white" />
                      <rect x="78" y="14" width="8" height="8" fill="black" />
                      <rect x="5" y="69" width="26" height="26" rx="2" fill="black" />
                      <rect x="10" y="74" width="16" height="16" fill="white" />
                      <rect x="14" y="78" width="8" height="8" fill="black" />
                      <rect x="40" y="10" width="5" height="5" />
                      <rect x="50" y="15" width="5" height="5" />
                      <rect x="40" y="25" width="5" height="5" />
                      <rect x="50" y="45" width="8" height="8" fill="#0284c7" />
                      <rect x="40" y="75" width="5" height="5" />
                      <rect x="55" y="75" width="5" height="5" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">
                    Scan with MediBridge Provider App
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <button
                  onClick={handleGenerateShareOtp}
                  className="w-full py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-2xs"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Generate Quick OTP & QR</span>
                </button>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setIsConsentModalOpen(true)}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center space-x-1"
              >
                <span>Granular Sharing Settings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] text-slate-400">Patient Sovereign</span>
            </div>
          </div>

          {/* Critical Alerts / Contraindication flags */}
          {discrepancies.length > 0 && (
            <div className="bg-red-50/70 border border-red-200 rounded-xl p-4 shadow-2xs">
              <div className="flex items-start space-x-2.5">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-red-900 uppercase tracking-wide">
                    Cross-Hospital Safety Discrepancy
                  </h4>
                  <p className="text-xs text-red-800 leading-relaxed">
                    <strong className="underline">{discrepancies[0].drugA}</strong> ({discrepancies[0].facilityA}) co-prescribed with{' '}
                    <strong className="underline">{discrepancies[0].drugB}</strong> ({discrepancies[0].facilityB}).
                  </p>
                  <p className="text-[11px] text-red-700 font-medium">
                    Concurrent anticoagulant + antiplatelet therapy elevates bleeding risk.
                  </p>

                  <button
                    onClick={onOpenReconcileModal}
                    className="mt-2 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1"
                  >
                    <span>Reconcile Drug Discrepancy &rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Doctor Access Log: Real-time audit trail of who recently viewed records */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Doctor Access Log
                </h3>
              </div>
              <button
                onClick={() => onNavigate('consent')}
                className="text-xs font-semibold text-sky-700 hover:text-sky-800"
              >
                Full Audit
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-2 mb-3">
              Real-time audit trail of clinicians accessing your records:
            </p>

            <div className="space-y-2.5">
              {[
                {
                  doctor: 'Dr. Meera Joshi, MD',
                  facility: 'Lilavati Hospital (Cardiology)',
                  action: 'Viewed ECG & Lab Reports',
                  time: '14 mins ago',
                  status: 'Authorized',
                },
                {
                  doctor: 'Dr. Elena Vance, MD',
                  facility: 'Metro Trauma Bay',
                  action: 'Emergency Triage Review',
                  time: '2 hours ago',
                  status: 'Authorized',
                },
                {
                  doctor: 'Dr. Rajesh Mehta, MD',
                  facility: 'Hinduja Diagnostic Lab',
                  action: 'Biomarker Panel Audit',
                  time: 'Yesterday 16:30',
                  status: 'Authorized',
                },
              ].map((log, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{log.doctor}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
                  </div>
                  <div className="text-[11px] text-slate-600 truncate">{log.facility}</div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px]">
                    <span className="text-slate-500">{log.action}</span>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Cryptographic Audit Chain</span>
              <span className="font-mono text-slate-700 font-semibold">AES-256</span>
            </div>
          </div>

          {/* Reconciled Vitals Quick Snapshot */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-sky-700" />
                <span>Reconciled Vitals</span>
              </h3>
              <button
                onClick={() => onNavigate('labs')}
                className="text-xs font-semibold text-sky-700 hover:text-sky-800"
              >
                Trends &rarr;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {vitals.slice(0, 4).map((vital) => (
                <div key={vital.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/40">
                  <span className="text-[10px] text-slate-500 block truncate">{vital.type}</span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {vital.value} <span className="text-[10px] font-normal text-slate-500">{vital.unit}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 block truncate mt-1">{vital.facility}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: GRANULAR CONSENT MANAGEMENT MODAL              */}
      {/* ======================================================== */}
      {isConsentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Granular Record Sharing Consent
                  </h3>
                  <p className="text-xs text-slate-500">
                    Control exactly which categories you permit this physician to access
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsConsentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Doctor Selector */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-700">Granting Access To:</label>
              <select
                value={selectedDoctorForSharing}
                onChange={(e) => setSelectedDoctorForSharing(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-sky-600"
              >
                <option value="Dr. Meera Joshi, MD (Lilavati Hospital)">Dr. Meera Joshi, MD (Lilavati Hospital - Cardiology)</option>
                <option value="Dr. Rajesh Mehta, MD (Hinduja Hospital)">Dr. Rajesh Mehta, MD (P.D. Hinduja Hospital - Internal Med)</option>
                <option value="Dr. Elena Vance, MD (Chief of ER)">Dr. Elena Vance, MD (Metro Trauma Bay - Emergency)</option>
                <option value="Emergency Responders (Any Verified Paramedic)">Emergency Responders (Any Verified Paramedic)</option>
              </select>
            </div>

            {/* Category Toggles */}
            <div className="space-y-2 text-xs">
              <label className="font-semibold text-slate-700 block">Permitted Record Scopes:</label>

              {[
                { key: 'generalVitals', label: 'General Vitals & Physical Exams', desc: 'Blood pressure, pulse, BMI, respiratory trends' },
                { key: 'bloodReports', label: 'Blood Reports & Laboratory Diagnostics', desc: 'CBC, Lipid, Metabolic, HbA1c panels' },
                { key: 'radiologyScans', label: 'Radiology Scans & Imaging', desc: 'Chest X-Ray, Brain MRI, Ultrasound' },
                { key: 'activePrescriptions', label: 'Active Prescriptions & Allergies', desc: 'Warfarin, Metformin, Penicillin alert' },
                { key: 'behavioralHealth', label: 'Behavioral Health & Psychiatry', desc: 'Sensitive: Mental health consultation notes', sensitive: true },
                { key: 'substanceUse', label: 'Substance Use Records', desc: 'Sensitive: Screenings and historical entries', sensitive: true },
              ].map((cat) => (
                <label
                  key={cat.key}
                  className={`flex items-start justify-between p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    consentPermissions[cat.key as keyof typeof consentPermissions]
                      ? 'bg-sky-50/50 border-sky-300'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="pr-3">
                    <span className="font-semibold text-slate-900 block flex items-center space-x-1">
                      <span>{cat.label}</span>
                      {cat.sensitive && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                          Sensitive
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-slate-500">{cat.desc}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={consentPermissions[cat.key as keyof typeof consentPermissions]}
                    onChange={(e) =>
                      setConsentPermissions((prev) => ({ ...prev, [cat.key]: e.target.checked }))
                    }
                    className="mt-1 h-4 w-4 rounded text-sky-700 focus:ring-sky-600 border-slate-300"
                  />
                </label>
              ))}
            </div>

            {/* Expiry Selector */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-700">Access Expiry Window:</label>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {[
                  { id: '24h', label: '24 Hours' },
                  { id: '7d', label: '7 Days' },
                  { id: '30d', label: '30 Days' },
                  { id: 'encounter', label: 'Single Visit' },
                ].map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setConsentExpiry(exp.id as any)}
                    className={`py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      consentExpiry === exp.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {exp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
              <button
                onClick={() => setIsConsentModalOpen(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleGenerateShareOtp();
                  setIsConsentModalOpen(false);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-2xs"
              >
                Save & Generate Sovereign Access Token
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EMERGENCY LOCK-SCREEN VIEW MODAL               */}
      {/* ======================================================== */}
      {isLockscreenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 text-white border-2 border-red-500 shadow-2xl space-y-5">
            {/* Lockscreen Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-red-400 block">
                    Emergency Lock-Screen Card
                  </span>
                  <h3 className="text-lg font-bold text-white">First Responder Triage Summary</h3>
                </div>
              </div>
              <button
                onClick={() => setIsLockscreenModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Critical Patient Identity */}
            <div className="space-y-1">
              <div className="flex items-baseline justify-between">
                <h4 className="text-2xl font-black text-white">{patient.fullName}</h4>
                <span className="text-2xl font-black text-red-400">{patient.bloodGroup}</span>
              </div>
              <p className="text-xs text-slate-400">
                Age {patient.age} yrs • DOB: {patient.birthDate} • ID: #{patient.id}
              </p>
            </div>

            {/* Life-Saving Allergy Warning Box */}
            <div className="p-3.5 rounded-xl bg-red-950 border border-red-600/80 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-red-400 font-bold uppercase text-[11px]">
                <AlertTriangle className="w-4 h-4" />
                <span>Critical Allergy Alert (DO NOT ADMINISTER):</span>
              </div>
              <p className="text-sm font-bold text-white">
                PENICILLIN & BETA-LACTAMS (Severe Anaphylaxis / Stridor)
              </p>
              <p className="text-[11px] text-red-300">
                Secondary: Peanut Protein (Cutaneous flushing & facial urticaria)
              </p>
            </div>

            {/* Critical Conditions & Anticoagulation */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                  Cardiovascular
                </span>
                <span className="font-bold text-white block mt-0.5">Atrial Fibrillation</span>
                <span className="text-[10px] text-amber-300 font-medium block">
                  Anticoagulated on Warfarin 5mg
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                  Metabolic
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

            {/* Actions: Export PDF / Wallet Pass */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export PDF Card</span>
              </button>

              <button
                onClick={() => {
                  alert('Added emergency medical ID to Apple Wallet & Google Wallet pass file (.pkpass)');
                }}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save to Wallet Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: MEDICAL REPORT DETAIL VIEWER                    */}
      {/* ======================================================== */}
      {viewingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                  {viewingReport.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{viewingReport.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {viewingReport.providerName} • Recorded: {viewingReport.reportDate}
                </p>
              </div>
              <button
                onClick={() => setViewingReport(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
              <span className="font-semibold text-slate-900 block">Executive Summary:</span>
              <p>{viewingReport.summary}</p>
            </div>

            {/* Extracted Biomarkers or Medicines */}
            {viewingReport.extractedFields?.results && viewingReport.extractedFields.results.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-900 block">
                  Extracted Biomarkers & Test Parameters:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {viewingReport.extractedFields.results.map((res, i) => (
                    <div key={i} className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs">
                      <span className="text-slate-500 block text-[10px] truncate">{res.label}</span>
                      <strong className="text-slate-900 text-sm">{res.value} {res.unit || ''}</strong>
                      {res.status && (
                        <span className={`block text-[10px] font-semibold mt-0.5 ${
                          res.status === 'normal' ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          {res.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw Document Archive Text */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-900 block">Verified Archive Text:</span>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-[11px] font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {viewingReport.originalPreviewText}
              </pre>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Verification: <strong className="text-emerald-700">{viewingReport.verificationStatus}</strong>
              </span>
              <button
                onClick={() => setViewingReport(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
