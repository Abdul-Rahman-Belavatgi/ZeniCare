import React, { useState } from 'react';
import {
  Activity,
  UserCheck,
  Stethoscope,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Smartphone,
  X,
} from 'lucide-react';
import { UserRole } from '../types/index.ts';

interface PublicLandingAndAuthProps {
  onSelectRoleAndLogin: (role: UserRole, persona?: 'aarav' | 'meera') => void;
}

export const PublicLandingAndAuth: React.FC<PublicLandingAndAuthProps> = ({
  onSelectRoleAndLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white mx-auto shadow-xl">
            <Activity className="w-8 h-8 text-sky-400" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-4">ZeniCare</h1>
          <p className="text-sm text-slate-500 mt-1">Healthcare Continuity Platform</p>
        </div>

        {/* Login Form */}
        <form className="space-y-4 pt-4" onSubmit={(e) => { e.preventDefault(); onSelectRoleAndLogin('patient', 'aarav'); }}>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email / ABHA ID</label>
            <input type="text" placeholder="aarav.sharma@zenicare.in" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="••••••••••••" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center text-slate-600"><input type="checkbox" className="mr-2" /> Remember Me</label>
            <button type="button" onClick={() => setIsForgotModalOpen(true)} className="text-sky-600 font-semibold">Forgot Password?</button>
          </div>
          <button type="submit" className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold transition-all">Sign In</button>
        </form>

        <div className="text-center text-sm text-slate-600">
          Don't have an account? <button onClick={() => setIsSignUpModalOpen(true)} className="text-sky-600 font-semibold">Sign Up</button>
        </div>

        {/* Quick Demo Access */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Quick Demo Access</p>
          <button onClick={() => onSelectRoleAndLogin('patient', 'aarav')} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2">
            <UserCheck size={18} />
            <span>Login as Aarav Sharma (Patient)</span>
          </button>
          <button onClick={() => onSelectRoleAndLogin('clinician', 'meera')} className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2">
            <Stethoscope size={18} />
            <span>Login as Dr. Meera Joshi (Doctor)</span>
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full space-y-4 text-center">
            <h2 className="text-xl font-bold">Reset Credentials</h2>
            <p className="text-sm text-slate-600">Via ABHA Registered Mobile (+91 ••••• ••912)</p>
            <input type="text" placeholder="Enter OTP" className="w-full px-4 py-2 border rounded-lg text-center" />
            <button onClick={() => { setIsForgotModalOpen(false); alert("Success!"); }} className="w-full py-2 bg-sky-600 text-white rounded-lg font-bold">Verify & Reset</button>
            <button onClick={() => setIsForgotModalOpen(false)} className="text-slate-500 text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {isSignUpModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full space-y-4">
            <h2 className="text-xl font-bold text-center">Register with ABHA</h2>
            <input type="text" placeholder="Full Name" className="w-full px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="14-digit ABHA ID" className="w-full px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="Mobile Number" className="w-full px-4 py-2 border rounded-lg" />
            <select className="w-full px-4 py-2 border rounded-lg"><option>Patient</option><option>Doctor</option></select>
            <button onClick={() => { setIsSignUpModalOpen(false); onSelectRoleAndLogin('patient', 'aarav'); }} className="w-full py-2 bg-sky-600 text-white rounded-lg font-bold">Create Account</button>
            <button onClick={() => setIsSignUpModalOpen(false)} className="w-full text-slate-500 text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};
