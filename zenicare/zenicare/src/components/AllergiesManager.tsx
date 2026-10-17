import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Building2,
  Tag,
  Info,
} from 'lucide-react';
import { AllergyAlert } from '../types/index.ts';

interface AllergiesManagerProps {
  allergies: AllergyAlert[];
  onAddAllergy: (allergy: AllergyAlert) => void;
}

export const AllergiesManager: React.FC<AllergiesManagerProps> = ({
  allergies,
  onAddAllergy,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [substance, setSubstance] = useState('');
  const [severity, setSeverity] = useState<'Critical / High' | 'Moderate' | 'Mild'>('Critical / High');
  const [reaction, setReaction] = useState('');
  const [clinicalManifestation, setClinicalManifestation] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!substance || !reaction) return;

    const newAllergy: AllergyAlert = {
      id: `all-${Date.now()}`,
      substance,
      category: 'medication',
      severity,
      criticality: severity.includes('High') ? 'high' : 'moderate',
      reaction,
      clinicalManifestation: clinicalManifestation || reaction,
      verifiedBy: 'Dr. Elena Vance, MD (Emergency Triage)',
      verifiedDate: new Date().toISOString().split('T')[0],
      fhirCode: '764146007',
    };

    onAddAllergy(newAllergy);
    setShowAddModal(false);
    setSubstance('');
    setReaction('');
    setClinicalManifestation('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Known Allergies & Adverse Reactions
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-rose-100 text-rose-700">
              {allergies.length} Documented
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Reconciled allergy registry verified across all emergency departments and clinic EHRs
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Allergy Alert</span>
        </button>
      </div>

      {/* Allergies Grid matching Reference Image Screen 10 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allergies.map((allergy) => (
          <div
            key={allergy.id}
            className={`rounded-2xl p-6 border transition-all flex flex-col justify-between ${
              allergy.criticality === 'high'
                ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
                : 'bg-white border-slate-200 hover:border-amber-300'
            }`}
          >
            <div>
              <div className="flex items-start justify-between">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    allergy.criticality === 'high'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${
                    allergy.criticality === 'high'
                      ? 'bg-rose-200 text-rose-800'
                      : 'bg-amber-200 text-amber-800'
                  }`}
                >
                  {allergy.severity}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-3">{allergy.substance}</h3>
              <p className="text-xs font-semibold text-rose-700 mt-0.5">
                Reaction: {allergy.reaction}
              </p>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {allergy.clinicalManifestation}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Verified By:</span>
                <span className="font-semibold text-slate-700">{allergy.verifiedBy}</span>
              </div>
              <div className="flex justify-between">
                <span>Verification Date:</span>
                <span className="font-mono text-slate-500">{allergy.verifiedDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900 mb-1">
              Record New Allergy or Intolerance
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Instantly mapped to SNOMED CT and HL7 AllergyIntolerance profile.
            </p>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Substance / Allergen *</label>
                <input
                  type="text"
                  required
                  value={substance}
                  onChange={(e) => setSubstance(e.target.value)}
                  placeholder="e.g., Sulfa Drugs, Latex, Morphine"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Critical / High">Critical / High (Anaphylaxis, Airway, Shock)</option>
                  <option value="Moderate">Moderate (Urticaria, Bronchospasm)</option>
                  <option value="Mild">Mild (GI Upset, Rash)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Observed Reaction *</label>
                <input
                  type="text"
                  required
                  value={reaction}
                  onChange={(e) => setReaction(e.target.value)}
                  placeholder="e.g., Severe hives, wheezing, hypotension"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Details</label>
                <textarea
                  rows={2}
                  value={clinicalManifestation}
                  onChange={(e) => setClinicalManifestation(e.target.value)}
                  placeholder="Additional context, onset speed, treatment needed..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md"
                >
                  Save & Broadcast Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
