import React, { useState } from 'react';
import {
  Building2,
  RefreshCw,
  Plus,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Wifi,
  Database,
  Lock,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ConnectedProvider } from '../types/index.ts';

interface ConnectedProvidersProps {
  providers: ConnectedProvider[];
  onAddProvider: (provider: ConnectedProvider) => void;
  isSyncing: boolean;
  onTriggerSync: () => void;
}

export const ConnectedProviders: React.FC<ConnectedProvidersProps> = ({
  providers,
  onAddProvider,
  isSyncing,
  onTriggerSync,
}) => {
  const [showOAuthModal, setShowOAuthModal] = useState(false);
  const [selectedHospitalVendor, setSelectedHospitalVendor] = useState('Kaiser Permanente Northwest');
  const [vendorEHR, setVendorEHR] = useState<'Epic Systems' | 'Cerner / Oracle Health' | 'AthenaHealth'>('Epic Systems');
  const [oauthStep, setOauthStep] = useState<'select' | 'authorizing' | 'success'>('select');

  const handleStartOAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setOauthStep('authorizing');
    setTimeout(() => {
      const newProv: ConnectedProvider = {
        id: `prov-${Date.now()}`,
        name: selectedHospitalVendor,
        networkType: vendorEHR,
        status: 'Connected',
        lastSynced: 'Just now',
        recordsCount: 22,
        fhirEndpoint: `https://fhir.${selectedHospitalVendor.toLowerCase().replace(/[^a-z]/g, '')}.org/r4`,
        authMethod: 'SMART-on-FHIR OAuth 2.0',
        latencyMs: 120,
      };
      onAddProvider(newProv);
      setOauthStep('success');
      setTimeout(() => {
        setShowOAuthModal(false);
        setOauthStep('select');
      }, 1500);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Title & Sync All Providers */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Connected Providers & Federated HIE Directory
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
              {providers.length} Nodes Synchronized
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standardized HL7® FHIR® R4 and SMART-on-FHIR OAuth 2.0 federated bridges across disparate vendors
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onTriggerSync}
            disabled={isSyncing}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-xs ${
              isSyncing
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-amber-600' : 'text-slate-600'}`} />
            <span>{isSyncing ? 'Synchronizing FHIR Repositories...' : 'Sync All Providers Now'}</span>
          </button>

          <button
            onClick={() => setShowOAuthModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Connect New Hospital (SMART OAuth)</span>
          </button>
        </div>
      </div>

      {/* Syncing Progress Banner if active */}
      {isSyncing && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-900 animate-pulse">
          <div className="flex items-center justify-between mb-2 font-bold">
            <span className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
              <span>Querying Federated FHIR Nodes (Epic, Cerner, AthenaHealth, Quest)...</span>
            </span>
            <span>82% Ingestion Complete</span>
          </div>
          <div className="w-full bg-amber-200 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-600 h-full rounded-full w-4/5 transition-all duration-500"></div>
          </div>
        </div>
      )}

      {/* Grid of Providers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((prov) => (
          <div
            key={prov.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>{prov.status}</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-4">{prov.name}</h3>
              <p className="text-xs text-blue-600 font-semibold mt-0.5">{prov.networkType}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Ingested Records:</span>
                  <span className="font-bold text-slate-900">{prov.recordsCount} FHIR resources</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Last Automated Sync:</span>
                  <span className="font-medium text-slate-700">{prov.lastSynced}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Network Latency:</span>
                  <span className="font-mono text-emerald-600 font-semibold">{prov.latencyMs} ms (Healthy)</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono truncate">
                <span className="truncate">{prov.fhirEndpoint}</span>
                <span className="shrink-0 text-slate-300 ml-2">R4</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SMART-on-FHIR OAuth 2.0 Simulation Modal */}
      {showOAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            {oauthStep === 'select' && (
              <form onSubmit={handleStartOAuth} className="space-y-4">
                <div className="flex items-center space-x-3 text-blue-600">
                  <Lock className="w-6 h-6" />
                  <h3 className="text-base font-black text-slate-900">
                    SMART-on-FHIR OAuth 2.0 Provider Connection
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Connect an external health system or clinic using standardized OAuth 2.0 client credentials. You maintain full cryptographic sovereignty over your medical data.
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Target Health System / Organization
                    </label>
                    <select
                      value={selectedHospitalVendor}
                      onChange={(e) => setSelectedHospitalVendor(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      <option value="Kaiser Permanente Northwest">Kaiser Permanente Northwest</option>
                      <option value="Cleveland Clinic Foundation">Cleveland Clinic Foundation</option>
                      <option value="Johns Hopkins Medicine">Johns Hopkins Medicine</option>
                      <option value="Mayo Clinic Rochester">Mayo Clinic Rochester</option>
                      <option value="UW Medicine Harborview">UW Medicine Harborview</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Underlying EHR Vendor Platform
                    </label>
                    <select
                      value={vendorEHR}
                      onChange={(e) => setVendorEHR(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      <option value="Epic Systems">Epic Systems (Interconnect FHIR Gateway)</option>
                      <option value="Cerner / Oracle Health">Cerner Millennium / Oracle Health</option>
                      <option value="AthenaHealth">AthenaHealth Open API</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                    <span className="font-bold text-slate-800 block">Requested OAuth Scopes:</span>
                    <p className="font-mono text-[10px] text-blue-700">
                      patient/*.read, launch/patient, openid, fhirUser, offline_access
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowOAuthModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
                  >
                    Authorize SMART-on-FHIR Handshake
                  </button>
                </div>
              </form>
            )}

            {oauthStep === 'authorizing' && (
              <div className="py-8 text-center space-y-4">
                <RefreshCw className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">
                  Authenticating with {selectedHospitalVendor}...
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Exchanging authorization code for patient-scoped bearer token under RFC 7519 JWT standards.
                </p>
              </div>
            )}

            {oauthStep === 'success' && (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-black text-slate-900">
                  Provider Successfully Federated!
                </h4>
                <p className="text-xs text-slate-600">
                  Records from {selectedHospitalVendor} are now synchronized with your longitudinal passport.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
