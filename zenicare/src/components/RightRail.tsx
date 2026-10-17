import React, { useState } from 'react';
import { ShieldCheck, QrCode, ShieldAlert, AlertCircle, KeyRound, X, CheckCircle2 } from 'lucide-react';
import { DrugDiscrepancy } from '../utils/healthLogic.ts';
import { PrivacyConsentConfig } from '../types/index.ts';

interface RightRailProps {
  consentConfig: PrivacyConsentConfig;
  discrepancies: DrugDiscrepancy[];
}

export const RightRail: React.FC<RightRailProps> = ({ consentConfig, discrepancies }) => {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('727-725');
  const [showReconcileModal, setShowReconcileModal] = useState(false);
  const [localGrants, setLocalGrants] = useState(consentConfig.activeGrants);

  const handleGenerateOtp = () => {
    const code = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;
    setGeneratedOtp(code);
    setShowOtpModal(true);
  };

  const handleRevoke = (grantId: string) => {
    setLocalGrants((prev) => prev.filter((g) => g.id !== grantId));
  };

  const activeDisplayGrants = (localGrants.length > 0 ? localGrants : consentConfig.activeGrants)
    .filter((g) => g.status === 'Active')
    .slice(0, 3);

  return (
    <>
      <div className="hidden xl:flex flex-col w-[30%] border-l border-slate-200 bg-white p-6 space-y-8 h-full overflow-y-auto">
        {/* Active Consent & Access */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Consent</h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {activeDisplayGrants.length} active
            </span>
          </div>

          <div className="space-y-3">
            {activeDisplayGrants.length === 0 ? (
              <p className="text-xs text-slate-400">No active external doctor access.</p>
            ) : (
              activeDisplayGrants.map((grant) => (
                <div key={grant.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-all">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-900">{grant.doctorName}</span>
                    <button
                      onClick={() => handleRevoke(grant.id)}
                      className="text-[10px] font-bold text-rose-600 hover:text-rose-700 hover:underline"
                    >
                      Revoke
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500">{grant.facility}</p>
                  <p className="text-[10px] font-semibold text-emerald-700 mt-1 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Valid until {grant.expiresAt.slice(0, 10)}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* QR & OTP Quick Share */}
        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Share</h3>
          <button
            onClick={handleGenerateOtp}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
          >
            <QrCode size={16} />
            <span>Generate 6-digit OTP / QR</span>
          </button>
          <p className="text-[11px] text-slate-400 mt-2 text-center">
            Provides 15-minute emergency access to clinic kiosks
          </p>
        </section>

        {/* Interaction Guard */}
        {discrepancies.length > 0 && (
          <section className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
            <div className="flex items-center space-x-2 text-amber-900 mb-2">
              <ShieldAlert size={16} className="text-amber-600" />
              <h3 className="text-xs font-black">Polypharmacy Guard</h3>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed mb-3">
              {discrepancies.length} clinical safety alert(s) detected across connected provider records.
            </p>
            <button
              onClick={() => setShowReconcileModal(true)}
              className="w-full py-2 bg-amber-200/80 hover:bg-amber-200 text-amber-900 rounded-lg font-bold text-xs transition-all"
            >
              View Reconciliation ({discrepancies.length})
            </button>
          </section>
        )}
      </div>

      {/* Quick Share Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-black text-slate-900">Emergency Quick-Share Token</h3>
              <p className="text-xs text-slate-500 mt-1">
                Scan QR or enter the OTP on a hospital terminal for 15-minute emergency access.
              </p>
            </div>

            <div className="p-4 bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=ZENICARE-EMERGENCY-AUTH-${generatedOtp}`}
                alt="Emergency QR"
                className="w-36 h-36 rounded-lg shadow-sm"
              />
              <span className="text-[10px] font-mono text-slate-400 mt-2">
                ZENICARE-AUTH-{generatedOtp}
              </span>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                Single-Use 6-Digit OTP
              </span>
              <span className="text-3xl font-black font-mono tracking-widest text-emerald-400">
                {generatedOtp}
              </span>
            </div>

            <button
              onClick={() => setShowOtpModal(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all"
            >
              Close & Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Discrepancy Reconciliation Modal */}
      {showReconcileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-amber-700">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-black text-slate-900">Drug Interaction & Polypharmacy Guard</h3>
              </div>
              <button
                onClick={() => setShowReconcileModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {discrepancies.map((disc, idx) => (
                <div key={idx} className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-900">{disc.drugA} × {disc.drugB}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-200 text-amber-900">
                      {disc.severity || 'Moderate Risk'}
                    </span>
                  </div>
                  <p className="text-xs text-amber-800">{disc.description}</p>
                  <p className="text-[10px] text-amber-700 font-semibold pt-1">
                    Recommendation: {disc.recommendation || 'Consult prescribing clinician prior to co-administration.'}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowReconcileModal(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
              >
                Acknowledge Discrepancies
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};