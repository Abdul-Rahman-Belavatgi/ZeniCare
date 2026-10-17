import React, { useState } from 'react';
import {
  User,
  Shield,
  Edit3,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  Heart,
  Droplet,
  FileCheck,
  Check,
  Activity,
  Award,
} from 'lucide-react';
import { PatientDemographics, ChronicCondition, AllergyAlert } from '../types/index.ts';

interface PatientProfileProps {
  patient: PatientDemographics;
  conditions: ChronicCondition[];
  allergies: AllergyAlert[];
  onUpdatePatient: (updated: PatientDemographics) => void;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({
  patient,
  conditions,
  allergies,
  onUpdatePatient,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(patient.phone);
  const [email, setEmail] = useState(patient.email);
  const [address, setAddress] = useState(patient.address);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePatient({
      ...patient,
      phone,
      email,
      address,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
            AM
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {patient.fullName}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
                Master Patient Index: {patient.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              FHIR Identifier: {patient.mrn} • Non-binary • 42 Years Old
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1 animate-fade-in">
              <Check className="w-4 h-4" />
              <span>Demographics Updated</span>
            </span>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-all shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Demographics'}</span>
          </button>
        </div>
      </div>

      {/* Edit Form Modal/Drawer if editing */}
      {isEditing && (
        <form
          onSubmit={handleSave}
          className="bg-blue-50/70 border border-blue-200 rounded-2xl p-6 shadow-xs space-y-4"
        >
          <h3 className="text-sm font-bold text-blue-900">Update Patient Contact Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Residential Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs"
            >
              Save Changes to FHIR Node
            </button>
          </div>
        </form>
      )}

      {/* Main 2-Column Info Grid matching Reference Image Screen 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Personal Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Personal Information</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Identity Verified
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Full Legal Name</span>
              <span className="text-slate-900 font-bold text-sm">{patient.fullName}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Date of Birth</span>
              <span className="text-slate-900 font-semibold">{patient.birthDate} ({patient.age} yrs)</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Gender Identity</span>
              <span className="text-slate-900 font-semibold">{patient.gender}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Primary Language</span>
              <span className="text-slate-900 font-semibold">English (US)</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Primary Phone</span>
              <span className="text-slate-900 font-semibold flex items-center space-x-1 mt-0.5">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{patient.phone}</span>
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Secure Email</span>
              <span className="text-slate-900 font-semibold flex items-center space-x-1 mt-0.5 truncate">
                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{patient.email}</span>
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 font-medium block">Residential Address</span>
              <span className="text-slate-900 font-semibold flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{patient.address}</span>
              </span>
            </div>
          </div>

          {/* Emergency Proxy */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Designated Emergency Contact / Healthcare Proxy
            </h4>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">{patient.emergencyContact.name}</p>
                <p className="text-slate-500">{patient.emergencyContact.relationship}</p>
              </div>
              <a
                href={`tel:${patient.emergencyContact.phone}`}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-semibold hover:bg-blue-100 transition-colors"
              >
                {patient.emergencyContact.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Right: Medical Baseline Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Heart className="w-4 h-4 text-rose-600" />
              <span>Medical Baseline Information</span>
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              HL7 US-Core Conforming
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-red-50/70 rounded-xl border border-red-200">
              <span className="text-red-700 font-medium block text-[11px]">Blood Group (ABO/Rh)</span>
              <span className="text-red-900 font-black text-xl">{patient.bloodGroup}</span>
              <span className="text-[10px] text-red-600 block mt-0.5">Universal Red Cell Donor</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-medium block text-[11px]">Anthropometrics</span>
              <span className="text-slate-900 font-bold text-base">{patient.weight}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{patient.height} • BMI: {patient.bmi}</span>
            </div>
          </div>

          {/* Conditions list */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wide">
              Documented Chronic Conditions (ICD-10)
            </span>
            <div className="space-y-2">
              {conditions.map((cond) => (
                <div
                  key={cond.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="font-mono font-bold text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                      {cond.icd10}
                    </span>
                    <span className="font-semibold text-slate-800 truncate">{cond.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0">
                    {cond.clinicalStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Care Provider */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wide">
              Attending Primary Care Clinic
            </span>
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-blue-900">{patient.primaryCarePhysician.name}</p>
                  <p className="text-blue-700">{patient.primaryCarePhysician.facility}</p>
                </div>
                <span className="text-xs text-blue-800 font-mono font-semibold">
                  {patient.primaryCarePhysician.phone}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
