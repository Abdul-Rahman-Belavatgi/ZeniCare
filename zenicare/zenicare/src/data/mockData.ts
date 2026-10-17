import {
  PatientDemographics,
  VitalSign,
  ChronicCondition,
  AllergyAlert,
  ClinicalEncounter,
  DiagnosticLabReport,
  RadiologyStudy,
  ConnectedProvider,
  SecurityAuditEntry,
  PrivacyConsentConfig,
  HealthcareFacility,
} from '../types/index.ts';
import { Medication } from '../utils/healthLogic.ts';

export const INITIAL_PATIENT: PatientDemographics = {
  id: 'NX-88204',
  mrn: 'MRN-9024-FHIR',
  fullName: 'Aarav Sharma',
  preferredName: 'Aarav',
  birthDate: '1988-05-12',
  age: 42,
  gender: 'Male',
  bloodGroup: 'B+',
  height: '178 cm (5 ft 10 in)',
  weight: '74 kg (163.1 lbs)',
  bmi: '23.4 kg/m² (Normal)',
  phone: '+91 98200 12345',
  email: 'aarav.sharma@zenicare.in',
  address: '123, Marine Drive, Mumbai, Maharashtra 400020',
  emergencyContact: {
    name: 'Priya Sharma',
    relationship: 'Spouse',
    phone: '+91 98200 54321',
  },
  primaryCarePhysician: {
    name: 'Dr. Meera Patel, MD',
    facility: 'North Valley Family Clinic',
    phone: '+1 (555) 890-1122',
  },
};

export const INITIAL_VITALS: VitalSign[] = [
  {
    id: 'vit-1',
    type: 'Blood Pressure',
    value: '122/78',
    unit: 'mmHg',
    status: 'normal',
    recordedAt: '2026-10-12 09:15',
    facility: 'North Valley Family Clinic',
    recordedBy: 'Nurse R. Miller, BSN',
  },
  {
    id: 'vit-2',
    type: 'Heart Rate',
    value: '72',
    unit: 'bpm',
    status: 'normal',
    recordedAt: '2026-10-12 09:15',
    facility: 'North Valley Family Clinic',
    recordedBy: 'Nurse R. Miller, BSN',
  },
  {
    id: 'vit-3',
    type: 'SpO2',
    value: '98',
    unit: '%',
    status: 'normal',
    recordedAt: '2026-09-28 14:30',
    facility: 'St. Jude Memorial Hospital',
    recordedBy: 'Cardiology Triage',
  },
  {
    id: 'vit-4',
    type: 'Blood Glucose',
    value: '98',
    unit: 'mg/dL',
    status: 'normal',
    recordedAt: '2026-10-04 07:45',
    facility: 'Quest Diagnostics',
    recordedBy: 'Automated Analyzer',
  },
  {
    id: 'vit-5',
    type: 'Body Temperature',
    value: '98.4',
    unit: '°F (36.9°C)',
    status: 'normal',
    recordedAt: '2026-10-12 09:15',
    facility: 'North Valley Family Clinic',
    recordedBy: 'Nurse R. Miller, BSN',
  },
  {
    id: 'vit-6',
    type: 'Respiratory Rate',
    value: '16',
    unit: 'breaths/min',
    status: 'normal',
    recordedAt: '2026-10-12 09:15',
    facility: 'North Valley Family Clinic',
    recordedBy: 'Nurse R. Miller, BSN',
  },
];

export const INITIAL_CONDITIONS: ChronicCondition[] = [
  {
    id: 'cond-1',
    name: 'Atrial Fibrillation, Unspecified',
    icd10: 'I48.91',
    clinicalStatus: 'Active',
    verificationStatus: 'Confirmed',
    onsetDate: '2025-04-14',
    diagnosingFacility: 'St. Jude Memorial Hospital (Cardiology)',
    diagnosingPhysician: 'Dr. Robert Chen, MD, FACC',
    notes: 'Paroxysmal episodes managed with anticoagulation and rate control. Rate stabilized.',
  },
  {
    id: 'cond-2',
    name: 'Essential (Primary) Hypertension',
    icd10: 'I10',
    clinicalStatus: 'Controlled',
    verificationStatus: 'Confirmed',
    onsetDate: '2022-09-10',
    diagnosingFacility: 'North Valley Family Clinic',
    diagnosingPhysician: 'Dr. Meera Patel, MD',
    notes: 'Well-controlled with Lisinopril 10mg daily and lifestyle modifications.',
  },
  {
    id: 'cond-3',
    name: 'Type 2 Diabetes Mellitus without Complications',
    icd10: 'E11.9',
    clinicalStatus: 'Controlled',
    verificationStatus: 'Confirmed',
    onsetDate: '2023-01-19',
    diagnosingFacility: 'North Valley Family Clinic',
    diagnosingPhysician: 'Dr. Meera Patel, MD',
    notes: 'HbA1c improved from 7.6% to 5.8% over 24 months. Metformin maintained.',
  },
  {
    id: 'cond-4',
    name: 'Gastro-esophageal Reflux Disease without Esophagitis',
    icd10: 'K21.9',
    clinicalStatus: 'Controlled',
    verificationStatus: 'Confirmed',
    onsetDate: '2024-06-02',
    diagnosingFacility: 'Metro Health System',
    diagnosingPhysician: 'Dr. Elena Vance, MD',
    notes: 'Intermittent nocturnal symptoms; dietary triggers identified.',
  },
];

export const INITIAL_ALLERGIES: AllergyAlert[] = [
  {
    id: 'all-1',
    substance: 'Penicillin G & V (Beta-Lactam Antibiotics)',
    category: 'medication',
    severity: 'Critical / High',
    criticality: 'high',
    reaction: 'Anaphylaxis, Laryngeal Stridor & Angioedema',
    clinicalManifestation: 'Severe Type I IgE-mediated anaphylactoid reaction with acute bronchospasm during prior IV ampicillin infusion (2019). STRICT CONTRAINDICATION.',
    verifiedBy: 'Dr. Elena Vance, MD (Metro Health Trauma)',
    verifiedDate: '2019-08-14',
    fhirCode: '764146007',
  },
  {
    id: 'all-2',
    substance: 'Peanut Proteins (Arachis hypogaea)',
    category: 'food',
    severity: 'Critical / High',
    criticality: 'high',
    reaction: 'Facial Urticaria & Generalized Hives',
    clinicalManifestation: 'Rapid-onset cutaneous flushing, facial urticaria, and periorbital edema within 15 minutes of ingestion.',
    verifiedBy: 'Dr. Meera Patel, MD (North Valley)',
    verifiedDate: '2021-03-20',
    fhirCode: '91935009',
  },
  {
    id: 'all-3',
    substance: 'House Dust Mite / Grass Pollen',
    category: 'environment',
    severity: 'Moderate',
    criticality: 'moderate',
    reaction: 'Allergic Rhinitis & Conjunctivitis',
    clinicalManifestation: 'Seasonal exacerbation, nasal congestion, sneezing, ocular pruritus.',
    verifiedBy: 'North Valley Allergy Screening',
    verifiedDate: '2023-05-11',
    fhirCode: '256277009',
  },
];

export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: 'med-1',
    name: 'Warfarin Sodium',
    dosage: '5 mg oral tablet',
    frequency: 'Once daily at 20:00 (Target INR 2.0 - 3.0)',
    facility: 'St. Jude Memorial Hospital (Cardiology)',
    prescribedBy: 'Dr. Robert Chen, MD',
    startDate: '2026-03-12',
    status: 'active',
    category: 'Anticoagulant',
  },
  {
    id: 'med-2',
    name: 'Aspirin (Enteric Coated)',
    dosage: '81 mg oral tablet',
    frequency: 'Once daily in the morning with breakfast',
    facility: 'North Valley Family Clinic (Primary Care)',
    prescribedBy: 'Dr. Meera Patel, MD',
    startDate: '2026-05-18',
    status: 'active',
    category: 'Antiplatelet',
  },
  {
    id: 'med-3',
    name: 'Metformin HCl ER',
    dosage: '500 mg oral tablet',
    frequency: 'Twice daily with morning and evening meals',
    facility: 'North Valley Family Clinic',
    prescribedBy: 'Dr. Meera Patel, MD',
    startDate: '2023-02-10',
    status: 'active',
    category: 'Antidiabetic',
  },
  {
    id: 'med-4',
    name: 'Lisinopril',
    dosage: '10 mg oral tablet',
    frequency: 'Once daily in morning',
    facility: 'North Valley Family Clinic',
    prescribedBy: 'Dr. Meera Patel, MD',
    startDate: '2022-09-15',
    status: 'active',
    category: 'Antihypertensive',
  },
  {
    id: 'med-5',
    name: 'Atorvastatin Calcium',
    dosage: '20 mg oral tablet',
    frequency: 'Once daily at bedtime',
    facility: 'St. Jude Memorial Hospital',
    prescribedBy: 'Dr. Robert Chen, MD',
    startDate: '2025-05-01',
    status: 'active',
    category: 'Lipid Lowering',
  },
  {
    id: 'med-6',
    name: 'Amoxicillin Trihydrate',
    dosage: '500 mg capsule',
    frequency: 'Three times daily for 10 days',
    facility: 'Metro Health Urgent Care',
    prescribedBy: 'Dr. S. Reynolds, MD',
    startDate: '2024-01-10',
    status: 'discontinued',
    category: 'Antibiotic (Discontinued due to Penicillin class allergy check)',
  },
];

export const INITIAL_ENCOUNTERS: ClinicalEncounter[] = [
  {
    id: 'enc-1',
    facility: 'North Valley Family Clinic',
    facilityType: 'Primary Care',
    encounterClass: 'Outpatient',
    department: 'Family Medicine & Preventive Health',
    date: '2026-10-12',
    reasonForVisit: 'Annual Comprehensive Longitudinal Review & Diabetes Monitoring',
    attendingPhysician: 'Dr. Meera Patel, MD',
    specialty: 'Family Medicine',
    soapNotes: {
      subjective: 'Patient presents for annual wellness follow-up. Reports good energy levels, adherent to dietary changes, denies chest pain, palpitations, or lightheadedness. Mentions slight bruising on forearms after minor bumps.',
      objective: 'BP: 122/78 mmHg, HR: 72 bpm regular, RR: 16, SpO2: 98% on room air. Cardiopulmonary exam normal, S1/S2 distinct without murmur. Abdomen soft, non-tender. Trace ecchymosis right forearm.',
      assessment: '1. Type 2 Diabetes Mellitus - excellently controlled, latest HbA1c 5.8%. 2. Essential Hypertension - well controlled on Lisinopril 10mg. 3. Atrial Fibrillation - clinically stable, but notable concurrent Warfarin + Aspirin antiplatelet alert flagged in MediBridge.',
      plan: 'Recommend immediate clinical reconciliation of concurrent Warfarin (St. Jude) and Aspirin (North Valley). Contact Cardiology Dr. Robert Chen to stop Aspirin given low ASCVD secondary indication versus bleeding risk. Continue Metformin 500mg BID and Lisinopril 10mg.',
    },
    fhirEncounterId: 'enc-fhir-nvfc-20261012',
    status: 'Finished',
    isSensitiveCategory: 'general',
  },
  {
    id: 'enc-2',
    facility: 'St. Jude Memorial Hospital',
    facilityType: 'Specialty Clinic',
    encounterClass: 'Outpatient',
    department: 'Division of Cardiology & Arrhythmia',
    date: '2026-09-28',
    reasonForVisit: 'Atrial Fibrillation Management & Anticoagulation Optimization',
    attendingPhysician: 'Dr. Robert Chen, MD, FACC',
    specialty: 'Cardiovascular Disease / Electrophysiology',
    soapNotes: {
      subjective: 'Alex is here for routine quarterly EP evaluation. No recurrence of palpitation runs or syncope since rate stabilization. Recent INR checked at St. Jude lab was 2.4 (therapeutic target 2.0-3.0).',
      objective: '12-lead ECG confirms normal sinus rhythm at 68 bpm with normal PR and QTc intervals. Holter 14-day monitor demonstrated 0.4% AF burden. LVEF preserved at 58% on recent echo.',
      assessment: 'Paroxysmal Atrial Fibrillation (CHA2DS2-VASc score = 2). Maintained on Warfarin 5mg daily. Therapeutic anticoagulation confirmed.',
      plan: 'Continue Warfarin 5mg daily. Re-check INR in 4 weeks. Instruct patient to report any epistaxis, hematuria, or unusual bruising.',
    },
    fhirEncounterId: 'enc-fhir-stjude-20260928',
    status: 'Finished',
    isSensitiveCategory: 'general',
  },
  {
    id: 'enc-3',
    facility: 'Apex Diagnostic Imaging',
    facilityType: 'Diagnostic Center',
    encounterClass: 'Diagnostic',
    department: 'Advanced Radiographic Imaging',
    date: '2026-08-15',
    reasonForVisit: 'Post-syncopal Evaluation Chest Radiograph & Right Knee Assessment',
    attendingPhysician: 'Dr. Marcus Sterling, MD',
    specialty: 'Diagnostic Radiology',
    soapNotes: {
      subjective: 'Diagnostic referral following prior ER presentation to assess cardiothoracic ratio, pulmonary vascularity, and minor knee pain.',
      objective: 'Chest radiograph AP erect view performed. Right knee 2-view radiograph obtained.',
      assessment: '1. Chest: Cardiothoracic ratio 0.48 (normal). Lung fields clear without consolidation, pneumothorax, or vascular congestion. 2. Knee: Preserved joint spaces without acute fracture.',
      plan: 'Electronically transmitted PACS DICOM study and radiologist impressions to federated MediBridge network.',
    },
    fhirEncounterId: 'enc-fhir-apex-20260815',
    status: 'Finished',
    isSensitiveCategory: 'general',
  },
  {
    id: 'enc-4',
    facility: 'Metro Health System',
    facilityType: 'Emergency Dept',
    encounterClass: 'Emergency',
    department: 'Department of Emergency Medicine & Trauma',
    date: '2026-07-04',
    reasonForVisit: 'Acute Presyncopal Episode & Lightheadedness in Warm Weather',
    attendingPhysician: 'Dr. Elena Vance, MD',
    specialty: 'Emergency Medicine',
    soapNotes: {
      subjective: 'Patient arrived via private vehicle with sudden lightheadedness during outdoor activity in 92°F heat. Denies head strike, chest pain, or dyspnea.',
      objective: 'Initial BP: 104/66, HR: 88, SpO2: 99%, Afebrile. Point-of-care fingerstick glucose 102 mg/dL. Orthostatic vitals negative after 1L IV Normal Saline.',
      assessment: 'Vasovagal / dehydration-induced presyncope. Resolution of symptoms following volume repletion. Allergy to Penicillin verified and highlighted on wristband.',
      plan: 'Discharged in stable condition. Hydration counseling provided. Follow up with Primary Care (North Valley) and Cardiologist (St. Jude).',
    },
    fhirEncounterId: 'enc-fhir-metro-20260704',
    status: 'Finished',
    isSensitiveCategory: 'general',
  },
  {
    id: 'enc-5',
    facility: 'Quest Diagnostics',
    facilityType: 'Diagnostic Center',
    encounterClass: 'Diagnostic',
    department: 'Automated Clinical Laboratory Services',
    date: '2026-10-04',
    reasonForVisit: 'Bi-annual Comprehensive Metabolic Panel, Lipid Panel & HbA1c',
    attendingPhysician: 'Dr. Alan K. Ross, Pathologist',
    specialty: 'Clinical Pathology',
    soapNotes: {
      subjective: 'Fasting specimen collection (12-hour fast). Phlebotomy uneventful.',
      objective: 'HbA1c: 5.8%, Fasting Glucose: 98 mg/dL, Total Cholesterol: 178 mg/dL, LDL: 94 mg/dL, HDL: 54 mg/dL, Triglycerides: 130 mg/dL, Creatinine: 0.92 mg/dL, eGFR: >90 mL/min.',
      assessment: 'Glycemic parameters indicate sustained remission of prediabetes/diabetes range into near-normal metabolic state. Lipid targets met.',
      plan: 'Automated release to MediBridge FHIR gateway and ordering physician Dr. Meera Patel.',
    },
    fhirEncounterId: 'enc-fhir-quest-20261004',
    status: 'Finished',
    isSensitiveCategory: 'general',
  },
];

export const LONGITUDINAL_LABS: DiagnosticLabReport[] = [
  {
    id: 'lab-rep-1',
    testName: 'Hemoglobin A1c (HbA1c) Longitudinal Series',
    category: 'Metabolic',
    date: '2026-10-04',
    facility: 'Quest Diagnostics',
    orderingPhysician: 'Dr. Meera Patel, MD',
    status: 'Final',
    clinicalImpression: 'Optimal glycemic control with sustained decline from baseline 7.6% (2024) to current 5.8%.',
    fhirObservationIds: ['obs-hba1c-20261004'],
    items: [
      { name: 'Hemoglobin A1c', value: '5.8', numericValue: 5.8, unit: '%', referenceRange: '< 5.7 (Normal), 5.7-6.4 (Prediabetes), >= 6.5 (Diabetes)', status: 'normal' },
      { name: 'Estimated Average Glucose (eAG)', value: '120', numericValue: 120, unit: 'mg/dL', referenceRange: '70 - 126 mg/dL', status: 'normal' },
    ],
  },
  {
    id: 'lab-rep-2',
    testName: 'Comprehensive Lipid Profile',
    category: 'Lipid',
    date: '2026-10-04',
    facility: 'Quest Diagnostics',
    orderingPhysician: 'Dr. Meera Patel, MD',
    status: 'Final',
    clinicalImpression: 'Atherogenic risk profile significantly reduced. LDL cholesterol is below the 100 mg/dL target.',
    fhirObservationIds: ['obs-lipid-20261004'],
    items: [
      { name: 'Total Cholesterol', value: '178', numericValue: 178, unit: 'mg/dL', referenceRange: '< 200 mg/dL', status: 'normal' },
      { name: 'LDL-C (Calculated)', value: '94', numericValue: 94, unit: 'mg/dL', referenceRange: '< 100 mg/dL (Desirable)', status: 'normal' },
      { name: 'HDL-C (Cardioprotective)', value: '54', numericValue: 54, unit: 'mg/dL', referenceRange: '> 40 mg/dL', status: 'normal' },
      { name: 'Triglycerides', value: '130', numericValue: 130, unit: 'mg/dL', referenceRange: '< 150 mg/dL', status: 'normal' },
    ],
  },
  {
    id: 'lab-rep-3',
    testName: 'Coagulation & Anticoagulation Monitoring (INR / PT)',
    category: 'Hematology',
    date: '2026-09-28',
    facility: 'St. Jude Memorial Hospital Lab',
    orderingPhysician: 'Dr. Robert Chen, MD',
    status: 'Final',
    clinicalImpression: 'INR within target therapeutic window (2.0 - 3.0) for stroke prevention in non-valvular Atrial Fibrillation.',
    fhirObservationIds: ['obs-inr-20260928'],
    items: [
      { name: 'Prothrombin Time (PT)', value: '26.4', numericValue: 26.4, unit: 'sec', referenceRange: '11.0 - 13.5 sec', status: 'high' },
      { name: 'International Normalized Ratio (INR)', value: '2.4', numericValue: 2.4, unit: 'ratio', referenceRange: '2.0 - 3.0 (Target for AFib)', status: 'normal' },
    ],
  },
  {
    id: 'lab-rep-4',
    testName: 'Comprehensive Metabolic Panel (CMP-14)',
    category: 'Metabolic',
    date: '2026-07-04',
    facility: 'Metro Health Emergency Lab',
    orderingPhysician: 'Dr. Elena Vance, MD',
    status: 'Final',
    clinicalImpression: 'Normal renal function and electrolyte balance. No evidence of acute renal compromise or metabolic acidosis.',
    fhirObservationIds: ['obs-cmp-20260704'],
    items: [
      { name: 'Sodium', value: '139', numericValue: 139, unit: 'mmol/L', referenceRange: '136 - 145 mmol/L', status: 'normal' },
      { name: 'Potassium', value: '4.3', numericValue: 4.3, unit: 'mmol/L', referenceRange: '3.5 - 5.1 mmol/L', status: 'normal' },
      { name: 'Chloride', value: '102', numericValue: 102, unit: 'mmol/L', referenceRange: '98 - 107 mmol/L', status: 'normal' },
      { name: 'Serum Creatinine', value: '0.94', numericValue: 0.94, unit: 'mg/dL', referenceRange: '0.70 - 1.30 mg/dL', status: 'normal' },
      { name: 'Estimated GFR', value: '> 90', unit: 'mL/min/1.73m²', referenceRange: '> 60 mL/min/1.73m²', status: 'normal' },
      { name: 'Fasting Blood Glucose', value: '102', numericValue: 102, unit: 'mg/dL', referenceRange: '70 - 99 mg/dL', status: 'high' },
    ],
  },
];

export const BIOMARKER_TRENDS = {
  hba1c: [
    { date: 'Oct 2024', value: 7.6, facility: 'Metro Health Lab', threshold: 'Diabetic' },
    { date: 'Feb 2025', value: 7.2, facility: 'Quest Diagnostics', threshold: 'Diabetic' },
    { date: 'Jun 2025', value: 6.8, facility: 'St. Jude Lab', threshold: 'Elevated' },
    { date: 'Oct 2025', value: 6.4, facility: 'North Valley Lab', threshold: 'Prediabetes' },
    { date: 'Mar 2026', value: 6.1, facility: 'Quest Diagnostics', threshold: 'Prediabetes' },
    { date: 'Oct 2026', value: 5.8, facility: 'Quest Diagnostics', threshold: 'Optimal Control' },
  ],
  glucose: [
    { date: 'Oct 2024', value: 142, facility: 'Metro Health Lab' },
    { date: 'Feb 2025', value: 128, facility: 'Quest Diagnostics' },
    { date: 'Jun 2025', value: 116, facility: 'St. Jude Lab' },
    { date: 'Oct 2025', value: 108, facility: 'North Valley Lab' },
    { date: 'Mar 2026', value: 102, facility: 'Quest Diagnostics' },
    { date: 'Oct 2026', value: 98, facility: 'Quest Diagnostics' },
  ],
  bloodPressure: [
    { date: 'Oct 2024', systolic: 148, diastolic: 92, facility: 'Metro Health' },
    { date: 'Feb 2025', systolic: 138, diastolic: 86, facility: 'North Valley' },
    { date: 'Jun 2025', systolic: 132, diastolic: 84, facility: 'St. Jude' },
    { date: 'Oct 2025', systolic: 126, diastolic: 80, facility: 'North Valley' },
    { date: 'Mar 2026', systolic: 124, diastolic: 79, facility: 'North Valley' },
    { date: 'Oct 2026', systolic: 122, diastolic: 78, facility: 'North Valley' },
  ],
  lipids: [
    { date: 'Oct 2024', ldl: 142, total: 220, hdl: 46, trig: 180, facility: 'Metro Health' },
    { date: 'Jun 2025', ldl: 122, total: 202, hdl: 49, trig: 155, facility: 'St. Jude' },
    { date: 'Oct 2025', ldl: 108, total: 190, hdl: 52, trig: 142, facility: 'Quest Diagnostics' },
    { date: 'Oct 2026', ldl: 94, total: 178, hdl: 54, trig: 130, facility: 'Quest Diagnostics' },
  ],
};

export const RADIOLOGY_STUDIES: RadiologyStudy[] = [
  {
    id: 'rad-1',
    modality: 'Chest X-Ray (AP)',
    studyDate: '2026-08-15 11:20',
    facility: 'Apex Diagnostic Imaging / Metro Health',
    radiologist: 'Dr. Marcus Sterling, MD (Board-Certified Radiologist)',
    accessionNumber: 'ACC-RAD-2026-0912X',
    findings: 'Single frontal portable AP view of the chest is submitted. Cardiac silhouette is normal in size with cardiothoracic ratio of 0.48. Mediastinum and hila are within normal limits. Trachea is midline. Bony thorax intact without acute rib fracture or cortical disruption. Lungs are well-expanded and clear bilaterally without focal consolidation, pneumothorax, or pleural effusion. Diaphragmatic contours are smooth and costophrenic sulci are sharp.',
    impression: '1. No acute cardiopulmonary disease.\n2. Normal cardiothoracic size and clear pulmonary parenchyma.\n3. Comparison made with prior examination dated 14 months prior; unchanged baseline appearance.',
    canvasPreset: 'chest-xray',
    recommendedFollowup: 'Routine clinical correlation as indicated by attending clinician.',
  },
  {
    id: 'rad-2',
    modality: 'Brain MRI (Axial T2)',
    studyDate: '2026-05-10 15:45',
    facility: 'St. Jude Memorial Hospital (Neurology/Imaging)',
    radiologist: 'Dr. Clara Thorne, MD (Neuroradiologist)',
    accessionNumber: 'ACC-MRI-2026-4481B',
    findings: 'Multiplanar, multisequence magnetic resonance imaging of the brain was performed without intravenous gadolinium contrast. High-resolution axial T2-weighted and FLAIR images demonstrate normal ventricular configuration. No midline shift, mass effect, or extra-axial fluid collections. Minimal punctate nonspecific deep white matter hyperintensities in the frontal lobes, likely microvascular in etiology and appropriate for age. Major intracranial flow voids are preserved.',
    impression: '1. No acute intracranial hemorrhage or territorial acute infarction.\n2. Age-appropriate minimal microvascular white matter changes without neurodegenerative pattern.',
    canvasPreset: 'brain-mri',
    recommendedFollowup: 'No emergency neurosurgical intervention required.',
  },
  {
    id: 'rad-3',
    modality: 'Knee Radiograph (Lateral/AP)',
    studyDate: '2026-08-15 11:35',
    facility: 'Apex Diagnostic Imaging',
    radiologist: 'Dr. Marcus Sterling, MD',
    accessionNumber: 'ACC-RAD-2026-0913K',
    findings: 'Two views of the right knee demonstrate preserved medial and lateral tibiofemoral joint compartments. Patellofemoral articulation is aligned. No evidence of joint effusion or lipohemarthrosis. No radiopaque loose bodies. Periarticular soft tissues are unremarkable.',
    impression: 'Normal 2-view right knee examination. No acute bony fracture or advanced osteoarthritic degradation.',
    canvasPreset: 'knee-xray',
    recommendedFollowup: 'Symptomatic management as needed.',
  },
];

export const CONNECTED_PROVIDERS: ConnectedProvider[] = [
  {
    id: 'prov-1',
    name: 'St. Jude Memorial Hospital',
    networkType: 'Epic Systems',
    status: 'Connected',
    lastSynced: '2026-10-15 22:40',
    recordsCount: 42,
    fhirEndpoint: 'https://fhir.stjude-health.org/r4/open',
    authMethod: 'SMART-on-FHIR OAuth 2.0',
    latencyMs: 142,
  },
  {
    id: 'prov-2',
    name: 'Metro Health System (Trauma & ER)',
    networkType: 'Cerner / Oracle Health',
    status: 'Connected',
    lastSynced: '2026-10-16 01:15',
    recordsCount: 38,
    fhirEndpoint: 'https://fhir-ehr.metrohealth.org/api/FHIR/R4',
    authMethod: 'SMART-on-FHIR OAuth 2.0',
    latencyMs: 185,
  },
  {
    id: 'prov-3',
    name: 'North Valley Family Clinic',
    networkType: 'AthenaHealth',
    status: 'Connected',
    lastSynced: '2026-10-16 01:45',
    recordsCount: 65,
    fhirEndpoint: 'https://api.platform.athenahealth.com/fhir/r4',
    authMethod: 'SMART-on-FHIR OAuth 2.0',
    latencyMs: 110,
  },
  {
    id: 'prov-4',
    name: 'Apex Diagnostic Imaging',
    networkType: 'Veradigm',
    status: 'Connected',
    lastSynced: '2026-10-14 18:20',
    recordsCount: 14,
    fhirEndpoint: 'https://imaging-fhir.apexdiagnostics.com/r4',
    authMethod: 'SMART-on-FHIR OAuth 2.0',
    latencyMs: 230,
  },
  {
    id: 'prov-5',
    name: 'Quest Diagnostics (Reference Labs)',
    networkType: 'Quest Diagnostics',
    status: 'Connected',
    lastSynced: '2026-10-16 01:50',
    recordsCount: 89,
    fhirEndpoint: 'https://fhir.questdiagnostics.com/v1/r4',
    authMethod: 'SMART-on-FHIR OAuth 2.0',
    latencyMs: 95,
  },
];

export const INITIAL_AUDIT_TRAIL: SecurityAuditEntry[] = [
  {
    id: 'aud-1',
    timestamp: '2026-10-16 01:52:10',
    actorName: 'Dr. Elena Vance, MD',
    actorRole: 'Chief of Emergency Medicine',
    facility: 'Metro Health System',
    action: 'READ_RESOURCE',
    resourceAccessed: 'Patient/NX-88204 (Unified Demographic & Allergy Summary)',
    purposeOfUse: 'Treatment',
    ipAddress: '198.51.100.44',
    status: 'Authorized',
  },
  {
    id: 'aud-2',
    timestamp: '2026-10-15 23:18:40',
    actorName: 'Dr. Robert Chen, MD',
    actorRole: 'Cardiologist',
    facility: 'St. Jude Memorial Hospital',
    action: 'READ_RESOURCE',
    resourceAccessed: 'Observation/obs-inr-20260928, MedicationRequest/*',
    purposeOfUse: 'Treatment',
    ipAddress: '203.0.113.89',
    status: 'Authorized',
  },
  {
    id: 'aud-3',
    timestamp: '2026-10-14 14:10:05',
    actorName: 'Dr. Meera Patel, MD',
    actorRole: 'Primary Care Physician',
    facility: 'North Valley Family Clinic',
    action: 'WRITE_ENCOUNTER',
    resourceAccessed: 'Encounter/enc-fhir-nvfc-20261012 (SOAP Note Ingestion)',
    purposeOfUse: 'Treatment',
    ipAddress: '192.0.2.77',
    status: 'Authorized',
  },
  {
    id: 'aud-4',
    timestamp: '2026-10-12 09:30:22',
    actorName: 'Alex Morgan (Patient)',
    actorRole: 'Patient / Health Sovereign',
    facility: 'ZeniCare Patient Portal',
    action: 'EXPORT_FHIR',
    resourceAccessed: 'Bundle/FHIR-R4-Longitudinal-Complete',
    purposeOfUse: 'Patient Access',
    ipAddress: '76.104.18.23',
    status: 'Authorized',
  },
];

export const INITIAL_CONSENT_CONFIG: PrivacyConsentConfig = {
  excludeBehavioralHealth: true,
  excludeSubstanceUse: true,
  excludeGenetics: false,
  emergencyBreakGlassAllowed: true,
  activeGrants: [
    {
      id: 'grant-1',
      doctorName: 'Dr. Elena Vance, MD',
      facility: 'Metro Health System',
      role: 'Emergency Physician / Chief of ER',
      scope: ['Condition', 'MedicationRequest', 'Observation', 'AllergyIntolerance'],
      grantedAt: '2026-07-04',
      expiresAt: '2027-07-04T23:59:59Z',
      status: 'Active',
    },
    {
      id: 'grant-2',
      doctorName: 'Dr. Meera Patel, MD',
      facility: 'North Valley Family Clinic',
      role: 'Attending Primary Care Physician',
      scope: ['* (All General Longitudinal Records)'],
      grantedAt: '2022-09-10',
      expiresAt: '2027-09-10T23:59:59Z',
      status: 'Active',
    },
    {
      id: 'grant-3',
      doctorName: 'Dr. Robert Chen, MD',
      facility: 'St. Jude Memorial Hospital',
      role: 'Cardiology Specialist',
      scope: ['Condition', 'MedicationRequest', 'DiagnosticReport', 'Observation'],
      grantedAt: '2025-04-14',
      expiresAt: '2027-04-14T23:59:59Z',
      status: 'Active',
    },
    {
      id: 'grant-4',
      doctorName: 'Dr. Samuel Green, PsyD',
      facility: 'Soundview Behavioral Health',
      role: 'Psychologist (Expired Consultation)',
      scope: ['Encounter', 'ClinicalImpression'],
      grantedAt: '2024-01-01',
      expiresAt: '2024-12-31T23:59:59Z',
      status: 'Expired',
    },
  ],
};

export const CLINICIAN_PERSONA = {
  name: 'Dr. Elena Vance, MD',
  title: 'Chief of Emergency Medicine',
  facility: 'Metro Health System & Regional Trauma Center',
  npi: '1982736450',
  specialty: 'Emergency Medicine / Disaster Triage',
  licenseState: 'WA - #MD60918842',
};

export const SAMPLE_FHIR_BUNDLE = {
  resourceType: 'Bundle',
  id: 'zenicare-fhir-r4-nx88204',
  type: 'collection',
  timestamp: '2026-10-16T01:58:00Z',
  meta: {
    lastUpdated: '2026-10-16T01:58:00Z',
    profile: ['http://hl7.org/fhir/StructureDefinition/Bundle'],
  },
  entry: [
    {
      fullUrl: 'urn:uuid:patient-alex-morgan',
      resource: {
        resourceType: 'Patient',
        id: 'alex-morgan-fhir',
        identifier: [
          { system: 'https://zenicare.health/mrn', value: 'NX-88204' },
          { system: 'https://metrohealth.org/mrn', value: 'MH-440192' },
          { system: 'https://stjude-health.org/mrn', value: 'SJ-889104' },
        ],
        active: true,
        name: [
          {
            use: 'official',
            family: 'Morgan',
            given: ['Alex'],
          },
        ],
        gender: 'other',
        birthDate: '1984-06-22',
        telecom: [
          { system: 'phone', value: '+1-555-789-2044', use: 'mobile' },
          { system: 'email', value: 'alex.morgan.health@proton.me' },
        ],
        address: [
          {
            use: 'home',
            line: ['4208 Pine Ridge Blvd, Suite 304'],
            city: 'Seattle',
            state: 'WA',
            postalCode: '98101',
            country: 'USA',
          },
        ],
      },
    },
    {
      fullUrl: 'urn:uuid:allergy-penicillin-severe',
      resource: {
        resourceType: 'AllergyIntolerance',
        id: 'allergy-penicillin',
        clinicalStatus: {
          coding: [{ system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical', code: 'active' }],
        },
        verificationStatus: {
          coding: [{ system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification', code: 'confirmed' }],
        },
        type: 'allergy',
        category: ['medication'],
        criticality: 'high',
        code: {
          coding: [{ system: 'http://snomed.info/sct', code: '764146007', display: 'Penicillin (substance)' }],
          text: 'Penicillin G & V',
        },
        patient: { reference: 'Patient/alex-morgan-fhir' },
        reaction: [
          {
            manifestation: [
              {
                coding: [{ system: 'http://snomed.info/sct', code: '39579001', display: 'Anaphylactic reaction' }],
                text: 'Anaphylaxis and respiratory compromise',
              },
            ],
            severity: 'severe',
          },
        ],
      },
    },
    {
      fullUrl: 'urn:uuid:med-warfarin-5mg',
      resource: {
        resourceType: 'MedicationRequest',
        id: 'med-warfarin-stjude',
        status: 'active',
        intent: 'order',
        medicationCodeableConcept: {
          coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '855332', display: 'Warfarin Sodium 5 MG Oral Tablet' }],
          text: 'Warfarin Sodium 5mg oral daily',
        },
        subject: { reference: 'Patient/alex-morgan-fhir' },
        authoredOn: '2026-03-12',
        requester: { display: 'Dr. Robert Chen, MD (St. Jude Memorial Hospital)' },
        dosageInstruction: [
          {
            timing: { repeat: { frequency: 1, period: 1, periodUnit: 'd' } },
            asNeededBoolean: false,
            route: { text: 'Oral' },
            doseAndRate: [{ doseQuantity: { value: 5, unit: 'mg', system: 'http://unitsofmeasure.org', code: 'mg' } }],
          },
        ],
      },
    },
    {
      fullUrl: 'urn:uuid:med-aspirin-81mg',
      resource: {
        resourceType: 'MedicationRequest',
        id: 'med-aspirin-nvfc',
        status: 'active',
        intent: 'order',
        medicationCodeableConcept: {
          coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '243670', display: 'Aspirin 81 MG Delayed Release Tablet' }],
          text: 'Aspirin 81mg oral daily',
        },
        subject: { reference: 'Patient/alex-morgan-fhir' },
        authoredOn: '2026-05-18',
        requester: { display: 'Dr. Meera Patel, MD (North Valley Family Clinic)' },
      },
    },
    {
      fullUrl: 'urn:uuid:obs-hba1c-quest',
      resource: {
        resourceType: 'Observation',
        id: 'obs-hba1c-20261004',
        status: 'final',
        category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'laboratory' }] }],
        code: {
          coding: [{ system: 'http://loinc.org', code: '4548-4', display: 'Hemoglobin A1c/Hemoglobin.total in Blood' }],
        },
        subject: { reference: 'Patient/alex-morgan-fhir' },
        effectiveDateTime: '2026-10-04T07:45:00Z',
        performer: [{ display: 'Quest Diagnostics Regional Reference Lab' }],
        valueQuantity: { value: 5.8, unit: '%', system: 'http://unitsofmeasure.org', code: '%' },
        referenceRange: [{ low: { value: 4.0 }, high: { value: 5.6 }, text: '4.0 - 5.6 % (Non-diabetic reference range)' }],
      },
    },
    {
      fullUrl: 'urn:uuid:consent-granular-dr-vance',
      resource: {
        resourceType: 'Consent',
        id: 'consent-granular-01',
        status: 'active',
        scope: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/consentscope', code: 'patient-privacy' }] },
        category: [{ coding: [{ system: 'http://loinc.org', code: '59284-0', display: 'Consent Document' }] }],
        patient: { reference: 'Patient/alex-morgan-fhir' },
        dateTime: '2026-07-04T12:00:00Z',
        performer: [{ reference: 'Patient/alex-morgan-fhir' }],
        provision: {
          type: 'permit',
          period: { start: '2026-07-04T00:00:00Z', end: '2027-07-04T23:59:59Z' },
          actor: [{ role: { text: 'Emergency Clinician' }, reference: { display: 'Dr. Elena Vance, MD' } }],
          securityLabel: [
            { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'ETH', display: 'Substance abuse information sensitivity (EXCLUDED)' },
            { system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode', code: 'PSY', display: 'Psychiatry sensitivity (EXCLUDED)' },
          ],
        },
      },
    },
  ],
};

export const SAMPLE_UPLOADED_DOCUMENTS: import('../types/index.ts').UploadedDocument[] = [
  {
    id: 'doc-1',
    fileName: 'St_Jude_Discharge_Summary_Cardiology.pdf',
    fileType: 'PDF',
    uploadDate: '2026-10-14 16:30',
    facilitySource: 'St. Jude Memorial Hospital (Division of Cardiology)',
    status: 'Extracted',
    confidenceScore: 98.4,
    documentCategory: 'Discharge Summary',
    rawOcrSnippet: 'DISCHARGE SUMMARY: Patient Aarav Sharma, 38yo. Diagnosis: Paroxysmal Atrial Fibrillation (I48.91). Commenced on Warfarin Sodium 5mg oral tablet daily at 20:00. Target INR therapeutic range 2.0 - 3.0. Allergy checked: Penicillin severe anaphylactoid. Attending: Dr. Robert Chen, MD, FACC. Uploaded to ZeniCare.',
    extractedEntities: {
      medications: [
        { name: 'Warfarin Sodium', dose: '5 mg oral daily', frequency: 'Once daily at bedtime' }
      ],
      vitals: [
        { label: 'Heart Rate', value: '72 bpm (Regular)' },
        { label: 'BP', value: '124/80 mmHg' }
      ],
      conditions: [
        { name: 'Paroxysmal Atrial Fibrillation', code: 'ICD-10 I48.91' }
      ],
      allergies: [
        { name: 'Penicillin (Beta-Lactam)', severity: 'Critical / Anaphylaxis' }
      ]
    },
    sourceCitations: [
      { page: 1, boundingSnippet: 'Warfarin Sodium 5mg oral tablet daily at 20:00 (RxNorm: 855332)', targetField: 'MedicationRequest/med-warfarin', verified: true },
      { page: 1, boundingSnippet: 'Diagnosis: Paroxysmal Atrial Fibrillation (ICD-10: I48.91)', targetField: 'Condition/cond-1', verified: true },
      { page: 2, boundingSnippet: 'Allergy checked: Penicillin severe anaphylactoid reaction', targetField: 'AllergyIntolerance/all-1', verified: true }
    ]
  },
  {
    id: 'doc-2',
    fileName: 'Quest_Diagnostics_Longitudinal_CMP_Lipids.pdf',
    fileType: 'PDF',
    uploadDate: '2026-10-06 09:15',
    facilitySource: 'Quest Diagnostics Regional Clinical Laboratories',
    status: 'Extracted',
    confidenceScore: 99.1,
    documentCategory: 'Lab Panel',
    rawOcrSnippet: 'QUEST DIAGNOSTICS: Specimen collected 04-Oct-2026. Fasting Glucose: 98 mg/dL. Hemoglobin A1c: 5.8% (Optimal control). Total Cholesterol: 178 mg/dL. LDL-C: 94 mg/dL. HDL-C: 54 mg/dL. Triglycerides: 130 mg/dL. eGFR: >90 mL/min/1.73m2.',
    extractedEntities: {
      medications: [],
      vitals: [
        { label: 'Fasting Blood Glucose', value: '98 mg/dL' }
      ],
      conditions: [
        { name: 'Type 2 Diabetes Mellitus', code: 'ICD-10 E11.9 (Controlled)' }
      ],
      allergies: []
    },
    sourceCitations: [
      { page: 1, boundingSnippet: 'Hemoglobin A1c: 5.8 % (LOINC: 4548-4)', targetField: 'Observation/obs-hba1c-20261004', verified: true },
      { page: 1, boundingSnippet: 'LDL-C: 94 mg/dL (LOINC: 13457-7)', targetField: 'Observation/obs-lipid-20261004', verified: true }
    ]
  }
];

import { MedicalReport, HealthcareDoctor, BookedAppointment, AiHealthBrief } from '../types/index.ts';

export const INITIAL_MEDICAL_REPORTS: MedicalReport[] = [
  {
    id: 'rep-1',
    title: 'St. Jude Cardiology Discharge Summary & Anticoagulation Plan',
    providerName: 'St. Jude Memorial Hospital (Cardiology Center)',
    reportDate: '2026-09-18',
    category: 'Discharge Summaries',
    uploadDate: '2026-09-19',
    verificationStatus: 'Clinician Verified',
    processingStatus: 'AI Extracted',
    fileFormat: 'PDF',
    fileSize: '1.4 MB',
    summary: 'Inpatient stay for paroxysmal atrial fibrillation episode. Sinus rhythm restored with Diltiazem. Discharged on Warfarin 5mg daily. Target INR: 2.0 - 3.0.',
    aiConfidence: 98.4,
    extractedFields: {
      dates: ['2026-09-15', '2026-09-18'],
      medicationsOrTests: ['Warfarin Sodium 5mg', 'Diltiazem 120mg CD', 'Metoprolol Succinate 25mg'],
      results: [
        { label: 'Admission INR', value: '1.1', unit: 'ratio', status: 'low' },
        { label: 'Discharge INR', value: '2.2', unit: 'ratio', status: 'normal' },
        { label: 'Left Ventricular Ejection Fraction', value: '62', unit: '%', status: 'normal' }
      ],
      physicianName: 'Dr. Marcus Vance, MD, FACC',
      keyFindings: [
        'Paroxysmal Atrial Fibrillation with spontaneous sinus rhythm conversion',
        'Normal left ventricular systolic function (LVEF 62%)',
        'Initiated oral anticoagulation (Warfarin 5mg daily)'
      ]
    },
    originalPreviewText: 'ST. JUDE MEMORIAL HOSPITAL - CLINICAL DISCHARGE SUMMARY\nPatient: Alex Morgan (MRN: #NX-88204)\nAttending: Dr. Marcus Vance, MD\nAdmit Date: 2026-09-15 | Discharge Date: 2026-09-18\nDischarge Diagnosis: Paroxysmal Atrial Fibrillation (ICD-10: I48.91)\nMedications Prescribed on Discharge: Warfarin Sodium 5mg oral daily at 20:00. Diltiazem 120mg CD.\nAllergies: Penicillin (severe anaphylaxis reported 2019).\nFollow-up: Outpatient INR surveillance in 7 days.',
    isSensitive: false
  },
  {
    id: 'rep-2',
    title: 'Quest Comprehensive Metabolic & Longitudinal Lipid Panel',
    providerName: 'Quest Diagnostics Regional Clinical Laboratories',
    reportDate: '2026-10-04',
    category: 'Laboratory Tests',
    uploadDate: '2026-10-05',
    verificationStatus: 'Patient Verified',
    processingStatus: 'AI Extracted',
    fileFormat: 'PDF',
    fileSize: '840 KB',
    summary: 'Routine fasting metabolic panel and lipid profile. Demonstrates excellent HbA1c control (5.8%), optimal fasting blood glucose (98 mg/dL), and improved LDL-C (94 mg/dL).',
    aiConfidence: 99.2,
    extractedFields: {
      dates: ['2026-10-04'],
      medicationsOrTests: ['Hemoglobin A1c', 'Fasting Blood Glucose', 'Total Cholesterol', 'LDL-C', 'HDL-C', 'Triglycerides'],
      results: [
        { label: 'Hemoglobin A1c', value: '5.8', unit: '%', status: 'normal' },
        { label: 'Fasting Blood Glucose', value: '98', unit: 'mg/dL', status: 'normal' },
        { label: 'Total Cholesterol', value: '178', unit: 'mg/dL', status: 'normal' },
        { label: 'LDL Cholesterol', value: '94', unit: 'mg/dL', status: 'normal' },
        { label: 'HDL Cholesterol', value: '54', unit: 'mg/dL', status: 'normal' },
        { label: 'Triglycerides', value: '130', unit: 'mg/dL', status: 'normal' }
      ],
      physicianName: 'Dr. Meera Patel, MD (Ordering)',
      keyFindings: [
        'HbA1c sustained below 6.0% indicating strict glycemic control',
        'LDL cholesterol down from baseline 142 mg/dL to 94 mg/dL',
        'Renal function preserved with eGFR > 90 mL/min'
      ]
    },
    originalPreviewText: 'QUEST DIAGNOSTICS - OFFICIAL LABORATORY EVALUATION\nSpecimen ID: Q-902914-A | Collected: 04-Oct-2026 07:30 AM\nPatient: Alex Morgan | DOB: 1984-06-22\nHbA1c: 5.8% [Ref: 4.0 - 5.6 % Normal, < 7.0 % ADA Goal]\nGlucose, Fasting: 98 mg/dL [Ref: 70 - 99 mg/dL]\nCholesterol Total: 178 mg/dL [Ref: < 200 mg/dL]\nLDL-Calculated: 94 mg/dL [Ref: < 100 mg/dL Optimal]\nTriglycerides: 130 mg/dL [Ref: < 150 mg/dL]',
    isSensitive: false
  },
  {
    id: 'rep-3',
    title: 'North Valley Family Clinic - Annual Comprehensive Wellness Visit',
    providerName: 'North Valley Family Clinic (Primary Care)',
    reportDate: '2026-10-12',
    category: 'Doctor Visit Summaries',
    uploadDate: '2026-10-12',
    verificationStatus: 'Clinician Verified',
    processingStatus: 'AI Extracted',
    fileFormat: 'PDF',
    fileSize: '1.1 MB',
    summary: 'Annual preventive exam. Blood pressure well controlled at 122/78 mmHg. BMI 23.4. Routine refill for Metformin 500mg BID and Lisinopril 10mg daily. Documented cross-hospital discrepancy warning for Aspirin + Warfarin.',
    aiConfidence: 97.8,
    extractedFields: {
      dates: ['2026-10-12'],
      medicationsOrTests: ['Metformin 500mg BID', 'Lisinopril 10mg daily', 'Aspirin 81mg (Discrepant)'],
      results: [
        { label: 'Office Blood Pressure', value: '122/78', unit: 'mmHg', status: 'normal' },
        { label: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal' },
        { label: 'BMI', value: '23.4', unit: 'kg/m²', status: 'normal' }
      ],
      physicianName: 'Dr. Meera Patel, MD',
      keyFindings: [
        'Vitals stable and within healthy reference targets',
        'Flagged concurrent prescription of OTC Aspirin 81mg against hospital Warfarin',
        'Recommended immediate anticoagulation safety reconciliation'
      ]
    },
    originalPreviewText: 'NORTH VALLEY FAMILY MEDICINE - SOAP PROGRESS NOTE\nProvider: Dr. Meera Patel, MD | Patient: Alex Morgan (#NX-88204)\nDate: October 12, 2026 09:00 AM\nSubjective: 42yo here for annual wellness. Feeling well, walking 30 min daily.\nObjective: BP 122/78, HR 72 regular, RR 16, SpO2 98% room air. Lungs clear.\nAssessment: Essential Hypertension (Controlled), Type 2 Diabetes (Well controlled), Atrial Fibrillation (Stable).\nPlan: Continue Lisinopril 10mg, Metformin 500mg. Discontinue Aspirin 81mg immediately due to St. Jude Warfarin prescription.',
    isSensitive: false
  },
  {
    id: 'rep-4',
    title: 'Apex Imaging Diagnostic Chest Radiograph (AP Erect)',
    providerName: 'Apex Diagnostic Imaging / Metro Health',
    reportDate: '2026-08-15',
    category: 'Scans and Imaging',
    uploadDate: '2026-08-16',
    verificationStatus: 'Clinician Verified',
    processingStatus: 'AI Extracted',
    fileFormat: 'JPG',
    fileSize: '3.6 MB',
    summary: 'Frontal portable chest radiograph. Normal cardiothoracic ratio of 0.48. Clear lung fields bilaterally without consolidation, effusion, or pneumothorax.',
    aiConfidence: 96.5,
    extractedFields: {
      dates: ['2026-08-15'],
      medicationsOrTests: ['Chest X-Ray AP View'],
      results: [
        { label: 'Cardiothoracic Ratio', value: '0.48', unit: 'ratio', status: 'normal' },
        { label: 'Trachea', value: 'Midline', status: 'normal' },
        { label: 'Costophrenic Angles', value: 'Sharp', status: 'normal' }
      ],
      physicianName: 'Dr. Marcus Sterling, MD (Board-Certified Radiologist)',
      keyFindings: [
        'No active cardiopulmonary disease detected',
        'Heart size and contours within normal physiological limits',
        'No evidence of pulmonary vascular congestion'
      ]
    },
    originalPreviewText: 'APEX DIAGNOSTIC IMAGING - RADIOLOGY REPORT\nAccession #: ACC-RAD-2026-0912X | Exam: CHEST AP ERECT\nRadiologist: Dr. Marcus Sterling, MD\nFindings: Normal cardiac silhouette (CTR 0.48). Mediastinum and hila normal. Trachea midline. Both lungs well aerated without focal airspace opacities. Pleural spaces clear.\nImpression: Negative chest radiograph. No acute cardiopulmonary abnormality.',
    isSensitive: false
  },
  {
    id: 'rep-5',
    title: 'Active Outpatient Prescription: Warfarin Sodium 5mg Tablets',
    providerName: 'St. Jude Heart Institute Pharmacy Services',
    reportDate: '2026-09-18',
    category: 'Prescriptions',
    uploadDate: '2026-09-19',
    verificationStatus: 'Clinician Verified',
    processingStatus: 'AI Extracted',
    fileFormat: 'PDF',
    fileSize: '510 KB',
    summary: 'Oral anticoagulant prescription. 5mg tablet once daily at 20:00. Refills: 3 remaining. Warning: High-risk interaction with NSAIDs/aspirin.',
    aiConfidence: 99.5,
    extractedFields: {
      dates: ['2026-09-18'],
      medicationsOrTests: ['Warfarin Sodium 5mg Tablet'],
      results: [
        { label: 'Dosage', value: '5 mg', unit: 'oral', status: 'normal' },
        { label: 'Quantity Dispensed', value: '30 tablets', status: 'normal' },
        { label: 'Refills Remaining', value: '3', status: 'normal' }
      ],
      physicianName: 'Dr. Marcus Vance, MD',
      keyFindings: [
        'Requires periodic INR monitoring every 2-4 weeks',
        'Black box warning: Concurrent antiplatelet therapy markedly increases hemorrhage risk'
      ]
    },
    originalPreviewText: 'ELECTRONIC PRESCRIPTION (eRx FHIR R4)\nPrescription ID: RX-992014-SJ\nPrescriber: Dr. Marcus Vance, MD (NPI: 1487291044)\nRx: Warfarin Sodium 5mg Oral Tablet\nSig: Take 1 tablet by mouth daily in the evening at 8:00 PM\nRefills: 3 | Dispense: 30 days supply',
    isSensitive: false
  },
  {
    id: 'rep-6',
    title: 'Endocrinology Specialist Referral & Glycemic Consultation',
    providerName: 'North Valley Family Clinic -> Swedish Endocrinology Center',
    reportDate: '2026-07-20',
    category: 'Referrals',
    uploadDate: '2026-07-22',
    verificationStatus: 'Patient Verified',
    processingStatus: 'AI Extracted',
    fileFormat: 'PDF',
    fileSize: '620 KB',
    summary: 'Clinical referral from Dr. Meera Patel for specialized endocrine review and continuous glucose monitor (CGM) consideration.',
    aiConfidence: 95.8,
    extractedFields: {
      dates: ['2026-07-20'],
      medicationsOrTests: ['Endocrine Specialty Consultation'],
      results: [
        { label: 'Referral Urgency', value: 'Routine', status: 'normal' },
        { label: 'Target HbA1c Goal', value: '< 6.5%', status: 'normal' }
      ],
      physicianName: 'Dr. Meera Patel, MD',
      keyFindings: [
        'Patient demonstrating excellent lifestyle compliance',
        'Request evaluation for wearable biosensor / CGM integration'
      ]
    },
    originalPreviewText: 'SPECIALTY REFERRAL ORDER\nReferring Provider: Dr. Meera Patel, MD | Clinic: North Valley Family Medicine\nReferred To: Dr. Angela Chen, MD (Swedish Endocrinology Center)\nReason for Referral: Evaluation for CGM biosensor in well-controlled Type 2 Diabetes.',
    isSensitive: false
  },
  {
    id: 'rep-7',
    title: 'Master Immunization Registry Card & COVID-19/Influenza Vaccines',
    providerName: 'Washington State Immunization Information System (WAIIS)',
    reportDate: '2025-10-10',
    category: 'Vaccination Records',
    uploadDate: '2025-10-15',
    verificationStatus: 'Clinician Verified',
    processingStatus: 'AI Extracted',
    fileFormat: 'PDF',
    fileSize: '780 KB',
    summary: 'Complete validated immunization history. Includes updated seasonal Influenza quadrivalent vaccine and COVID-19 bivalent mRNA boosters.',
    aiConfidence: 99.0,
    extractedFields: {
      dates: ['2025-10-10', '2024-10-14', '2023-11-02'],
      medicationsOrTests: ['Influenza Quadrivalent', 'COVID-19 mRNA Booster', 'Tetanus Tdap Booster'],
      results: [
        { label: 'Influenza Vaccine Status', value: 'Current / Up-to-date', status: 'normal' },
        { label: 'COVID-19 Vaccine Status', value: 'Fully Boosted', status: 'normal' },
        { label: 'Tdap Status', value: 'Valid until 2033', status: 'normal' }
      ],
      physicianName: 'Nurse Practitioner E. Ross, ARNP',
      keyFindings: [
        'All adult core immunizations in full compliance with CDC ACIP schedules'
      ]
    },
    originalPreviewText: 'STATE IMMUNIZATION REGISTRY RECORD (WAIIS Verified)\nPatient: Alex Morgan (NX-88204)\nVaccines Documented:\n- Influenza, injectable, quadrivalent (CVX 197) - Administered 2025-10-10\n- COVID-19 mRNA bivalent (CVX 229) - Administered 2024-10-14\n- Tdap (Tetanus, Diphtheria, Pertussis) - Administered 2023-11-02',
    isSensitive: false
  },
  {
    id: 'rep-8',
    title: 'Pre-Operative Cardiac Clearance & Anesthesia Assessment',
    providerName: 'Metro Health Anesthesiology Group',
    reportDate: '2026-03-14',
    category: 'Other Documents',
    uploadDate: '2026-03-15',
    verificationStatus: 'Patient Verified',
    processingStatus: 'AI Extracted',
    fileFormat: 'Scan',
    fileSize: '2.1 MB',
    summary: 'Scanned questionnaire and physical exam document for elective arthroscopy. Low cardiovascular risk index (Lee RCRI Score: 1). ASA Class II.',
    aiConfidence: 93.4,
    extractedFields: {
      dates: ['2026-03-14'],
      medicationsOrTests: ['Anesthesia Risk Assessment'],
      results: [
        { label: 'ASA Physical Status', value: 'Class II', status: 'normal' },
        { label: 'Revised Cardiac Risk Index', value: 'Score 1 (Low Risk)', status: 'normal' }
      ],
      physicianName: 'Dr. Jason Wu, MD (Anesthesiology)',
      keyFindings: [
        'Cleared for monitored anesthesia care (MAC)',
        'Noted strict penicillin allergy avoidance protocol'
      ]
    },
    originalPreviewText: 'METRO HEALTH SURGICAL CENTER - PRE-ANESTHESIA EVALUATION\nPatient: Alex Morgan | Exam Date: 2026-03-14\nMallampati Score: Class I | Airway: Normal\nASA Classification: ASA II (Controlled HTN & DM2)\nPenicillin Allergy: High risk - alternative antibiotic cephalosporin/vancomycin ordered.',
    isSensitive: false
  }
];

export const HEALTHCARE_DOCTORS: HealthcareDoctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Meera Patel, MD',
    title: 'Board-Certified Family Physician',
    specialty: 'Family Medicine & Primary Care',
    facility: 'North Valley Family Clinic',
    address: '1420 4th Ave, Suite 200, Seattle, WA',
    distance: '0.8 miles away',
    rating: 4.9,
    reviewsCount: 128,
    nextAvailable: 'Tomorrow, 10:00 AM',
    phone: '+1 (555) 890-1122',
    acceptsInsurance: true,
    insuranceList: ['Blue Cross Blue Shield', 'Aetna', 'UnitedHealthcare', 'Cigna', 'Medicare'],
    bio: 'Dr. Patel focuses on longitudinal preventive medicine, hypertension management, and whole-patient metabolic wellness. She has served as Alex Morgan’s primary care doctor for 5 years.',
    availableSlots: ['Tomorrow 10:00 AM', 'Tomorrow 02:30 PM', 'Oct 22 11:15 AM', 'Oct 23 09:00 AM', 'Oct 24 04:00 PM']
  },
  {
    id: 'doc-2',
    name: 'Dr. Marcus Vance, MD, FACC',
    title: 'Chief of Clinical Cardiology',
    specialty: 'Cardiovascular Disease & Arrhythmias',
    facility: 'St. Jude Heart & Vascular Institute',
    address: '890 University Street, 4th Floor, Seattle, WA',
    distance: '1.4 miles away',
    rating: 4.8,
    reviewsCount: 94,
    nextAvailable: 'Thursday, 01:30 PM',
    phone: '+1 (555) 345-6789',
    acceptsInsurance: true,
    insuranceList: ['Blue Cross', 'Regence', 'Kaiser Permanente', 'UnitedHealthcare', 'Medicare'],
    bio: 'Specializing in electrophysiology, atrial fibrillation management, and outpatient anticoagulation surveillance. Oversees St. Jude’s advanced rhythm clinic.',
    availableSlots: ['Oct 28 10:30 AM', 'Oct 28 01:30 PM', 'Oct 30 11:00 AM', 'Nov 02 03:00 PM']
  },
  {
    id: 'doc-3',
    name: 'Dr. Angela Chen, MD',
    title: 'Endocrinologist & Diabetologist',
    specialty: 'Endocrinology, Diabetes & Metabolism',
    facility: 'Seattle Metro Specialty Care',
    address: '1100 9th Ave, Suite 550, Seattle, WA',
    distance: '2.1 miles away',
    rating: 4.9,
    reviewsCount: 142,
    nextAvailable: 'Friday, 11:00 AM',
    phone: '+1 (555) 456-7890',
    acceptsInsurance: true,
    insuranceList: ['Premera Blue Cross', 'Aetna', 'First Choice Health', 'Cigna'],
    bio: 'Leader in personalized diabetes management, insulin sensitivity optimization, and continuous glucose monitoring biosensors.',
    availableSlots: ['Friday 11:00 AM', 'Friday 03:15 PM', 'Oct 26 09:30 AM', 'Oct 27 02:00 PM']
  },
  {
    id: 'doc-4',
    name: 'Dr. Sarah Jenkins, MD',
    title: 'Orthopedic Surgeon',
    specialty: 'Orthopedics & Sports Medicine',
    facility: 'Sound Health Orthopedics',
    address: '701 Madison St, Seattle, WA',
    distance: '2.6 miles away',
    rating: 4.7,
    reviewsCount: 81,
    nextAvailable: 'Monday, 09:00 AM',
    phone: '+1 (555) 567-8901',
    acceptsInsurance: true,
    insuranceList: ['Blue Cross', 'Providence Health Plan', 'Aetna', 'Medicare'],
    bio: 'Specialist in joint preservation, minimally invasive arthroscopy, and post-traumatic knee recovery.',
    availableSlots: ['Monday 09:00 AM', 'Monday 01:00 PM', 'Wednesday 10:30 AM']
  },
  {
    id: 'doc-5',
    name: 'Dr. David Kim, MD, FAAD',
    title: 'Dermatologist & Allergy Specialist',
    specialty: 'Dermatology & Allergic Drug Reactions',
    facility: 'Pacific Skin & Allergy Center',
    address: '1800 9th Ave, Suite 310, Seattle, WA',
    distance: '3.2 miles away',
    rating: 4.9,
    reviewsCount: 210,
    nextAvailable: 'Tuesday, 02:00 PM',
    phone: '+1 (555) 678-9012',
    acceptsInsurance: true,
    insuranceList: ['Regence BlueShield', 'UnitedHealthcare', 'Cigna', 'Aetna'],
    bio: 'Expert in cutaneous adverse drug reactions, contact dermatitis, and severe beta-lactam allergy documentation and cross-reactivity profiling.',
    availableSlots: ['Tuesday 02:00 PM', 'Wednesday 03:30 PM', 'Friday 10:00 AM']
  },
  {
    id: 'doc-6',
    name: 'Dr. Rachel O’Connor, MD',
    title: 'Neurologist',
    specialty: 'Neurology & Sleep Medicine',
    facility: 'Swedish Neuroscience Institute',
    address: '550 17th Ave, Suite 500, Seattle, WA',
    distance: '3.8 miles away',
    rating: 4.8,
    reviewsCount: 67,
    nextAvailable: 'Next Wednesday, 11:30 AM',
    phone: '+1 (555) 789-0123',
    acceptsInsurance: true,
    insuranceList: ['All Major Insurances', 'Medicare'],
    bio: 'Focuses on autonomic nervous system balance, migraine prophylaxis, and comprehensive sleep architecture in patients with cardiovascular conditions.',
    availableSlots: ['Next Wednesday 11:30 AM', 'Next Thursday 02:00 PM']
  }
];

export const INITIAL_APPOINTMENTS: BookedAppointment[] = [
  {
    id: 'apt-1',
    doctorId: 'doc-2',
    doctorName: 'Dr. Marcus Vance, MD, FACC',
    specialty: 'Cardiovascular Disease & Arrhythmias',
    facility: 'St. Jude Heart & Vascular Institute',
    address: '890 University Street, 4th Floor, Seattle, WA',
    date: '2026-10-28',
    time: '10:30 AM',
    status: 'Confirmed',
    visitReason: 'Outpatient Anticoagulation Check & Rhythm Holter Follow-up',
    notes: 'Please bring recent INR lab slip and list of all active medications.'
  },
  {
    id: 'apt-2',
    doctorId: 'doc-1',
    doctorName: 'Dr. Meera Patel, MD',
    specialty: 'Family Medicine & Primary Care',
    facility: 'North Valley Family Clinic',
    address: '1420 4th Ave, Suite 200, Seattle, WA',
    date: '2026-11-12',
    time: '02:30 PM',
    status: 'Upcoming',
    visitReason: 'Quarterly Metabolic Follow-up & Lisinopril BP Review',
    notes: 'Fast 8 hours prior if repeat lipid panel is drawn.'
  },
  {
    id: 'apt-3',
    doctorId: 'doc-1',
    doctorName: 'Dr. Meera Patel, MD',
    specialty: 'Family Medicine & Primary Care',
    facility: 'North Valley Family Clinic',
    address: '1420 4th Ave, Suite 200, Seattle, WA',
    date: '2026-10-12',
    time: '09:00 AM',
    status: 'Completed',
    visitReason: 'Annual Preventive Health Exam & Prescription Audit',
    notes: 'Exam completed. Reconciled blood pressure medications.'
  }
];

export const AI_HEALTH_BRIEF: AiHealthBrief = {
  generatedAt: '2026-10-16 02:30 UTC',
  overallSummary: 'Alex Morgan is a 42-year-old patient with well-controlled Type 2 Diabetes (HbA1c 5.8%) and Essential Hypertension (BP 122/78 mmHg), with a history of Paroxysmal Atrial Fibrillation treated with Warfarin 5mg daily. Vital signs and metabolic parameters are within target physiological ranges. One critical cross-facility medication interaction (Warfarin + Aspirin) requires active clinician reconciliation.',
  recordedConditions: [
    { name: 'Paroxysmal Atrial Fibrillation (ICD-10 I48.91)', status: 'Active / Managed', source: 'St. Jude Memorial Hospital', date: '2026-09-18' },
    { name: 'Essential Hypertension (ICD-10 I10)', status: 'Well-Controlled', source: 'North Valley Family Clinic', date: '2026-10-12' },
    { name: 'Type 2 Diabetes Mellitus (ICD-10 E11.9)', status: 'Optimal Control (HbA1c 5.8%)', source: 'Quest Diagnostics', date: '2026-10-04' }
  ],
  recordedAllergies: [
    { substance: 'Penicillin G & V (Beta-Lactams)', severity: 'Critical / High', reaction: 'Severe Anaphylaxis with acute bronchospasm & angioedema', source: 'Metro Health Emergency Trauma (Verified 2019)' },
    { substance: 'Peanut Proteins (Arachis hypogaea)', severity: 'Critical / High', reaction: 'Facial urticaria and periorbital edema within 15 minutes', source: 'North Valley Allergy Screening (Verified 2021)' },
    { substance: 'House Dust Mite / Grass Pollen', severity: 'Moderate', reaction: 'Allergic rhinitis and nasal congestion', source: 'North Valley Allergy Screening (Verified 2023)' }
  ],
  activeMedications: [
    { name: 'Warfarin Sodium', dosage: '5 mg tablet', frequency: 'Once daily at 20:00', prescribedBy: 'Dr. Marcus Vance, MD', facility: 'St. Jude Heart Institute' },
    { name: 'Lisinopril', dosage: '10 mg oral', frequency: 'Once daily in morning', prescribedBy: 'Dr. Meera Patel, MD', facility: 'North Valley Family Clinic' },
    { name: 'Metformin HCl', dosage: '500 mg oral', frequency: 'Twice daily with meals', prescribedBy: 'Dr. Meera Patel, MD', facility: 'North Valley Family Clinic' },
    { name: 'Diltiazem CD', dosage: '120 mg capsule', frequency: 'Once daily in morning', prescribedBy: 'Dr. Marcus Vance, MD', facility: 'St. Jude Heart Institute' },
    { name: 'Atorvastatin', dosage: '20 mg oral', frequency: 'Once daily at bedtime', prescribedBy: 'Dr. Meera Patel, MD', facility: 'North Valley Family Clinic' }
  ],
  discontinuedMedications: [
    { name: 'Aspirin (Enteric Coated) 81mg', reason: 'Discontinued due to synergistic hemorrhage risk concurrent with Warfarin', date: '2026-10-12' },
    { name: 'Hydrochlorothiazide 12.5mg', reason: 'Switched to Lisinopril monotherapy after normalization of renal panel', date: '2024-05-18' }
  ],
  recentVisits: [
    { date: '2026-10-12', facility: 'North Valley Family Clinic', reason: 'Annual Comprehensive Wellness & BP Audit', physician: 'Dr. Meera Patel, MD' },
    { date: '2026-10-04', facility: 'Quest Diagnostics', reason: 'Fasting Metabolic & Longitudinal Lipid Panel', physician: 'Dr. Meera Patel, MD (Ordering)' },
    { date: '2026-09-18', facility: 'St. Jude Memorial Hospital', reason: 'Cardiology Inpatient Discharge & Anticoagulation Initiation', physician: 'Dr. Marcus Vance, MD' },
    { date: '2026-08-15', facility: 'Apex Diagnostic Imaging', reason: 'Diagnostic Chest Radiograph (AP Erect)', physician: 'Dr. Marcus Sterling, MD' }
  ],
  importantLabs: [
    { test: 'Hemoglobin A1c', value: '5.8 %', status: 'Optimal (< 7.0 % ADA target)', date: '2026-10-04', facility: 'Quest Diagnostics' },
    { test: 'Fasting Glucose', value: '98 mg/dL', status: 'Normal (70-99 mg/dL)', date: '2026-10-04', facility: 'Quest Diagnostics' },
    { test: 'LDL Cholesterol', value: '94 mg/dL', status: 'Optimal (< 100 mg/dL)', date: '2026-10-04', facility: 'Quest Diagnostics' },
    { test: 'Discharge INR', value: '2.2 ratio', status: 'Therapeutic Range (2.0 - 3.0)', date: '2026-09-18', facility: 'St. Jude Memorial' },
    { test: 'Blood Pressure', value: '122/78 mmHg', status: 'Normotensive Target', date: '2026-10-12', facility: 'North Valley Clinic' }
  ],
  missingOrConflictingInfo: [
    {
      title: 'Repeat INR Coagulation Window Approaching',
      description: 'Last INR was 2.2 on Sept 18, 2026 at discharge. Standard outpatient Warfarin monitoring protocol recommends testing every 2 to 4 weeks.',
      recommendation: 'Schedule routine fingerstick INR or venous lab test within 7 days.',
      severity: 'medium'
    },
    {
      title: 'Resolved Aspirin / Warfarin Safety Discrepancy',
      description: 'North Valley Clinic records listed Aspirin 81mg, while St. Jude prescribed Warfarin 5mg. Dual antiplatelet/anticoagulant therapy increases bleeding hazard.',
      recommendation: 'Aspirin has been marked discontinued in MediBridge master record; verify patient has ceased over-the-counter baby aspirin.',
      severity: 'high'
    }
  ],
  upcomingAppointments: [
    { doctor: 'Dr. Marcus Vance, MD, FACC', specialty: 'Cardiology', date: '2026-10-28', time: '10:30 AM', facility: 'St. Jude Heart Institute' },
    { doctor: 'Dr. Meera Patel, MD', specialty: 'Family Medicine', date: '2026-11-12', time: '02:30 PM', facility: 'North Valley Family Clinic' }
  ]
};

export const HEALTHCARE_FACILITIES: HealthcareFacility[] = [
  {
    id: 'fac-1',
    name: 'Lilavati Hospital & Research Centre',
    category: 'Multispecialty Hospital',
    address: 'A-791, Bandra Reclamation, Bandra West, Mumbai 400050',
    distance: '1.2 km away',
    rating: 4.8,
    reviewsCount: 1420,
    phone: '+91 22 2675 1000',
    emergencyPhone: '108 / +91 22 2656 8000',
    isOpen24Hours: true,
    acceptsWalkIns: true,
    hasEmergencyDept: true,
    specialties: ['Cardiology', 'Emergency Medicine', 'Oncology', 'Neurology'],
    services: ['24/7 Level-1 Trauma Care', 'Cath Lab', 'ICCU', 'PET-CT & MRI'],
    doctors: [
      { name: 'Dr. Meera Joshi, MD', specialty: 'Senior Cardiologist', nextAvailable: 'Today at 04:00 PM', rating: 4.9 },
      { name: 'Dr. Rohan Deshmukh, MS', specialty: 'Orthopedics', nextAvailable: 'Tomorrow at 10:30 AM', rating: 4.8 },
    ],
  },
  {
    id: 'fac-2',
    name: 'P.D. Hinduja Hospital & Medical Research Centre',
    category: 'Multispecialty Hospital',
    address: 'Veer Savarkar Marg, Mahim West, Mumbai 400016',
    distance: '3.4 km away',
    rating: 4.9,
    reviewsCount: 1890,
    phone: '+91 22 2445 1515',
    emergencyPhone: '+91 22 2444 9199',
    isOpen24Hours: true,
    acceptsWalkIns: true,
    hasEmergencyDept: true,
    specialties: ['Cardiology', 'Nephrology', 'Critical Care', 'Internal Medicine'],
    services: ['Robotic Surgery', 'Dialysis Center', 'Linear Accelerator'],
    doctors: [
      { name: 'Dr. Rajesh Mehta, MD', specialty: 'Internal Medicine & Diabetology', nextAvailable: 'Tomorrow at 11:00 AM', rating: 4.9 },
    ],
  },
];

