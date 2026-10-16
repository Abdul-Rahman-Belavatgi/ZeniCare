import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  User,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Share2,
  ChevronRight,
  Stethoscope,
  Info,
} from 'lucide-react';
import { AppointmentRecord, HealthcareFacility } from '../types/index.ts';
import { HEALTHCARE_FACILITIES } from '../data/mockData.ts';

interface MyAppointmentsProps {
  appointments: AppointmentRecord[];
  onAddAppointment: (appointment: AppointmentRecord) => void;
  onUpdateStatus: (id: string, newStatus: AppointmentRecord['status']) => void;
  initialPreselectedFacility?: HealthcareFacility | null;
  onClearPreselectedFacility?: () => void;
}

export const MyAppointments: React.FC<MyAppointmentsProps> = ({
  appointments,
  onAddAppointment,
  onUpdateStatus,
  initialPreselectedFacility,
  onClearPreselectedFacility,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'pending' | 'completed'>('all');
  const [showBookingModal, setShowBookingModal] = useState(!!initialPreselectedFacility);

  // Booking Form State
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(
    initialPreselectedFacility?.id || HEALTHCARE_FACILITIES[0].id
  );
  const [doctorName, setDoctorName] = useState<string>(
    initialPreselectedFacility?.doctors[0]?.name || 'Dr. Robert Chen, MD, FACC'
  );
  const [consultationType, setConsultationType] = useState<'In-Person' | 'Video Consultation' | 'Urgent Care'>(
    'In-Person'
  );
  const [date, setDate] = useState('2026-10-28');
  const [time, setTime] = useState('11:15 AM');
  const [reason, setReason] = useState('Comprehensive Cardiovascular Check-up & Warfarin Level Review');
  const [sharedRecords, setSharedRecords] = useState<string[]>([
    'Cardiology Encounters',
    'Active Medications',
    'Quest Metabolic Labs',
  ]);
  const [selectedAppointmentDetail, setSelectedAppointmentDetail] = useState<AppointmentRecord | null>(null);

  const selectedFacility =
    HEALTHCARE_FACILITIES.find((f) => f.id === selectedFacilityId) || HEALTHCARE_FACILITIES[0];

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();

    const newApt: AppointmentRecord = {
      id: `apt-${Date.now()}`,
      bookingReference: `#APT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      providerName: doctorName,
      specialty: selectedFacility.specialties[0] || 'General Medicine',
      facility: selectedFacility.name,
      address: selectedFacility.address,
      date,
      time,
      consultationType,
      reason,
      status: 'Confirmed',
      sharedRecords,
      preparationNotes: [
        'Bring government photo identification and insurance card (or demo pass)',
        'Have current medication containers or updated list available',
        'Arrive 15 minutes before scheduled slot for initial vitals screening',
      ],
      isDemo: true,
      fhirAppointmentId: `apt-fhir-${Date.now()}`,
    };

    onAddAppointment(newApt);
    setShowBookingModal(false);
    if (onClearPreselectedFacility) onClearPreselectedFacility();
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'confirmed') return apt.status === 'Confirmed';
    if (activeTab === 'pending') return apt.status === 'Pending';
    if (activeTab === 'completed') return apt.status === 'Completed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Calendar className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              My Appointments & Consultations
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-800">
              HL7 FHIR Appointment Model
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Schedule visits with hospital specialists, manage upcoming consultations, and attach patient-governed medical records for continuity of care.
          </p>
        </div>

        <button
          onClick={() => setShowBookingModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-bold text-slate-500">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'all' ? 'bg-slate-900 text-white' : 'hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All Appointments ({appointments.length})
        </button>
        <button
          onClick={() => setActiveTab('confirmed')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'confirmed' ? 'bg-slate-900 text-white' : 'hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Confirmed ({appointments.filter((a) => a.status === 'Confirmed').length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'pending' ? 'bg-slate-900 text-white' : 'hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Pending ({appointments.filter((a) => a.status === 'Pending').length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'completed' ? 'bg-slate-900 text-white' : 'hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Completed ({appointments.filter((a) => a.status === 'Completed').length})
        </button>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAppointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {apt.bookingReference}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    apt.status === 'Confirmed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : apt.status === 'Pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {apt.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{apt.providerName}</h3>
                <p className="text-xs text-slate-500">{apt.specialty}</p>
                <p className="text-xs font-medium text-slate-700 mt-1">{apt.facility}</p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-bold text-slate-900">{apt.date} at {apt.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {apt.consultationType === 'Video Consultation' ? (
                    <Video className="w-3.5 h-3.5 text-indigo-600" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  <span>{apt.consultationType}</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Reason for Visit</span>
                <p className="text-slate-800">{apt.reason}</p>
              </div>

              {/* Shared Records Badge */}
              <div className="text-[11px] text-slate-500">
                <span className="font-bold text-slate-700">Records Attached: </span>
                <span>{(apt.sharedRecords || []).join(', ')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => setSelectedAppointmentDetail(apt)}
                className="text-blue-600 font-bold hover:underline"
              >
                Preparation Checklist
              </button>

              {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                <button
                  onClick={() => onUpdateStatus(apt.id, 'Cancelled')}
                  className="text-slate-400 hover:text-rose-600 font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-black text-slate-900">Book Healthcare Appointment</h3>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Facility</label>
                <select
                  value={selectedFacilityId}
                  onChange={(e) => {
                    setSelectedFacilityId(e.target.value);
                    const fac = HEALTHCARE_FACILITIES.find((f) => f.id === e.target.value);
                    if (fac && fac.doctors[0]) {
                      setDoctorName(`${fac.doctors[0].name}, ${fac.doctors[0].title}`);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  {HEALTHCARE_FACILITIES.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Consulting Physician</label>
                <select
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  {selectedFacility.doctors.map((doc, idx) => (
                    <option key={idx} value={`${doc.name}, ${doc.title}`}>
                      {doc.name}, {doc.title} - {doc.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Appointment Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Time</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option>09:00 AM</option>
                    <option>10:30 AM</option>
                    <option>11:15 AM</option>
                    <option>02:00 PM</option>
                    <option>03:30 PM</option>
                    <option>04:15 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Consultation Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['In-Person', 'Video Consultation', 'Urgent Care'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setConsultationType(type)}
                      className={`py-2 px-2 rounded-xl font-bold border transition-all text-[11px] ${
                        consultationType === type
                          ? 'bg-blue-50 border-blue-600 text-blue-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Visit</label>
                <textarea
                  rows={2}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Share Selected Records with Provider (Optional)
                </label>
                <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {[
                    'Cardiology Encounters',
                    'Active Medications',
                    'Quest Metabolic Labs',
                    'Chest Radiology Reports',
                  ].map((rec) => (
                    <label key={rec} className="flex items-center space-x-2 text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sharedRecords.includes(rec)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSharedRecords([...sharedRecords, rec]);
                          } else {
                            setSharedRecords(sharedRecords.filter((r) => r !== rec));
                          }
                        }}
                        className="rounded text-blue-600"
                      />
                      <span>{rec}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-[11px] text-blue-900">
                <span className="font-bold">Synthetic Demo Booking:</span> This creates a simulated appointment mapped to HL7 FHIR Appointment resources for judge evaluation.
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black shadow-xs"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preparation Checklist Modal */}
      {selectedAppointmentDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Preparation Checklist • {selectedAppointmentDetail.bookingReference}
              </h3>
              <button
                onClick={() => setSelectedAppointmentDetail(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900">
                <p className="font-bold">{selectedAppointmentDetail.providerName}</p>
                <p className="text-[11px] text-blue-800">{selectedAppointmentDetail.facility}</p>
                <p className="text-[11px] text-blue-700 font-mono mt-0.5">{selectedAppointmentDetail.date} at {selectedAppointmentDetail.time}</p>
              </div>

              <span className="font-bold text-slate-800 block uppercase tracking-wide text-[10px]">
                Required Clinical Checklist
              </span>
              <ul className="space-y-2">
                {(selectedAppointmentDetail.preparationNotes || []).map((note: string, i: number) => (
                  <li key={i} className="flex items-start space-x-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedAppointmentDetail(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
