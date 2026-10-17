export type UserRole = 'patient' | 'clinician';

export interface PatientDemographics {
  id: string;
  mrn: string;
  fullName: string;
  preferredName: string;
  birthDate: string;
  age: number;
  gender: string;
  bloodGroup: string;
  height: string;
  weight: string;
  bmi: string;
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  primaryCarePhysician: {
    name: string;
    facility: string;
    phone: string;
  };
}

export interface VitalSign {
  id: string;
  type: 'Blood Pressure' | 'Heart Rate' | 'SpO2' | 'Respiratory Rate' | 'Body Temperature' | 'Blood Glucose';
  value: string;
  unit: string;
  status: 'normal' | 'elevated' | 'warning' | 'critical';
  recordedAt: string;
  facility: string;
  recordedBy: string;
}

export interface ChronicCondition {
  id: string;
  name: string;
  icd10: string;
  clinicalStatus: 'Active' | 'Controlled' | 'Recurrence' | 'Resolved';
  verificationStatus: 'Confirmed' | 'Differential' | 'Provisional';
  onsetDate: string;
  diagnosingFacility: string;
  diagnosingPhysician: string;
  notes: string;
}

export interface AllergyAlert {
  id: string;
  substance: string;
  category: 'medication' | 'food' | 'environment' | 'biologic';
  severity: 'Critical / High' | 'Moderate' | 'Mild';
  criticality: 'high' | 'moderate' | 'low';
  reaction: string;
  clinicalManifestation: string;
  verifiedBy: string;
  verifiedDate: string;
  fhirCode: string;
}

export interface ClinicalEncounter {
  id: string;
  facility: string;
  facilityType: 'Hospital' | 'Primary Care' | 'Emergency Dept' | 'Diagnostic Center' | 'Specialty Clinic';
  encounterClass: 'Inpatient' | 'Outpatient' | 'Emergency' | 'Telehealth' | 'Diagnostic';
  department: string;
  date: string;
  reasonForVisit: string;
  attendingPhysician: string;
  specialty: string;
  soapNotes: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  dischargeSummary?: string;
  fhirEncounterId: string;
  status: 'Finished' | 'In Progress' | 'Amended';
  isSensitiveCategory?: 'general' | 'behavioral' | 'substance' | 'genetics';
}

export interface LabResultItem {
  name: string;
  value: number | string;
  numericValue?: number;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'high' | 'low' | 'critical';
}

export interface DiagnosticLabReport {
  id: string;
  testName: string;
  category: 'Hematology' | 'Metabolic' | 'Lipid' | 'Endocrine' | 'Urinalysis' | 'Immunology';
  date: string;
  facility: string;
  orderingPhysician: string;
  status: 'Final' | 'Preliminary' | 'Corrected';
  items: LabResultItem[];
  clinicalImpression: string;
  fhirObservationIds: string[];
}

export interface RadiologyStudy {
  id: string;
  modality: 'Chest X-Ray (AP)' | 'Brain MRI (Axial T2)' | 'Knee Radiograph (Lateral/AP)';
  studyDate: string;
  facility: string;
  radiologist: string;
  accessionNumber: string;
  findings: string;
  impression: string;
  canvasPreset: 'chest-xray' | 'brain-mri' | 'knee-xray';
  recommendedFollowup: string;
}

export interface ConnectedProvider {
  id: string;
  name: string;
  networkType: 'Epic Systems' | 'Cerner / Oracle Health' | 'AthenaHealth' | 'Veradigm' | 'Quest Diagnostics';
  status: 'Connected' | 'Syncing' | 'Attention' | 'Disconnected';
  lastSynced: string;
  recordsCount: number;
  fhirEndpoint: string;
  authMethod: 'SMART-on-FHIR OAuth 2.0';
  latencyMs: number;
}

export interface SecurityAuditEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  facility: string;
  action: 'READ_RESOURCE' | 'WRITE_ENCOUNTER' | 'BREAK_GLASS_ACCESS' | 'RECONCILE_MED' | 'EXPORT_FHIR';
  resourceAccessed: string;
  purposeOfUse: 'Treatment' | 'Emergency' | 'Operations' | 'Patient Access';
  ipAddress: string;
  status: 'Authorized' | 'Break-Glass Flagged' | 'Denied';
}

export interface PrivacyConsentConfig {
  excludeBehavioralHealth: boolean;
  excludeSubstanceUse: boolean;
  excludeGenetics: boolean;
  emergencyBreakGlassAllowed: boolean;
  activeGrants: Array<{
    id: string;
    doctorName: string;
    facility: string;
    role: string;
    scope: string[];
    grantedAt: string;
    expiresAt: string;
    status: 'Active' | 'Expired' | 'Revoked';
  }>;
}

export interface UploadedDocument {
  id: string;
  fileName: string;
  fileType: 'PDF' | 'JPEG' | 'PNG' | 'DICOM';
  uploadDate: string;
  facilitySource: string;
  status: 'Extracted' | 'Processing' | 'Failed';
  confidenceScore: number;
  documentCategory: 'Discharge Summary' | 'Lab Panel' | 'Radiology Report' | 'Prescription Sheet';
  rawOcrSnippet: string;
  extractedEntities: {
    medications: Array<{ name: string; dose: string; frequency: string }>;
    vitals: Array<{ label: string; value: string }>;
    conditions: Array<{ name: string; code: string }>;
    allergies: Array<{ name: string; severity: string }>;
  };
  sourceCitations: Array<{
    page: number;
    boundingSnippet: string;
    targetField: string;
    verified: boolean;
  }>;
}

export type ReportCategory =
  | 'All Reports'
  | 'Laboratory Tests'
  | 'Prescriptions'
  | 'Doctor Visit Summaries'
  | 'Discharge Summaries'
  | 'Scans and Imaging'
  | 'Referrals'
  | 'Vaccination Records'
  | 'Other Documents';

export interface MedicalReport {
  id: string;
  title: string;
  providerName: string;
  reportDate: string;
  category: ReportCategory;
  uploadDate: string;
  verificationStatus: 'Patient Verified' | 'Clinician Verified' | 'Pending Review' | 'Unverified';
  processingStatus: 'AI Extracted' | 'Processing OCR' | 'Manual Entry';
  fileFormat: 'PDF' | 'JPG' | 'PNG' | 'Scan';
  fileSize: string;
  summary: string;
  aiConfidence: number;
  extractedFields: {
    dates: string[];
    medicationsOrTests: string[];
    results: Array<{ label: string; value: string; unit?: string; status?: string }>;
    physicianName?: string;
    keyFindings: string[];
  };
  originalPreviewText: string;
  isSensitive?: boolean;
}

export interface HealthcareDoctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  facility: string;
  address: string;
  distance: string;
  rating: number;
  reviewsCount: number;
  nextAvailable: string;
  phone: string;
  acceptsInsurance: boolean;
  insuranceList: string[];
  bio: string;
  availableSlots: string[];
}

export interface BookedAppointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  facility: string;
  address: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Upcoming' | 'Completed' | 'Cancelled';
  visitReason: string;
  isVirtual?: boolean;
  notes?: string;
}

export interface AiHealthBrief {
  generatedAt: string;
  overallSummary: string;
  recordedConditions: Array<{ name: string; status: string; source: string; date: string }>;
  recordedAllergies: Array<{ substance: string; severity: string; reaction: string; source: string }>;
  activeMedications: Array<{ name: string; dosage: string; frequency: string; prescribedBy: string; facility: string }>;
  discontinuedMedications: Array<{ name: string; reason: string; date: string }>;
  recentVisits: Array<{ date: string; facility: string; reason: string; physician: string }>;
  importantLabs: Array<{ test: string; value: string; status: string; date: string; facility: string }>;
  missingOrConflictingInfo: Array<{ title: string; description: string; recommendation: string; severity: 'high' | 'medium' | 'low' }>;
  upcomingAppointments: Array<{ doctor: string; specialty: string; date: string; time: string; facility: string }>;
}

export interface HealthcareFacility {
  id: string;
  name: string;
  category: string;
  address: string;
  distance: string;
  distanceKm?: string;
  operatingHours?: string;
  rating: number;
  reviewsCount: number;
  phone: string;
  emergencyPhone?: string;
  isOpen24Hours: boolean;
  acceptsWalkIns: boolean;
  hasEmergencyDept: boolean;
  specialties: string[];
  services: string[];
  doctors: Array<{
    name: string;
    title?: string;
    specialty: string;
    nextAvailable: string;
    rating: number;
  }>;
}

export interface AppointmentRecord {
  id: string;
  facilityId?: string;
  facilityName?: string;
  facility?: string;
  doctorName?: string;
  providerName?: string;
  specialty?: string;
  dateTime?: string;
  date?: string;
  time?: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  reasonForVisit?: string;
  reason?: string;
  consultationType?: any;
  preAuthorizedRecords?: string[];
  sharedRecords?: string[];
  confirmationCode?: string;
  bookingReference?: string;
  preparationNotes?: string[];
  address?: string;
  isDemo?: boolean;
  fhirAppointmentId?: string;
  notes?: string;
}

