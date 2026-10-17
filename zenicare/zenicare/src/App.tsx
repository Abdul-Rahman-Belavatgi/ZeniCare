import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { Sidebar, NavTab } from './components/Sidebar.tsx';
import { OverviewDashboard } from './components/OverviewDashboard.tsx';
import { MedicalTimeline } from './components/MedicalTimeline.tsx';
import { ConsentCenter } from './components/ConsentCenter.tsx';
import { EmergencyHealthCard } from './components/EmergencyHealthCard.tsx';
import { PublicLandingAndAuth } from './components/PublicLandingAndAuth.tsx';
import { AIDocumentLab } from './components/AIDocumentLab.tsx';
import { RightRail } from './components/RightRail.tsx';

import {
  INITIAL_PATIENT,
  INITIAL_VITALS,
  INITIAL_CONDITIONS,
  INITIAL_ALLERGIES,
  INITIAL_MEDICATIONS,
  INITIAL_ENCOUNTERS,
  INITIAL_AUDIT_TRAIL,
  INITIAL_CONSENT_CONFIG,
  INITIAL_MEDICAL_REPORTS,
} from './data/mockData.ts';

import {
  UserRole,
  PatientDemographics,
  ClinicalEncounter,
  SecurityAuditEntry,
  PrivacyConsentConfig,
  AllergyAlert,
  MedicalReport,
  UploadedDocument,
} from './types/index.ts';

import {
  Medication,
  detectDrugInteractions,
} from './utils/healthLogic.ts';
import {
  MUMBAI_PATIENT,
  MUMBAI_REPORTS,
} from './data/mumbaiData.ts';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('patient');
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [patient] = useState<PatientDemographics>(MUMBAI_PATIENT);
  const [conditions] = useState(INITIAL_CONDITIONS);
  const [allergies] = useState<AllergyAlert[]>(INITIAL_ALLERGIES);
  const [medications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [encounters] = useState<ClinicalEncounter[]>(INITIAL_ENCOUNTERS);
  const [consentConfig, setConsentConfig] = useState<PrivacyConsentConfig>(INITIAL_CONSENT_CONFIG);
  const [auditTrail, setAuditTrail] = useState<SecurityAuditEntry[]>(INITIAL_AUDIT_TRAIL);
  const [reports] = useState<MedicalReport[]>([...MUMBAI_REPORTS, ...INITIAL_MEDICAL_REPORTS]);

  // Documents state managed by local AIDocumentLab
  const [labDocuments, setLabDocuments] = useState<UploadedDocument[]>([
    {
      id: 'doc-initial-1',
      fileName: 'Lilavati_Discharge_Summary.pdf',
      fileType: 'PDF',
      uploadDate: '2026-09-21',
      facilitySource: 'Lilavati Hospital & Research Centre (Bandra West)',
      status: 'Extracted',
      confidenceScore: 98.2,
      documentCategory: 'Discharge Summary',
      rawOcrSnippet: 'Patient: Aarav Sharma. Diagnosis: Paroxysmal Atrial Fibrillation. RX: Warfarin 5mg daily.',
      extractedEntities: {
        medications: [{ name: 'Warfarin', dose: '5 mg oral daily', frequency: 'Once daily' }],
        vitals: [{ label: 'Blood Pressure', value: '122/78 mmHg' }],
        conditions: [{ name: 'Paroxysmal Atrial Fibrillation', code: 'ICD-10 I48.0' }],
        allergies: [],
      },
      sourceCitations: [
        { page: 1, boundingSnippet: 'Warfarin 5mg daily oral intake', targetField: 'MedicationStatement', verified: true },
      ],
    },
  ]);

  const discrepancies = detectDrugInteractions(medications);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUploadNewDocument = (newDoc: UploadedDocument) => {
    setLabDocuments((prev) => [newDoc, ...prev]);
    showToast(`Successfully extracted and persisted: ${newDoc.fileName}`);
  };

  const handleIngestToTimeline = (docId: string) => {
    showToast(`Document #${docId} ingested into longitudinal timeline`);
  };

  if (!isAuthenticated) {
    return (
      <PublicLandingAndAuth
        onSelectRoleAndLogin={(role) => {
          setCurrentRole(role);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans antialiased text-slate-800">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center space-x-2 border border-slate-700 animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {isEmergencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">Emergency Passport</h2>
              <button onClick={() => setIsEmergencyModalOpen(false)} className="text-slate-400 hover:text-slate-900">Close</button>
            </div>
            <div className="p-6">
              <EmergencyHealthCard
                patient={patient}
                allergies={allergies}
                conditions={conditions}
                medications={medications}
                onBreakGlassOverride={() => showToast('Override active')}
                isBreakGlassActive={false}
              />
            </div>
          </div>
        </div>
      )}

      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenEmergencyCard={() => setIsEmergencyModalOpen(true)}
        onOpenDiscrepancyHub={() => {}}
        discrepancyCount={discrepancies.length}
        isSyncing={false}
        onTriggerSync={() => {}}
        onShowPublicPortal={() => setIsAuthenticated(false)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        patientName={patient.fullName}
      />

      <div className="flex flex-1 overflow-hidden min-h-0">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          currentRole={currentRole}
          discrepancyCount={discrepancies.length}
          reportsCount={labDocuments.length}
          onLogout={() => setIsAuthenticated(false)}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 overflow-y-auto bg-slate-50/50 flex">
          <div className="flex-1 max-w-5xl mx-auto p-6 sm:p-8 space-y-6">
            {currentTab === 'overview' && (
              <OverviewDashboard
                patient={patient}
                vitals={INITIAL_VITALS}
                conditions={conditions}
                allergies={allergies}
                recentEncounters={encounters}
                discrepancies={discrepancies}
                reports={reports}
                auditTrail={auditTrail}
                consentConfig={consentConfig}
                onNavigate={setCurrentTab}
                onOpenReconcileModal={() => {}}
                onAddReport={() => {}}
                onOpenEmergencyCard={() => setIsEmergencyModalOpen(true)}
              />
            )}
            {currentTab === 'reports' && (
              <AIDocumentLab
                documents={labDocuments}
                onUploadNewDocument={handleUploadNewDocument}
                onIngestToTimeline={handleIngestToTimeline}
              />
            )}
            {currentTab === 'timeline' && (
              <MedicalTimeline
                encounters={encounters}
                onAddEncounter={() => {}}
                isClinician={currentRole === 'clinician'}
              />
            )}
            {currentTab === 'consent' && (
              <ConsentCenter
                consentConfig={consentConfig}
                onUpdateConsentConfig={setConsentConfig}
                auditTrail={auditTrail}
                onAddAuditEntry={(entry) => setAuditTrail((prev) => [entry, ...prev])}
              />
            )}
          </div>
          <RightRail consentConfig={consentConfig} discrepancies={discrepancies} />
        </main>
      </div>
    </div>
  );
}