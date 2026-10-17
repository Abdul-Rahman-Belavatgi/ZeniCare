import React from 'react';
import {
  ShieldAlert,
  Activity,
  QrCode,
  UserCheck,
  Stethoscope,
  RefreshCw,
  Globe,
  Menu,
} from 'lucide-react';
import { UserRole } from '../types/index.ts';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenEmergencyCard: () => void;
  onOpenDiscrepancyHub: () => void;
  discrepancyCount: number;
  isSyncing: boolean;
  onTriggerSync: () => void;
  onShowPublicPortal: () => void;
  onToggleMobileMenu?: () => void;
  activeRegion?: 'mumbai' | 'global';
  onToggleRegion?: () => void;
  patientName?: string;
  doctorName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenEmergencyCard,
  onOpenDiscrepancyHub,
  discrepancyCount,
  isSyncing,
  onTriggerSync,
  onShowPublicPortal,
  onToggleMobileMenu,
  activeRegion = 'mumbai',
  onToggleRegion,
  patientName = 'Aarav Sharma',
  doctorName = 'Dr. Meera Joshi, MD',
}) => {
  return (
    <header className="bg-white border-b border-slate-200 shrink-0 z-30 shadow-xs">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Toggle & Full Branding */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleMobileMenu}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden border border-slate-200"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* MediBridge Logo & Subtitle (Matches Reference Screenshot) */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-black tracking-tight text-slate-900">
                    Zeni<span className="text-blue-600">Care</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                    HL7® FHIR® R4
                  </span>
                </div>
                <p className="hidden sm:block text-[11px] text-slate-400 font-medium">
                  Federated Longitudinal Health Record • Patient Sovereign
                </p>
              </div>
            </div>
          </div>

          {/* Right: Federated Interoperability Tools & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Sync All Providers Engine */}
            <button
              onClick={onTriggerSync}
              disabled={isSyncing}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                isSyncing
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
              }`}
              title="Sync federated data from Epic, Cerner, AthenaHealth, Quest"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-600' : 'text-slate-500'}`} />
              <span className="hidden md:inline">
                {isSyncing ? 'Syncing...' : '5 EHR Providers Linked'}
              </span>
            </button>

            {/* Cross-Facility Safety Discrepancy Alert */}
            {discrepancyCount > 0 && (
              <button
                onClick={onOpenDiscrepancyHub}
                className="relative flex items-center space-x-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold animate-pulse transition-all shadow-2xs"
                title="Cross-facility drug interaction flagged between St. Jude and North Valley"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span className="hidden sm:inline">1 Safety Discrepancy</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                </span>
              </button>
            )}

            {/* Emergency Passport Button */}
            <button
              onClick={onOpenEmergencyCard}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">Emergency Passport</span>
            </button>

            {/* Regional Mode Toggle (Mumbai India vs Global) */}
            {onToggleRegion && (
              <button
                onClick={onToggleRegion}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                title="Click to toggle between Mumbai Healthcare Network and Global Demo"
              >
                <span>{activeRegion === 'mumbai' ? '🇮🇳 Mumbai' : '🌐 Global'}</span>
              </button>
            )}

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => onRoleChange('patient')}
                className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  currentRole === 'patient'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{patientName} (Patient)</span>
                <span className="lg:hidden">Patient</span>
              </button>

              <button
                onClick={() => onRoleChange('clinician')}
                className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  currentRole === 'clinician'
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{doctorName.split(',')[0]} (Doctor)</span>
                <span className="lg:hidden">Doctor</span>
              </button>
            </div>

            {/* Public/Auth view toggle button */}
            <button
              onClick={onShowPublicPortal}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 shadow-2xs"
              title="Return to Public Portal & Sign In"
            >
              <Globe className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

