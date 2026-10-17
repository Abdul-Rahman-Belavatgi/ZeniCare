import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Star,
  CheckCircle2,
  Stethoscope,
  Building2,
  Phone,
  ShieldCheck,
  Video,
  User,
  Filter,
  Plus,
  X,
  ChevronRight,
  AlertCircle,
  Ambulance,
  Bed,
  FileText,
  BadgeCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { HealthcareDoctor, BookedAppointment, MedicalReport } from '../types/index.ts';
import { MUMBAI_FACILITIES, MUMBAI_DOCTORS, MumbaiFacility } from '../data/mumbaiData.ts';

interface FindDoctorsAndAppointmentsProps {
  doctors: HealthcareDoctor[];
  appointments: BookedAppointment[];
  onBookAppointment: (newAppt: BookedAppointment) => void;
  onCancelAppointment: (apptId: string) => void;
  reports?: MedicalReport[];
}

export const FindDoctorsAndAppointments: React.FC<FindDoctorsAndAppointmentsProps> = ({
  doctors,
  appointments,
  onBookAppointment,
  onCancelAppointment,
  reports = [],
}) => {
  const [activeTab, setActiveTab] = useState<'mumbai_facilities' | 'doctors' | 'upcoming'>('mumbai_facilities');
  
  // Facilities State
  const [facilitySearch, setFacilitySearch] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('All Localities');
  const [selectedFacilityCategory, setSelectedFacilityCategory] = useState('All Categories');
  const [selectedFacilityDetail, setSelectedFacilityDetail] = useState<MumbaiFacility | null>(null);

  // Doctors State
  const [doctorSearch, setDoctorSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [bookingDoctor, setBookingDoctor] = useState<HealthcareDoctor | null>(null);

  // Booking Form State
  const [selectedSlot, setSelectedSlot] = useState('');
  const [visitReason, setVisitReason] = useState('');
  const [isVirtual, setIsVirtual] = useState(false);
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);

  // Localities for Mumbai
  const localities = [
    'All Localities',
    'Bandra West',
    'Mahim',
    'Andheri West',
    'Parel',
    'Powai',
    'Vile Parle West',
    'Worli',
    'Colaba',
  ];

  const facilityCategories = [
    'All Categories',
    'Multispecialty Hospital',
    'Diagnostic & Pathology Lab',
    'Super Specialty Clinic',
  ];

  // Combine Mumbai doctors with passed doctors (ensuring no duplicate IDs)
  const allDoctors = [
    ...MUMBAI_DOCTORS,
    ...doctors.filter((d) => !MUMBAI_DOCTORS.some((md) => md.id === d.id)),
  ];

  const specialties = [
    'All Specialties',
    'Cardiovascular Disease & Arrhythmias',
    'Endocrinology, Diabetes & Metabolism',
    'Family Medicine & Primary Care',
    'Orthopedics & Sports Medicine',
    'Dermatology & Allergic Drug Reactions',
    'Neurology & Sleep Medicine',
  ];

  // Filter Facilities
  const filteredFacilities = MUMBAI_FACILITIES.filter((fac) => {
    const matchesLocality =
      selectedLocality === 'All Localities' || fac.locality.toLowerCase().includes(selectedLocality.toLowerCase());
    const matchesCategory =
      selectedFacilityCategory === 'All Categories' || fac.category === selectedFacilityCategory;
    const matchesSearch =
      facilitySearch === '' ||
      fac.name.toLowerCase().includes(facilitySearch.toLowerCase()) ||
      fac.address.toLowerCase().includes(facilitySearch.toLowerCase()) ||
      fac.availableServices.some((s) => s.toLowerCase().includes(facilitySearch.toLowerCase()));
    return matchesLocality && matchesCategory && matchesSearch;
  });

  // Filter Doctors
  const filteredDoctors = allDoctors.filter((doc) => {
    const matchesSpecialty =
      selectedSpecialty === 'All Specialties' || doc.specialty === selectedSpecialty;
    const matchesQuery =
      doctorSearch === '' ||
      doc.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      doc.facility.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      doc.address.toLowerCase().includes(doctorSearch.toLowerCase());
    return matchesSpecialty && matchesQuery;
  });

  const handleConfirmBooking = () => {
    if (!bookingDoctor || !selectedSlot) return;

    const [datePart, ...timeParts] = selectedSlot.split(' ');
    const timePart = timeParts.join(' ');

    const newAppointment: BookedAppointment = {
      id: `apt-${Date.now()}`,
      doctorId: bookingDoctor.id,
      doctorName: bookingDoctor.name,
      specialty: bookingDoctor.specialty,
      facility: bookingDoctor.facility,
      address: bookingDoctor.address,
      date: datePart.includes('Tomorrow')
        ? new Date(Date.now() + 86400000).toISOString().split('T')[0]
        : '2026-10-25',
      time: timePart || '10:00 AM',
      status: 'Confirmed',
      visitReason: visitReason || 'Consultation & Record Review',
      isVirtual: isVirtual,
      notes: appointmentNotes
        ? `${appointmentNotes} • [Pre-shared ${selectedReportIds.length} medical reports]`
        : `Pre-shared ${selectedReportIds.length} medical reports for visit preparation.`,
    };

    onBookAppointment(newAppointment);
    setBookingDoctor(null);
    setSelectedSlot('');
    setVisitReason('');
    setAppointmentNotes('');
    setSelectedReportIds([]);
    setActiveTab('upcoming');
  };

  const toggleReportSelection = (reportId: string) => {
    setSelectedReportIds((prev) =>
      prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold border border-blue-100 shadow-xs">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Find Care & Appointments
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                <span>Mumbai Health Network</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Verified Mumbai hospitals, diagnostic laboratories, specialist doctors & seamless appointment booking.
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('mumbai_facilities')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'mumbai_facilities'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Mumbai Facilities ({MUMBAI_FACILITIES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'doctors'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
            <span>Specialists ({allDoctors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'upcoming'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>My Bookings</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-700 font-extrabold">
              {appointments.filter((a) => a.status !== 'Cancelled').length}
            </span>
          </button>
        </div>
      </div>

      {/* 24/7 Emergency Quick Banner for Mumbai */}
      <div className="bg-linear-to-r from-rose-50 via-red-50 to-amber-50 p-4 rounded-2xl border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Ambulance className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-red-900 uppercase tracking-wide">Mumbai Emergency Response 24/7</span>
              <span className="px-1.5 py-0.2 rounded bg-red-200 text-red-800 font-bold text-[10px]">Active</span>
            </div>
            <p className="text-red-700 font-medium">
              Dial <strong>108 / 112</strong> for immediate medical ambulance. Lilavati Trauma: <strong>+91 22 2675 1000</strong>. Kokilaben ER: <strong>+91 22 4269 9999</strong>.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 self-start sm:self-center shrink-0">
          <a
            href="tel:108"
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center space-x-1 shadow-xs transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call 108 Emergency</span>
          </a>
        </div>
      </div>

      {/* VIEW 1: Mumbai Healthcare Database (Hospitals, Clinics, Labs) */}
      {activeTab === 'mumbai_facilities' && (
        <div className="space-y-4">
          {/* Search & Locality Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Mumbai hospitals, labs, services (e.g. Lilavati, Hinduja, MRI, Cath Lab)..."
                  value={facilitySearch}
                  onChange={(e) => setFacilitySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                >
                  {localities.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedFacilityCategory}
                  onChange={(e) => setSelectedFacilityCategory(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                >
                  {facilityCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span className="font-medium">
                Showing <strong>{filteredFacilities.length}</strong> verified healthcare facilities across Mumbai
              </span>
              <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Government & NABH Accredited Data</span>
              </span>
            </div>
          </div>

          {/* Facilities Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFacilities.map((fac) => (
              <div
                key={fac.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-1">
                        {fac.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{fac.name}</h3>
                    </div>
                    <div className="flex items-center space-x-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-200 shrink-0">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{fac.rating}</span>
                      <span className="text-[10px] text-amber-600 font-normal">({fac.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center space-x-1.5 font-medium text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{fac.locality} • {fac.distanceKm}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{fac.address}</p>
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-600">
                      <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{fac.phone}</span>
                    </div>
                  </div>

                  {/* ICU Beds & Accreditation Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {fac.icuBedsAvailable !== undefined && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                        <Bed className="w-3 h-3 text-emerald-600" />
                        <span>{fac.icuBedsAvailable} ICU Beds Available</span>
                      </span>
                    )}
                    <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                      {fac.accreditation}
                    </span>
                  </div>

                  {/* Available Services */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Key Services & Facilities:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {fac.availableServices.slice(0, 3).map((serv) => (
                        <span
                          key={serv}
                          className="px-2 py-0.5 bg-white text-slate-700 rounded-md text-[10px] font-medium border border-slate-200"
                        >
                          {serv}
                        </span>
                      ))}
                      {fac.availableServices.length > 3 && (
                        <span className="text-[10px] text-blue-600 font-bold self-center">
                          +{fac.availableServices.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center space-x-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedFacilityDetail(fac)}
                    className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors text-center"
                  >
                    View Details & Doctors
                  </button>
                  <a
                    href={`tel:${fac.phone.replace(/[^0-9+]/g, '')}`}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1"
                    title="Direct Call"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: Specialist Doctors & Appointments */}
      {activeTab === 'doctors' && (
        <div className="space-y-4">
          {/* Doctor Search & Specialty Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search doctors by name, hospital, or specialty (e.g. Dr. Meera Joshi, Cardiology)..."
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{doc.name}</h3>
                      <p className="text-xs font-semibold text-blue-600">{doc.specialty}</p>
                    </div>
                    <div className="flex items-center space-x-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{doc.rating}</span>
                      <span className="text-[10px] text-amber-600 font-normal">({doc.reviewsCount})</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-500">
                    <div className="flex items-center space-x-1.5 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.facility}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.distance}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                    {doc.bio}
                  </p>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-slate-700 font-medium">
                      <span>Next Availability:</span>
                      <span className="font-bold text-emerald-700">{doc.nextAvailable}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      Insurance/TPA: {doc.insuranceList.slice(0, 3).join(', ')}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setBookingDoctor(doc);
                    setSelectedSlot(doc.availableSlots[0] || 'Tomorrow 10:00 AM');
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Appointment & Share Records</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: My Booked Appointments */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No appointments scheduled</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Search nearby Mumbai healthcare providers and schedule your next visit with one click.
              </p>
              <button
                onClick={() => setActiveTab('doctors')}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                Find Specialists Near Me
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className={`bg-white p-5 rounded-2xl border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                    appt.status === 'Cancelled' ? 'opacity-60 border-slate-200 bg-slate-50' : 'border-slate-200 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex flex-col items-center justify-center font-bold shrink-0 border border-blue-100">
                      <span className="text-[10px] uppercase">{appt.date.split('-')[1]}</span>
                      <span className="text-sm font-black">{appt.date.split('-')[2]}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-slate-900">{appt.doctorName}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            appt.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : appt.status === 'Upcoming'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : appt.status === 'Completed'
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {appt.status}
                        </span>
                        {appt.isVirtual && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center space-x-1">
                            <Video className="w-3 h-3" />
                            <span>Telehealth</span>
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-blue-600 font-semibold">{appt.specialty} • {appt.facility}</p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{appt.time}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{appt.address}</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 italic pt-1">
                        Reason: {appt.visitReason}
                      </p>
                      {appt.notes && (
                        <p className="text-[11px] text-emerald-700 font-medium">
                          {appt.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {appt.status !== 'Cancelled' && appt.status !== 'Completed' && (
                    <div className="flex items-center space-x-2 self-end md:self-center">
                      <button
                        onClick={() => alert(`Pre-visit check-in completed for ${appt.doctorName}. Records successfully linked.`)}
                        className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs transition-colors"
                      >
                        Pre-Visit Check-In
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Cancel your appointment with ${appt.doctorName}?`)) {
                            onCancelAppointment(appt.id);
                          }
                        }}
                        className="px-3 py-2 text-rose-600 hover:bg-rose-50 font-bold rounded-xl text-xs transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Facility Detail Modal */}
      {selectedFacilityDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedFacilityDetail.category}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">{selectedFacilityDetail.name}</h3>
                <p className="text-xs text-slate-500">{selectedFacilityDetail.locality}, Mumbai</p>
              </div>
              <button
                onClick={() => setSelectedFacilityDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Address & Navigation</span>
                </div>
                <p className="text-slate-600">{selectedFacilityDetail.address}</p>
                <p className="text-blue-600 font-medium pt-1">{selectedFacilityDetail.distanceKm}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Hospital Reception</span>
                  <p className="font-bold text-slate-800">{selectedFacilityDetail.phone}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-xl space-y-1 border border-red-100">
                  <span className="text-[10px] font-bold text-red-700 uppercase">24/7 Emergency</span>
                  <p className="font-bold text-red-900">{selectedFacilityDetail.emergencyPhone}</p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Available Specialties & Infrastructure:</label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFacilityDetail.availableServices.map((s) => (
                    <span key={s} className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-lg text-xs font-semibold border border-blue-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-slate-700">
                <span>Accreditation:</span>
                <span className="font-bold text-slate-900">{selectedFacilityDetail.accreditation}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button
                onClick={() => {
                  setSelectedFacilityDetail(null);
                  setActiveTab('doctors');
                  setDoctorSearch(selectedFacilityDetail.name.split(' ')[0]);
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20"
              >
                Find Doctors at this Facility
              </button>
              <button
                onClick={() => setSelectedFacilityDetail(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal with Patient Report Pre-authorization */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Schedule Appointment</h3>
                <p className="text-xs text-slate-500">{bookingDoctor.name} • {bookingDoctor.specialty}</p>
              </div>
              <button
                onClick={() => setBookingDoctor(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Select Appointment Slot</label>
                <div className="grid grid-cols-2 gap-2">
                  {bookingDoctor.availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all text-left ${
                        selectedSlot === slot
                          ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Visit</label>
                <input
                  type="text"
                  placeholder="e.g., Atrial fibrillation follow-up, routine INR review..."
                  value={visitReason}
                  onChange={(e) => setVisitReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Pre-authorize Medical Reports (Patient-Controlled Sharing) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-slate-700">Pre-Authorize Medical Reports to Share</label>
                  <span className="text-[10px] text-blue-600 font-semibold">
                    {selectedReportIds.length} of {reports.length} selected
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">
                  Select which medical records {bookingDoctor.name} can view before your consultation.
                </p>

                <div className="max-h-36 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2 bg-slate-50">
                  {reports.length === 0 ? (
                    <p className="text-slate-400 text-center py-2 text-xs">No reports currently in your records.</p>
                  ) : (
                    reports.map((rep) => {
                      const isSelected = selectedReportIds.includes(rep.id);
                      return (
                        <div
                          key={rep.id}
                          onClick={() => toggleReportSelection(rep.id)}
                          className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2 min-w-0 pr-2">
                            <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                            <div className="truncate">
                              <span className="block truncate">{rep.title}</span>
                              <span className="text-[10px] text-slate-400">{rep.category} • {rep.reportDate}</span>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded text-blue-600 focus:ring-blue-500 pointer-events-none"
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="telehealth-opt"
                  checked={isVirtual}
                  onChange={(e) => setIsVirtual(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="telehealth-opt" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Request as Virtual Telehealth Video Visit
                </label>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-900 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Patient-Controlled Privacy Protection</span>
                </div>
                <p>
                  By booking, you grant temporary 7-day authorized access to {bookingDoctor.name} for the selected records only. You can revoke access at any time from Sharing Permissions.
                </p>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20"
                >
                  Confirm & Book Visit
                </button>
                <button
                  type="button"
                  onClick={() => setBookingDoctor(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
