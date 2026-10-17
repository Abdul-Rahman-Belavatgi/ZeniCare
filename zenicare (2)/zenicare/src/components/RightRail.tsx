import React from 'react';
import { ShieldCheck, QrCode, ShieldAlert, AlertCircle } from 'lucide-react';
import { DrugDiscrepancy } from '../utils/healthLogic.ts';
import { PrivacyConsentConfig } from '../types/index.ts';

interface RightRailProps {
  consentConfig: PrivacyConsentConfig;
  discrepancies: DrugDiscrepancy[];
}

export const RightRail: React.FC<RightRailProps> = ({ consentConfig, discrepancies }) => {
  return (
    <div className="hidden xl:flex flex-col w-[30%] border-l border-slate-200 bg-white p-6 space-y-8 h-full overflow-y-auto">
      {/* Active Consent & Access */}
      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Active Consent</h3>
        <div className="space-y-3">
          {consentConfig.activeGrants.slice(0, 2).map((grant) => (
            <div key={grant.id} className="p-3 border border-slate-200 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-semibold text-slate-900">{grant.doctorName}</span>
                <button className="text-[10px] font-bold text-red-600 hover:text-red-700">Revoke</button>
              </div>
              <p className="text-[10px] text-slate-500">{grant.facility}</p>
              <p className="text-[10px] font-medium text-emerald-700 mt-1">Expires in 12 hrs</p>
            </div>
          ))}
        </div>
      </section>

      {/* QR & OTP */}
      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Share</h3>
        <button className="w-full flex items-center justify-center space-x-2 py-3 bg-sky-600 text-white rounded-lg font-bold text-xs hover:bg-sky-700">
          <QrCode size={16} />
          <span>Generate 6-digit OTP / QR</span>
        </button>
      </section>

      {/* Interaction Guard */}
      {discrepancies.length > 0 && (
        <section className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <div className="flex items-center space-x-2 text-amber-800 mb-2">
            <ShieldAlert size={16} />
            <h3 className="text-xs font-bold">Polypharmacy Guard</h3>
          </div>
          <p className="text-[10px] text-amber-700 mb-3">
            Duplicate therapeutic classes detected across providers.
          </p>
          <button className="w-full py-2 bg-amber-100 text-amber-800 rounded font-semibold text-[10px] hover:bg-amber-200">
            View Reconciliation
          </button>
        </section>
      )}
    </div>
  );
};
