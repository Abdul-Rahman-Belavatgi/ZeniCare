import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  UserCheck,
  Plus,
  Clock,
  AlertTriangle,
  History,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
  Building2,
  Trash2,
} from 'lucide-react';
import { PrivacyConsentConfig, SecurityAuditEntry } from '../types/index.ts';

interface ConsentCenterProps {
  consentConfig: PrivacyConsentConfig;
  onUpdateConsentConfig: (updated: PrivacyConsentConfig) => void;
  auditTrail: SecurityAuditEntry[];
  onAddAuditEntry: (entry: SecurityAuditEntry) => void;
}

export const ConsentCenter: React.FC<ConsentCenterProps> = ({
  consentConfig,
  onUpdateConsentConfig,
  auditTrail,
  onAddAuditEntry,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'expired'>('active');
  const [showGrantModal, setShowGrantModal] = useState(false);

  // New Grant Form state
  const [doctorName, setDoctorName] = useState('');
  const [facility, setFacility] = useState('Metro Health System');
  const [role, setRole] = useState('Specialist Physician');
  const [durationDays, setDurationDays] = useState('30');

  // Toggle sensitive categories
  const toggleCategory = (key: 'excludeBehavioralHealth' | 'excludeSubstanceUse' | 'excludeGenetics') => {
    const updated = {
      ...consentConfig,
      [key]: !consentConfig[key],
    };
    onUpdateConsentConfig(updated);

    onAddAuditEntry({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actorName: 'Alex Morgan (Patient)',
      actorRole: 'Patient / Health Sovereign',
      facility: 'MediBridge Privacy Engine',
      action: 'READ_RESOURCE',
      resourceAccessed: `Consent/PolicyUpdate (${key} = ${updated[key]})`,
      purposeOfUse: 'Patient Access',
      ipAddress: '76.104.18.23',
      status: 'Authorized',
    });
  };

  const handleRevokeGrant = (grantId: string) => {
    const updatedGrants = consentConfig.activeGrants.map((g) =>
      g.id === grantId ? { ...g, status: 'Revoked' as const } : g
    );
    onUpdateConsentConfig({
      ...consentConfig,
      activeGrants: updatedGrants,
    });
  };

  const handleCreateGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName) return;

    const days = parseInt(durationDays, 10);
    const expiresAt = new Date(Date.now() + days * 86400000).toISOString();

    const newGrant = {
      id: `grant-${Date.now()}`,
      doctorName,
      facility,
      role,
      scope: ['Condition', 'MedicationRequest', 'Observation', 'DiagnosticReport'],
      grantedAt: new Date().toISOString().split('T')[0],
      expiresAt,
      status: 'Active' as const,
    };

    onUpdateConsentConfig({
      ...consentConfig,
      activeGrants: [newGrant, ...consentConfig.activeGrants],
    });

    onAddAuditEntry({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actorName: 'Alex Morgan (Patient)',
      actorRole: 'Patient / Health Sovereign',
      facility: 'MediBridge Privacy Engine',
      action: 'WRITE_ENCOUNTER',
      resourceAccessed: `Consent/GrantTo-${doctorName}`,
      purposeOfUse: 'Patient Access',
      ipAddress: '76.104.18.23',
      status: 'Authorized',
    });

    setShowGrantModal(false);
    setDoctorName('');
  };

  const visibleGrants = consentConfig.activeGrants.filter((g) =>
    activeTab === 'active' ? g.status === 'Active' : g.status === 'Expired' || g.status === 'Revoked'
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Granular Consent & Patient Sovereignty Center
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
              Zero-Trust Architecture
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Empowering patients with absolute control over record sharing, sensitive category exclusions, and audit transparency
          </p>
        </div>

        <button
          onClick={() => setShowGrantModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Grant Doctor Access</span>
        </button>
      </div>

      {/* Sensitive Category Exclusions (1-Click Privacy Switches) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <EyeOff className="w-4 h-4 text-rose-600" />
            <span>Category-Specific Sensitive Record Exclusions</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Turn ON to blackout and withhold specific categories of medical records from external clinician queries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Behavioral Health */}
          <div
            onClick={() => toggleCategory('excludeBehavioralHealth')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              consentConfig.excludeBehavioralHealth
                ? 'bg-rose-50/70 border-rose-300'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">Behavioral & Psychiatry</span>
              <span
                className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors ${
                  consentConfig.excludeBehavioralHealth ? 'bg-rose-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-white block shadow-xs"></span>
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
              Excludes psychotherapy notes, psychiatric consultations, and mental health diagnoses.
            </p>
            <span
              className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded ${
                consentConfig.excludeBehavioralHealth ? 'bg-rose-200 text-rose-800' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {consentConfig.excludeBehavioralHealth ? 'EXCLUDED / BLACKED OUT' : 'SHARED WITH CLINICIANS'}
            </span>
          </div>

          {/* Substance Use */}
          <div
            onClick={() => toggleCategory('excludeSubstanceUse')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              consentConfig.excludeSubstanceUse
                ? 'bg-rose-50/70 border-rose-300'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">Substance Use / 42 CFR</span>
              <span
                className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors ${
                  consentConfig.excludeSubstanceUse ? 'bg-rose-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-white block shadow-xs"></span>
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
              Withholds toxicology reports, alcohol/substance rehabilitation records under federal 42 CFR Part 2.
            </p>
            <span
              className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded ${
                consentConfig.excludeSubstanceUse ? 'bg-rose-200 text-rose-800' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {consentConfig.excludeSubstanceUse ? 'EXCLUDED / BLACKED OUT' : 'SHARED WITH CLINICIANS'}
            </span>
          </div>

          {/* Genetics & Reproductive */}
          <div
            onClick={() => toggleCategory('excludeGenetics')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              consentConfig.excludeGenetics
                ? 'bg-rose-50/70 border-rose-300'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">Genomics & Reproductive</span>
              <span
                className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors ${
                  consentConfig.excludeGenetics ? 'bg-rose-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-white block shadow-xs"></span>
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
              Hides genetic sequencing variants, carrier tests, and reproductive health histories.
            </p>
            <span
              className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded ${
                consentConfig.excludeGenetics ? 'bg-rose-200 text-rose-800' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {consentConfig.excludeGenetics ? 'EXCLUDED / BLACKED OUT' : 'SHARED WITH CLINICIANS'}
            </span>
          </div>
        </div>
      </div>

      {/* Sharing Permissions Table matching Reference Image Screen 11 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center border-b border-slate-200 px-6 pt-4 gap-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'active'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Active Sharing Grants ({consentConfig.activeGrants.filter((g) => g.status === 'Active').length})
          </button>
          <button
            onClick={() => setActiveTab('expired')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'expired'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Expired / Revoked ({consentConfig.activeGrants.filter((g) => g.status !== 'Active').length})
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {visibleGrants.map((grant) => (
            <div key={grant.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                  {grant.doctorName.slice(4, 6)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{grant.doctorName}</h4>
                  <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{grant.facility}</span>
                    <span>•</span>
                    <span>{grant.role}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Scopes: {grant.scope.join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 self-end sm:self-center">
                <div className="text-right text-xs">
                  <span className="text-slate-400 block text-[10px]">Expires On</span>
                  <span className="font-semibold text-slate-700 font-mono">
                    {grant.expiresAt.slice(0, 10)}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                    grant.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : grant.status === 'Expired'
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {grant.status}
                </span>

                {grant.status === 'Active' && (
                  <button
                    onClick={() => handleRevokeGrant(grant.id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                    title="Revoke Permission Immediately"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Immutable Security Audit Trail */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <History className="w-4 h-4 text-blue-600" />
              <span>Immutable Security & Access Audit Trail</span>
            </h3>
            <p className="text-xs text-slate-500">
              Cryptographic log of all clinician queries, resource reads, and break-glass overrides
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Audit Ledger Tamper-Evident
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Timestamp (UTC)</th>
                <th className="py-2.5 px-4">Clinician / Actor</th>
                <th className="py-2.5 px-4">Facility & Origin IP</th>
                <th className="py-2.5 px-4">Resource Accessed</th>
                <th className="py-2.5 px-4">Purpose of Use</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditTrail.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-mono text-slate-500">{entry.timestamp}</td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">
                    <div>{entry.actorName}</div>
                    <div className="text-[10px] font-normal text-slate-400">{entry.actorRole}</div>
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">
                    <div>{entry.facility}</div>
                    <div className="text-[10px] font-mono text-slate-400">{entry.ipAddress}</div>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-slate-700 text-[11px]">
                    {entry.resourceAccessed}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700">
                      {entry.purposeOfUse}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        entry.status === 'Authorized'
                          ? 'bg-emerald-100 text-emerald-800'
                          : entry.status === 'Break-Glass Flagged'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grant Access Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-black text-slate-900 mb-1">
              Grant Time-Bound Clinician Access
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Authorize a licensed provider to view your longitudinal health record for a defined period.
            </p>

            <form onSubmit={handleCreateGrant} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor / Clinician Name *</label>
                <input
                  type="text"
                  required
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g., Dr. Marcus Sterling, MD"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Facility / Institution</label>
                <input
                  type="text"
                  value={facility}
                  onChange={(e) => setFacility(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Clinical Specialty</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Access Duration</label>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">24 Hours (Urgent Care)</option>
                    <option value="7">7 Days (Short Consult)</option>
                    <option value="30">30 Days (Standard Episode)</option>
                    <option value="365">1 Year (Primary Care / Specialist)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowGrantModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md"
                >
                  Sign & Grant Access Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
