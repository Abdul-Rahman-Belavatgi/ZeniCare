export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  facility: string;
  prescribedBy: string;
  startDate: string;
  status: 'active' | 'discontinued' | 'reconciled' | 'pending';
  category?: string;
}

export interface DrugDiscrepancy {
  id: string;
  drugA: string;
  facilityA: string;
  drugB: string;
  facilityB: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  type: 'interaction' | 'duplicate' | 'contraindication';
  description: string;
  clinicalActionNeeded: string;
}

export interface Biomarker {
  code: string;
  name: string;
  value: number;
  unit: string;
  date: string;
  facility: string;
}

export interface ConsentSettings {
  excludeBehavioralHealth: boolean;
  excludeSubstanceUse: boolean;
  excludeGenetics: boolean;
}

export interface ConsentGrant {
  id: string;
  providerName: string;
  facilityName: string;
  status: 'active' | 'expired' | 'revoked';
  expiresAt: string; // ISO date string
  scopes: string[];
}

/**
 * Evaluates active medications for dangerous cross-facility clinical interactions.
 */
export function detectDrugInteractions(medications: Medication[]): DrugDiscrepancy[] {
  const activeMeds = medications.filter(m => m.status === 'active');
  const discrepancies: DrugDiscrepancy[] = [];

  for (let i = 0; i < activeMeds.length; i++) {
    for (let j = i + 1; j < activeMeds.length; j++) {
      const medA = activeMeds[i];
      const medB = activeMeds[j];

      const nameA = medA.name.toLowerCase();
      const nameB = medB.name.toLowerCase();

      // Warfarin + Aspirin (Major bleed risk)
      if (
        (nameA.includes('warfarin') && nameB.includes('aspirin')) ||
        (nameB.includes('warfarin') && nameA.includes('aspirin'))
      ) {
        discrepancies.push({
          id: `disc-${medA.id}-${medB.id}`,
          drugA: medA.name,
          facilityA: medA.facility,
          drugB: medB.name,
          facilityB: medB.facility,
          severity: 'critical',
          type: 'interaction',
          description:
            'Concurrent Anticoagulant (Warfarin) and Antiplatelet (Aspirin) therapy significantly elevates major GI and intracranial bleeding risks.',
          clinicalActionNeeded:
            'Reconcile with Cardiology (St. Jude) & Primary Care (North Valley). Assess HAS-BLED score, confirm antiplatelet indication or replace.',
        });
      }

      // Simvastatin + Amlodipine (Rhabdomyolysis / elevated statin levels)
      if (
        (nameA.includes('simvastatin') && nameB.includes('amlodipine')) ||
        (nameB.includes('simvastatin') && nameA.includes('amlodipine'))
      ) {
        discrepancies.push({
          id: `disc-${medA.id}-${medB.id}`,
          drugA: medA.name,
          facilityA: medA.facility,
          drugB: medB.name,
          facilityB: medB.facility,
          severity: 'high',
          type: 'interaction',
          description:
            'Amlodipine inhibits CYP3A4 metabolism of Simvastatin, increasing statin exposure and risk of myopathy or rhabdomyolysis.',
          clinicalActionNeeded:
            'Limit Simvastatin dose to <=20mg daily or transition to alternative statin (e.g., Rosuvastatin / Atorvastatin).',
        });
      }

      // Metformin + Contrast or duplicate antihypertensives
      if (
        (nameA.includes('lisinopril') && nameB.includes('losartan')) ||
        (nameB.includes('lisinopril') && nameA.includes('losartan'))
      ) {
        discrepancies.push({
          id: `disc-${medA.id}-${medB.id}`,
          drugA: medA.name,
          facilityA: medA.facility,
          drugB: medB.name,
          facilityB: medB.facility,
          severity: 'high',
          type: 'duplicate',
          description:
            'Dual ACE-Inhibitor (Lisinopril) and ARB (Losartan) blockade increases risks of hypotension, hyperkalemia, and acute kidney injury.',
          clinicalActionNeeded: 'Discontinue one agent and titrate single RAS blocker.',
        });
      }
    }
  }

  return discrepancies;
}

/**
 * Classifies a biomarker reading against clinical normal and alert thresholds.
 */
export function evaluateBiomarkerRange(
  code: string,
  value: number
): 'normal' | 'low' | 'high' | 'critical' {
  switch (code.toUpperCase()) {
    case 'HBA1C':
      if (value < 4.0) return 'low';
      if (value < 5.7) return 'normal';
      if (value <= 8.5) return 'high';
      return 'critical';

    case 'GLUCOSE':
      if (value < 70) return 'low';
      if (value <= 99) return 'normal';
      if (value <= 180) return 'high';
      return 'critical';

    case 'SYSTOLIC_BP':
      if (value < 90) return 'low';
      if (value <= 120) return 'normal';
      if (value < 160) return 'high';
      return 'critical';

    case 'LDL':
      if (value < 50) return 'low';
      if (value < 100) return 'normal';
      if (value < 160) return 'high';
      return 'critical';

    default:
      return 'normal';
  }
}

/**
 * Calculates physical millimeter distance on radiograph canvas using calibrated scale.
 */
export function calculateCaliperDistance(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  mmPerPixel: number = 0.25
): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const pixels = Math.sqrt(dx * dx + dy * dy);
  return Math.round(pixels * mmPerPixel * 10) / 10;
}

/**
 * Evaluates whether a consent grant is currently valid and unexpired.
 */
export function isConsentActive(consent: ConsentGrant, now = new Date()): boolean {
  if (consent.status !== 'active') return false;
  const expiration = new Date(consent.expiresAt);
  return expiration.getTime() > now.getTime();
}

/**
 * Filters sensitive records according to patient sovereign privacy rules.
 */
export function isRecordPermitted(
  category: 'general' | 'behavioral' | 'substance' | 'genetics',
  settings: ConsentSettings
): boolean {
  if (category === 'behavioral' && settings.excludeBehavioralHealth) return false;
  if (category === 'substance' && settings.excludeSubstanceUse) return false;
  if (category === 'genetics' && settings.excludeGenetics) return false;
  return true;
}
