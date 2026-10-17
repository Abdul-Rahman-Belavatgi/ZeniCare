import test from 'node:test';
import assert from 'node:assert/strict';
import {
  detectDrugInteractions,
  evaluateBiomarkerRange,
  calculateCaliperDistance,
  isConsentActive,
  isRecordPermitted,
  type Medication,
  type ConsentGrant,
} from './healthLogic.ts';

test('detectDrugInteractions flags concurrent Warfarin and Aspirin across facilities', () => {
  const meds: Medication[] = [
    {
      id: 'm1',
      name: 'Warfarin Sodium 5mg',
      dosage: '5mg oral daily',
      frequency: 'Once daily at bedtime',
      facility: 'St. Jude Memorial Hospital',
      prescribedBy: 'Dr. Robert Chen, MD',
      startDate: '2026-03-12',
      status: 'active',
    },
    {
      id: 'm2',
      name: 'Aspirin 81mg EC',
      dosage: '81mg oral daily',
      frequency: 'Once daily in morning',
      facility: 'North Valley Family Clinic',
      prescribedBy: 'Dr. Meera Patel, MD',
      startDate: '2026-05-18',
      status: 'active',
    },
    {
      id: 'm3',
      name: 'Metformin HCl 500mg',
      dosage: '500mg BID',
      frequency: 'Twice daily with meals',
      facility: 'Metro Health System',
      prescribedBy: 'Dr. Elena Vance, MD',
      startDate: '2025-11-01',
      status: 'active',
    },
  ];

  const discrepancies = detectDrugInteractions(meds);
  assert.equal(discrepancies.length, 1);
  assert.equal(discrepancies[0].severity, 'critical');
  assert.match(discrepancies[0].description, /Warfarin/i);
  assert.match(discrepancies[0].description, /Aspirin/i);
});

test('detectDrugInteractions ignores discontinued or resolved medications', () => {
  const meds: Medication[] = [
    {
      id: 'm1',
      name: 'Warfarin Sodium 5mg',
      dosage: '5mg',
      frequency: 'Daily',
      facility: 'St. Jude',
      prescribedBy: 'Dr. Chen',
      startDate: '2026-01-01',
      status: 'active',
    },
    {
      id: 'm2',
      name: 'Aspirin 81mg',
      dosage: '81mg',
      frequency: 'Daily',
      facility: 'North Valley',
      prescribedBy: 'Dr. Patel',
      startDate: '2026-01-01',
      status: 'discontinued', // discontinued!
    },
  ];

  const discrepancies = detectDrugInteractions(meds);
  assert.equal(discrepancies.length, 0);
});

test('evaluateBiomarkerRange correctly categorizes HbA1c and Blood Pressure', () => {
  assert.equal(evaluateBiomarkerRange('HBA1C', 5.4), 'normal');
  assert.equal(evaluateBiomarkerRange('HBA1C', 7.2), 'high');
  assert.equal(evaluateBiomarkerRange('HBA1C', 10.5), 'critical');

  assert.equal(evaluateBiomarkerRange('SYSTOLIC_BP', 118), 'normal');
  assert.equal(evaluateBiomarkerRange('SYSTOLIC_BP', 142), 'high');
  assert.equal(evaluateBiomarkerRange('SYSTOLIC_BP', 185), 'critical');
});

test('calculateCaliperDistance produces calibrated metric length', () => {
  // 3-4-5 triangle = 50 pixels * 0.25 mm/pixel = 12.5 mm
  const dist = calculateCaliperDistance({ x: 0, y: 0 }, { x: 30, y: 40 }, 0.25);
  assert.equal(dist, 12.5);
});

test('isConsentActive handles active vs expired dates', () => {
  const activeGrant: ConsentGrant = {
    id: 'c1',
    providerName: 'Dr. Vance',
    facilityName: 'Metro Health',
    status: 'active',
    expiresAt: '2030-01-01T00:00:00Z',
    scopes: ['clinical', 'labs'],
  };
  const expiredGrant: ConsentGrant = {
    id: 'c2',
    providerName: 'Dr. Vance',
    facilityName: 'Metro Health',
    status: 'active',
    expiresAt: '2020-01-01T00:00:00Z',
    scopes: ['clinical'],
  };

  assert.equal(isConsentActive(activeGrant), true);
  assert.equal(isConsentActive(expiredGrant), false);
});

test('isRecordPermitted enforces granular privacy blackouts', () => {
  const privacySettings = {
    excludeBehavioralHealth: true,
    excludeSubstanceUse: false,
    excludeGenetics: true,
  };

  assert.equal(isRecordPermitted('general', privacySettings), true);
  assert.equal(isRecordPermitted('behavioral', privacySettings), false);
  assert.equal(isRecordPermitted('substance', privacySettings), true);
  assert.equal(isRecordPermitted('genetics', privacySettings), false);
});
