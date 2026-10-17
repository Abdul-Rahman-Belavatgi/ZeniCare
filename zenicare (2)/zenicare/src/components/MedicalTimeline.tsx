import React, { useState } from 'react';
import {
  Clock,
  Filter,
  Search,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Plus,
  FileText,
  User,
  Stethoscope,
  Tag,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { ClinicalEncounter } from '../types/index.ts';

interface MedicalTimelineProps {
  encounters: ClinicalEncounter[];
  onAddEncounter: (encounter: ClinicalEncounter) => void;
  isClinician: boolean;
}

export const MedicalTimeline: React.FC<MedicalTimelineProps> = ({
  encounters,
  onAddEncounter,
  isClinician,
}) => {
  const [selectedFacility, setSelectedFacility] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(encounters[0]?.id || null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding encounter
  const [newFacility, setNewFacility] = useState('Metro Health System');
  const [newType, setNewType] = useState<'Outpatient' | 'Emergency' | 'Inpatient' | 'Diagnostic'>('Outpatient');
  const [newReason, setNewReason] = useState('');
  const [newPhysician, setNewPhysician] = useState('Dr. Elena Vance, MD');
  const [newSubjective, setNewSubjective] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newAssessment, setNewAssessment] = useState('');
  const [newPlan, setNewPlan] = useState('');

  // Filtering
  const filteredEncounters = encounters.filter((enc) => {
    if (selectedFacility !== 'all' && enc.facility !== selectedFacility) return false;
    if (selectedClass !== 'all' && enc.encounterClass !== selectedClass) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchReason = enc.reasonForVisit.toLowerCase().includes(q);
      const matchFacility = enc.facility.toLowerCase().includes(q);
      const matchDoctor = enc.attendingPhysician.toLowerCase().includes(q);
      const matchSoap =
        enc.soapNotes.subjective.toLowerCase().includes(q) ||
        enc.soapNotes.assessment.toLowerCase().includes(q) ||
        enc.soapNotes.plan.toLowerCase().includes(q);
      if (!matchReason && !matchFacility && !matchDoctor && !matchSoap) return false;
    }
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCreateEncounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReason || !newAssessment) return;

    const newEnc: ClinicalEncounter = {
      id: `enc-${Date.now()}`,
      facility: newFacility,
      facilityType: newType === 'Emergency' ? 'Emergency Dept' : 'Hospital',
      encounterClass: newType,
      department: 'Clinical Care & Evaluation',
      date: new Date().toISOString().split('T')[0],
      reasonForVisit: newReason,
      attendingPhysician: newPhysician,
      specialty: 'Clinical Medicine',
      soapNotes: {
        subjective: newSubjective || 'Patient presented for clinical evaluation.',
        objective: newObjective || 'Vital signs stable.',
        assessment: newAssessment,
        plan: newPlan || 'Continue current therapeutic regimen.',
      },
      fhirEncounterId: `enc-fhir-custom-${Date.now().toString().slice(-6)}`,
      status: 'Finished',
      isSensitiveCategory: 'general',
    };

    onAddEncounter(newEnc);
    setShowAddModal(false);
    setExpandedId(newEnc.id);
    // Reset
    setNewReason('');
    setNewSubjective('');
    setNewObjective('');
    setNewAssessment('');
    setNewPlan('');
  };

  const facilities = Array.from(new Set(encounters.map((e) => e.facility)));

  return (
    <div className="space-y-6">
      {/* Title & Add Entry bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Longitudinal Cross-Hospital Timeline
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
              {filteredEncounters.length} Encounters
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Chronologically unified clinical progress notes across all connected health networks
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>{isClinician ? 'Document & Broadcast SOAP' : '+ Add Clinical Entry'}</span>
        </button>
      </div>

      {/* Multi-variable Filter Bar matching Reference Image Screen 7 */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Facility Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Facility / Institution
            </label>
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="all">All Connected Facilities</option>
              {facilities.map((fac) => (
                <option key={fac} value={fac}>
                  {fac}
                </option>
              ))}
            </select>
          </div>

          {/* Encounter Class */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Encounter Type
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="all">All Encounter Types</option>
              <option value="Outpatient">Outpatient (Ambulatory)</option>
              <option value="Emergency">Emergency / Trauma</option>
              <option value="Inpatient">Inpatient Admission</option>
              <option value="Diagnostic">Diagnostic / Lab</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Timeline Window
            </label>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="all">All Time (Longitudinal)</option>
              <option value="3m">Past 3 Months</option>
              <option value="6m">Past 6 Months</option>
              <option value="1y">Past 1 Year</option>
              <option value="2y">Past 2 Years</option>
            </select>
          </div>

          {/* Keyword Search */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Search Keywords & Notes
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes, doctor, reason..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-4 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200">
        {filteredEncounters.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
            No clinical encounters match your active filters.
          </div>
        ) : (
          filteredEncounters.map((enc) => {
            const isExpanded = expandedId === enc.id;
            return (
              <div key={enc.id} className="relative pl-12">
                {/* Timeline Node Icon */}
                <div className="absolute left-3.5 top-5 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center text-blue-600 shadow-sm z-10">
                  <Clock className="w-4 h-4" />
                </div>

                {/* Encounter Card */}
                <div
                  className={`bg-white rounded-2xl border transition-all shadow-xs ${
                    isExpanded ? 'border-blue-400 ring-2 ring-blue-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Summary Bar */}
                  <div
                    onClick={() => toggleExpand(enc.id)}
                    className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold text-slate-500 flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{enc.date}</span>
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                            enc.encounterClass === 'Emergency'
                              ? 'bg-rose-100 text-rose-800'
                              : enc.encounterClass === 'Inpatient'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {enc.encounterClass}
                        </span>
                        <span className="text-xs font-semibold text-blue-600 flex items-center space-x-1">
                          <Building2 className="w-3.5 h-3.5 text-blue-500" />
                          <span>{enc.facility}</span>
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {enc.reasonForVisit}
                      </h3>

                      <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-2">
                        <span className="font-medium text-slate-700">{enc.attendingPhysician}</span>
                        <span>•</span>
                        <span>{enc.specialty}</span>
                        <span>•</span>
                        <span className="font-mono text-[11px] text-slate-400">{enc.fhirEncounterId}</span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <span className="text-xs font-semibold text-blue-600">
                        {isExpanded ? 'Hide SOAP Note' : 'View Full SOAP'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expandable SOAP Section */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 animate-fade-in">
                      <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200">
                        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                          <span>SOAP Progress Note Documentation</span>
                          <span className="text-[10px] font-mono font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            HL7 FHIR Encounter Verified
                          </span>
                        </h4>

                        <div className="space-y-3 text-xs leading-relaxed">
                          {/* S */}
                          <div>
                            <span className="font-bold text-blue-900 inline-block w-8">S:</span>
                            <span className="font-bold text-slate-700">Subjective: </span>
                            <span className="text-slate-800">{enc.soapNotes.subjective}</span>
                          </div>

                          {/* O */}
                          <div>
                            <span className="font-bold text-blue-900 inline-block w-8">O:</span>
                            <span className="font-bold text-slate-700">Objective: </span>
                            <span className="text-slate-800">{enc.soapNotes.objective}</span>
                          </div>

                          {/* A */}
                          <div className="p-2.5 bg-amber-50/60 rounded-lg border border-amber-200">
                            <span className="font-bold text-amber-900 inline-block w-8">A:</span>
                            <span className="font-bold text-amber-900">Clinical Assessment: </span>
                            <span className="text-slate-900 font-medium">{enc.soapNotes.assessment}</span>
                          </div>

                          {/* P */}
                          <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200">
                            <span className="font-bold text-blue-900 inline-block w-8">P:</span>
                            <span className="font-bold text-blue-900">Plan & Follow-up: </span>
                            <span className="text-slate-900 font-medium">{enc.soapNotes.plan}</span>
                          </div>
                        </div>
                      </div>

                      {/* Attestation footer */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-2 pt-1">
                        <div className="flex items-center space-x-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>
                            Digitally signed by <span className="font-bold text-slate-700">{enc.attendingPhysician}</span> ({enc.specialty})
                          </span>
                        </div>
                        <div className="font-mono text-slate-400">
                          Resource: Encounter/{enc.fhirEncounterId}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Encounter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-black text-slate-900 mb-1">
              Document New Clinical Encounter
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Publishes standardized FHIR Encounter and SOAP progress note to the federated network.
            </p>

            <form onSubmit={handleCreateEncounter} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Facility</label>
                  <select
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Metro Health System">Metro Health System</option>
                    <option value="St. Jude Memorial Hospital">St. Jude Memorial Hospital</option>
                    <option value="North Valley Family Clinic">North Valley Family Clinic</option>
                    <option value="Apex Diagnostic Imaging">Apex Diagnostic Imaging</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Encounter Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Outpatient">Outpatient Consultation</option>
                    <option value="Emergency">Emergency / Trauma</option>
                    <option value="Inpatient">Inpatient Admission</option>
                    <option value="Diagnostic">Diagnostic Evaluation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Reason for Visit / Chief Complaint *
                </label>
                <input
                  type="text"
                  required
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="e.g., Post-syncopal follow-up and cardiology medication review"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attending Physician</label>
                <input
                  type="text"
                  value={newPhysician}
                  onChange={(e) => setNewPhysician(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-800">SOAP Progress Note Details</label>
                <div>
                  <span className="font-semibold text-slate-600 block mb-0.5">Subjective:</span>
                  <textarea
                    rows={2}
                    value={newSubjective}
                    onChange={(e) => setNewSubjective(e.target.value)}
                    placeholder="Patient reports..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <span className="font-semibold text-slate-600 block mb-0.5">Objective:</span>
                  <textarea
                    rows={2}
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Vitals, physical findings, diagnostics..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <span className="font-semibold text-slate-600 block mb-0.5">Assessment *:</span>
                  <textarea
                    rows={2}
                    required
                    value={newAssessment}
                    onChange={(e) => setNewAssessment(e.target.value)}
                    placeholder="Clinical diagnosis and condition status..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <span className="font-semibold text-slate-600 block mb-0.5">Plan:</span>
                  <textarea
                    rows={2}
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value)}
                    placeholder="Orders, medications, referrals, timing..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
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
                  Broadcast & Save Encounter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
