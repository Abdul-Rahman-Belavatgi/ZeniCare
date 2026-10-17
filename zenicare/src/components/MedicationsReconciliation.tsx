import React, { useState } from 'react';
import {
  Pill,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Building2,
  Calendar,
  Check,
  X,
  FileCheck,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Medication, DrugDiscrepancy, detectDrugInteractions } from '../utils/healthLogic.ts';

interface MedicationsReconciliationProps {
  medications: Medication[];
  discrepancies: DrugDiscrepancy[];
  onReconcile: (reconciledDiscrepancyId: string, action: string, rationale: string) => void;
  onAddMedication: (med: Medication) => void;
  onToggleStatus: (medId: string, newStatus: 'active' | 'discontinued') => void;
}

export const MedicationsReconciliation: React.FC<MedicationsReconciliationProps> = ({
  medications,
  discrepancies,
  onReconcile,
  onAddMedication,
  onToggleStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
  const [showReconcileModal, setShowReconcileModal] = useState(false);
  const [selectedDiscrepancy, setSelectedDiscrepancy] = useState<DrugDiscrepancy | null>(
    discrepancies[0] || null
  );
  const [rationale, setRationale] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('discontinue_aspirin');
  const [showAddModal, setShowAddModal] = useState(false);

  // New med form
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('');
  const [newMedFacility, setNewMedFacility] = useState('North Valley Family Clinic');
  const [newMedPrescriber, setNewMedPrescriber] = useState('Dr. Meera Patel, MD');

  // Adherence tracking state for demo
  const [adherenceLog, setAdherenceLog] = useState<{ [key: string]: boolean }>({
    'med-1': true,
    'med-2': false,
    'med-3': true,
    'med-4': true,
    'med-5': true,
  });

  const currentMeds = medications.filter((m) => m.status === 'active');
  const pastMeds = medications.filter((m) => m.status === 'discontinued');

  const handleToggleAdherence = (medId: string) => {
    setAdherenceLog((prev) => ({
      ...prev,
      [medId]: !prev[medId],
    }));
  };

  const handleExecuteReconciliation = () => {
    if (!selectedDiscrepancy) return;
    const finalRationale =
      rationale ||
      'Cardiology and Primary Care alignment: Aspirin discontinued due to potentiation of major GI/intracranial bleeding risk concurrent with Warfarin (Target INR 2.0-3.0).';
    onReconcile(selectedDiscrepancy.id, selectedAction, finalRationale);
    setShowReconcileModal(false);
    setRationale('');
  };

  const handleAddNewMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;

    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name: newMedName,
      dosage: newMedDosage || 'Standard dose',
      frequency: newMedFreq || 'Once daily',
      facility: newMedFacility,
      prescribedBy: newMedPrescriber,
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      category: 'Therapeutic Prescription',
    };

    onAddMedication(newMed);
    setShowAddModal(false);
    setNewMedName('');
    setNewMedDosage('');
    setNewMedFreq('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Add Med */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Medications & Discrepancy Reconciliation Hub
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
              {currentMeds.length} Active Prescriptions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated cross-facility drug interaction surveillance and clinical reconciliation engine
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Medication</span>
        </button>
      </div>

      {/* Cross-Facility Discrepancy Card if any detected */}
      {discrepancies.length > 0 ? (
        <div className="bg-gradient-to-br from-rose-50 via-white to-rose-50 border-2 border-rose-300 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/30">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-rose-200 text-rose-900 rounded-full uppercase tracking-wider">
                    High Alert: Cross-Hospital Interaction
                  </span>
                  <span className="text-xs text-rose-600 font-semibold font-mono">
                    RxNorm Conflict #{discrepancies[0].id}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-rose-950 mt-1">
                  Concurrent {discrepancies[0].drugA} & {discrepancies[0].drugB}
                </h3>
                <p className="text-xs text-rose-800 mt-1.5 leading-relaxed max-w-3xl">
                  {discrepancies[0].description}
                </p>
                <div className="mt-3 bg-white/80 p-3 rounded-xl border border-rose-200 text-xs text-rose-900 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    <strong className="font-semibold">Recommended Clinical Action:</strong>{' '}
                    {discrepancies[0].clinicalActionNeeded}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedDiscrepancy(discrepancies[0]);
                setShowReconcileModal(true);
              }}
              className="px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-black transition-all shadow-md shrink-0 flex items-center space-x-1.5"
            >
              <span>Launch Clinical Reconciliation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold">
              All Cross-Hospital Drug Regimens Fully Reconciled • No Active Contraindications Detected
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-mono">FHIR MedicationRequest Valid</span>
        </div>
      )}

      {/* Adherence & Compliance Widget */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Today's Medication Adherence Tracker</span>
            </h3>
            <p className="text-xs text-slate-500">
              Check off confirmed doses to maintain your longitudinal compliance score (94% 30-Day Rate)
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-700">Streak:</span>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full">
              28 Days 100% On-Time
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {currentMeds.map((med) => {
            const isTaken = adherenceLog[med.id];
            return (
              <div
                key={med.id}
                onClick={() => handleToggleAdherence(med.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isTaken
                    ? 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-50'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 truncate">{med.name}</span>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-white ${
                      isTaken ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    {isTaken && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 truncate">{med.dosage}</p>
                <span
                  className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded ${
                    isTaken ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isTaken ? 'Dose Logged' : 'Pending Intake'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs: Current vs Past Medications matching Reference Image Screen 9 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center border-b border-slate-200 px-6 pt-4 gap-6">
          <button
            onClick={() => setActiveTab('current')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'current'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Active Medications ({currentMeds.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'past'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Past / Discontinued ({pastMeds.length})
          </button>
        </div>

        {/* Medication Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Medication & Form</th>
                <th className="py-3 px-6">Dosage & Frequency</th>
                <th className="py-3 px-6">Prescribing Facility</th>
                <th className="py-3 px-6">Attending Physician</th>
                <th className="py-3 px-6">Start Date</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(activeTab === 'current' ? currentMeds : pastMeds).map((med) => (
                <tr key={med.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-slate-900">
                    <div className="flex items-center space-x-2">
                      <Pill className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{med.name}</span>
                    </div>
                    {med.category && (
                      <span className="text-[10px] font-normal text-slate-500 block ml-6">
                        {med.category}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-slate-700">
                    <div>{med.dosage}</div>
                    <div className="text-[11px] text-slate-400">{med.frequency}</div>
                  </td>
                  <td className="py-3.5 px-6 text-slate-700">
                    <span className="flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{med.facility}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-700 font-medium">{med.prescribedBy}</td>
                  <td className="py-3.5 px-6 text-slate-500 font-mono">{med.startDate}</td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                        med.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {med.status === 'active' ? 'Active' : 'Discontinued'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    {med.status === 'active' ? (
                      <button
                        onClick={() => onToggleStatus(med.id, 'discontinued')}
                        className="text-xs text-rose-600 hover:text-rose-800 font-semibold hover:underline"
                      >
                        Discontinue
                      </button>
                    ) : (
                      <button
                        onClick={() => onToggleStatus(med.id, 'active')}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Reconciliation Dialog Modal */}
      {showReconcileModal && selectedDiscrepancy && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center space-x-3 text-rose-600 mb-3">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-lg font-black text-slate-900">
                Interactive Clinical Medication Reconciliation
              </h3>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              You are resolving a cross-facility interaction flagged by the HL7 FHIR surveillance engine:
            </p>

            <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 text-xs text-rose-900 space-y-2 mb-4">
              <div className="flex justify-between font-bold">
                <span>{selectedDiscrepancy.drugA} ({selectedDiscrepancy.facilityA})</span>
                <span>vs</span>
                <span>{selectedDiscrepancy.drugB} ({selectedDiscrepancy.facilityB})</span>
              </div>
              <p className="text-[11px] leading-relaxed">{selectedDiscrepancy.description}</p>
            </div>

            {/* Reconciliation Options */}
            <div className="space-y-3 mb-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Select Clinical Resolution
              </label>

              <label className="flex items-start space-x-3 p-3 rounded-xl border border-blue-300 bg-blue-50/50 cursor-pointer">
                <input
                  type="radio"
                  name="reconcileAction"
                  checked={selectedAction === 'discontinue_aspirin'}
                  onChange={() => setSelectedAction('discontinue_aspirin')}
                  className="mt-0.5 text-blue-600"
                />
                <div className="text-xs">
                  <span className="font-bold text-blue-900 block">
                    (Recommended) Discontinue Aspirin 81mg (North Valley) & Continue Warfarin 5mg (St. Jude)
                  </span>
                  <span className="text-blue-700">
                    Bleeding risk with dual antithrombotic therapy in non-valvular AFib outweighs primary ASCVD prevention benefit.
                  </span>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="reconcileAction"
                  checked={selectedAction === 'keep_both_rationale'}
                  onChange={() => setSelectedAction('keep_both_rationale')}
                  className="mt-0.5 text-blue-600"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">
                    Keep Both with Intensive GI Protection & INR Surveillance
                  </span>
                  <span className="text-slate-600">
                    Add Proton Pump Inhibitor (PPI) and shorten INR monitoring interval to every 2 weeks.
                  </span>
                </div>
              </label>
            </div>

            {/* Rationale text input */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Clinical Rationale & Electronic Attestation Note
              </label>
              <textarea
                rows={3}
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="Enter clinical rationale for medical audit record (e.g., Reviewed by Dr. Vance, MD / Dr. Chen, MD...)"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowReconcileModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteReconciliation}
                className="px-5 py-2 text-xs font-black bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
              >
                Sign & Execute Reconciliation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900 mb-1">Prescribe / Add Medication</h3>
            <p className="text-xs text-slate-500 mb-4">
              Real-time cross-facility interaction screening will run instantly upon submission.
            </p>

            <form onSubmit={handleAddNewMed} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Medication Name *</label>
                <input
                  type="text"
                  required
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  placeholder="e.g., Clopidogrel (Plavix) or Lisinopril"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    value={newMedDosage}
                    onChange={(e) => setNewMedDosage(e.target.value)}
                    placeholder="e.g., 75 mg oral tablet"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Frequency</label>
                  <input
                    type="text"
                    value={newMedFreq}
                    onChange={(e) => setNewMedFreq(e.target.value)}
                    placeholder="e.g., Once daily in morning"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Prescribing Facility</label>
                <select
                  value={newMedFacility}
                  onChange={(e) => setNewMedFacility(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="North Valley Family Clinic">North Valley Family Clinic</option>
                  <option value="St. Jude Memorial Hospital">St. Jude Memorial Hospital</option>
                  <option value="Metro Health System">Metro Health System</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Prescribing Clinician</label>
                <input
                  type="text"
                  value={newMedPrescriber}
                  onChange={(e) => setNewMedPrescriber(e.target.value)}
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
                  Screen & Add Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
