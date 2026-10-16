import React from 'react';
import {
  LayoutDashboard,
  Clock,
  ShieldCheck,
  FileText,
  LogOut,
  X,
  Shield,
} from 'lucide-react';
import { UserRole } from '../types/index.ts';

export type NavTab = 'overview' | 'timeline' | 'reports' | 'consent';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentRole: UserRole;
  discrepancyCount: number;
  reportsCount: number;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  patientName?: string;
  patientInitials?: string;
  patientDetails?: string;
  doctorName?: string;
  doctorDetails?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentRole,
  reportsCount,
  onLogout,
  isMobileOpen,
  onCloseMobile,
  patientName = 'Aarav Sharma',
  patientInitials = 'AS',
  patientDetails = 'ID: #MUM-449102 • B+',
  doctorName = 'Dr. Meera Joshi, MD',
  doctorDetails = 'Senior Cardiologist • Lilavati Hospital',
}) => {
  const isAarav = patientName.includes('Aarav');
  const abhaId = isAarav ? '91-4491-0283-9912' : '14-8820-4109-2234';
  const patientId = isAarav ? 'MUM-449102' : 'NX-88204';
  const bloodType = isAarav ? 'B+' : 'O+';

  const navItems = [
    { id: 'overview', label: 'Clinical Overview', icon: LayoutDashboard },
    { id: 'timeline', label: 'Timeline & History', icon: Clock },
    {
      id: 'reports',
      label: 'Upload & Records',
      icon: FileText,
      badge: reportsCount > 0 ? `${reportsCount}` : undefined,
    },
    {
      id: 'consent',
      label: 'Doctors & Consent',
      icon: ShieldCheck,
    },
  ];

  const handleItemClick = (id: NavTab) => {
    onSelectTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={`bg-white border-r border-slate-200 flex flex-col shrink-0 h-full z-40 transition-all duration-200 ease-in-out ${
          isMobileOpen
            ? 'fixed inset-y-0 left-0 w-72 shadow-xl translate-x-0'
            : 'hidden md:flex md:w-64 lg:w-72 md:static md:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 tracking-wider">
                {currentRole === 'patient' ? patientInitials : 'MJ'}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900 truncate">
                  {currentRole === 'patient' ? patientName : doctorName}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  {currentRole === 'patient' ? (
                    <span className="flex items-center space-x-1">
                      <span>Age {isAarav ? '38' : '42'}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700">Blood {bloodType}</span>
                    </span>
                  ) : (
                    doctorDetails
                  )}
                </p>
              </div>
            </div>

            {isMobileOpen && (
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 md:hidden"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {currentRole === 'patient' && (
            <div className="mt-3 p-2 rounded-md bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium mb-1">
                <span className="flex items-center space-x-1 font-semibold text-slate-700">
                  <Shield className="w-3 h-3 text-sky-700" />
                  <span>ABHA National Health ID</span>
                </span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  Verified
                </span>
              </div>
              <div className="font-mono text-xs font-semibold text-slate-900 tracking-tight">
                {abhaId}
              </div>
            </div>
          )}
        </div>

        <nav className="py-3 px-3 space-y-0.5 flex-1 overflow-y-auto">
          <div className="px-3 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id as NavTab)}
                className={`w-full group relative flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold border border-slate-300/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-sky-700' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200 bg-slate-50/60 space-y-2 mt-auto">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-400" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};
