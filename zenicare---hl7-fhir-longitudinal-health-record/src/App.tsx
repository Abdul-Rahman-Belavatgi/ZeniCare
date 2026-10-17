import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { Sidebar, NavTab } from './components/Sidebar.tsx';
import { OverviewDashboard } from './components/OverviewDashboard.tsx';
import { MedicalTimeline } from './components/MedicalTimeline.tsx';
import { ConsentCenter } from './components/ConsentCenter.tsx';
import { EmergencyHealthCard } from './components/EmergencyHealthCard.tsx';
import { PublicLandingAndAuth } from './components/PublicLandingAndAuth.tsx';
import { MedicalReports } from './components/MedicalReports.tsx';
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
  AI_HEALTH_BRIEF,
} from './data/mockData.ts';

import {
  UserRole,
  PatientDemographics,
  ClinicalEncounter,
  SecurityAuditEntry,
  PrivacyConsentConfig,
  AllergyAlert,
  MedicalReport,
} from './types/index.ts';

import {
  Medication,
  detectDrugInteractions,
} from './utils/healthLogic.ts';
import {
  MUMBAI_PATIENT,
  MUMBAI_REPORTS,
  MUMBAI_DOCTORS,
} from './data/mumbaiData.ts';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('patient');
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [patient, setPatient] = useState<PatientDemographics>(MUMBAI_PATIENT);
  const [vitals] = useState(INITIAL_VITALS);
  const [conditions] = useState(INITIAL_CONDITIONS);
  const [allergies] = useState<AllergyAlert[]>(INITIAL_ALLERGIES);
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [encounters, setEncounters] = useState<ClinicalEncounter[]>(INITIAL_ENCOUNTERS);
  const [consentConfig, setConsentConfig] = useState<PrivacyConsentConfig>(INITIAL_CONSENT_CONFIG);
  const [auditTrail, setAuditTrail] = useState<SecurityAuditEntry[]>(INITIAL_AUDIT_TRAIL);
  const [reports, setReports] = useState<MedicalReport[]>([...MUMBAI_REPORTS, ...INITIAL_MEDICAL_REPORTS]);

  const discrepancies = detectDrugInteractions(medications);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!isAuthenticated) {
    return (
      <PublicLandingAndAuth
        onSelectRoleAndLogin={(role, persona) => {
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
                onBreakGlassOverride={(j, n, c) => showToast('Override active')}
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
          reportsCount={reports.length}
          onLogout={() => setIsAuthenticated(false)}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 overflow-y-auto bg-slate-50/50 flex">
          <div className="flex-1 max-w-4xl mx-auto p-6 sm:p-8 space-y-6">
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
              <MedicalReports
                reports={reports}
                onAddReport={() => {}}
                onDeleteReport={() => {}}
                onVerifyReport={() => {}}
                onOpenSharing={() => setCurrentTab('consent')}
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
                onAddAuditEntry={() => {}}
              />
            )}
          </div>
          <RightRail consentConfig={consentConfig} discrepancies={discrepancies} />
        </main>
      </div>
    </div>
  );
}
