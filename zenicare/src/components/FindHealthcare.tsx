import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Filter,
  Navigation,
  Phone,
  Clock,
  Building2,
  Calendar,
  CheckCircle2,
  Star,
  ExternalLink,
  ShieldAlert,
  Stethoscope,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { HealthcareFacility } from '../types/index.ts';
import { HEALTHCARE_FACILITIES } from '../data/mockData.ts';

interface FindHealthcareProps {
  onBookAppointment: (facility: HealthcareFacility, doctorName?: string) => void;
}

export const FindHealthcare: React.FC<FindHealthcareProps> = ({ onBookAppointment }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<HealthcareFacility>(HEALTHCARE_FACILITIES[0]);
  const [userLocation, setUserLocation] = useState<string>('Seattle, WA (Default)');
  const [isLocating, setIsLocating] = useState(false);

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      setUserLocation('Current Location (47.6062° N, 122.3321° W)');
    }, 800);
  };

  const filteredFacilities = HEALTHCARE_FACILITIES.filter((facility) => {
    const matchesSearch =
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || facility.category === selectedCategory;

    const matchesSpecialty =
      selectedSpecialty === 'All' || facility.specialties.includes(selectedSpecialty);

    const matchesEmergency = !emergencyOnly || facility.hasEmergencyDept;

    return matchesSearch && matchesCategory && matchesSpecialty && matchesEmergency;
  });

  return (
    <div className="space-y-6">
      {/* Search & Location Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Building2 className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Find Healthcare Near You
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
                Live Directory
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Locate verified hospitals, family clinics, diagnostic imaging centers, and emergency trauma facilities with real-time distance and appointment availability.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors border border-blue-200"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Acquiring GPS...' : 'Use Current Location'}</span>
            </button>
          </div>
        </div>

        {/* Search Inputs & Filter Chips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by hospital name, doctor, specialty (e.g. Cardiology), or ZIP code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setEmergencyOnly(!emergencyOnly)}
              className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all border ${
                emergencyOnly
                  ? 'bg-red-600 text-white border-red-700 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>24/7 Emergency Only</span>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          {['All', 'Hospital', 'Clinic', 'Diagnostic Lab', 'Emergency Care'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'All' ? 'All Facilities' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Split View: Interactive Map & Nearby Facilities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 Cols): Interactive Map Visualizer */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Interactive Facility Map</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Radius: 5 km</span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full h-80 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
            {/* Map Grid Background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #38bdf8 1px, transparent 1px), radial-gradient(circle, #38bdf8 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            ></div>

            {/* Simulated Road Lines */}
            <svg className="absolute inset-0 w-full h-full stroke-slate-700/60 stroke-2" fill="none">
              <path d="M 0 160 Q 150 120 300 180 T 600 140" />
              <path d="M 120 0 Q 180 180 220 350" />
              <path d="M 320 0 L 280 350" />
              <circle cx="200" cy="160" r="90" className="stroke-blue-500/20 fill-blue-500/5 stroke-1" />
            </svg>

            {/* User Location Pulse */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white"></span>
              </span>
              <span className="text-[9px] font-bold text-white bg-slate-950/90 px-1.5 py-0.5 rounded shadow mt-1">
                You (Alex Morgan)
              </span>
            </div>

            {/* Facility Pins */}
            {filteredFacilities.map((fac, idx) => {
              const isSelected = selectedFacility.id === fac.id;
              // Distribute pins around center
              const positions = [
                { top: '25%', left: '30%' },
                { top: '35%', left: '75%' },
                { top: '70%', left: '40%' },
                { top: '65%', left: '80%' },
                { top: '20%', left: '60%' },
              ];
              const pos = positions[idx % positions.length];

              return (
                <div
                  key={fac.id}
                  onClick={() => setSelectedFacility(fac)}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                >
                  <div
                    className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-white border-white scale-110 shadow-lg ring-2 ring-emerald-300'
                        : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block whitespace-nowrap bg-slate-950 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg pointer-events-none">
                    {fac.name} ({fac.distanceKm} km)
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Facility Quick Card */}
          {selectedFacility && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="text-sm">{selectedFacility.name}</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px]">
                  {selectedFacility.distanceKm} km away
                </span>
              </div>
              <p className="text-slate-600">{selectedFacility.address}</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-emerald-700 font-bold flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{selectedFacility.operatingHours}</span>
                </span>
                <button
                  onClick={() => onBookAppointment(selectedFacility)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow-2xs"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (7 Cols): Search Results List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1 text-xs text-slate-500">
            <span>Showing {filteredFacilities.length} healthcare facilities</span>
            <span className="font-mono text-[10px]">Reference Sample Provider Directory</span>
          </div>

          <div className="space-y-3">
            {filteredFacilities.map((facility) => {
              const isSelected = selectedFacility.id === facility.id;
              return (
                <div
                  key={facility.id}
                  className={`bg-white rounded-2xl border p-5 transition-all space-y-3 ${
                    isSelected
                      ? 'border-blue-500 shadow-md ring-2 ring-blue-50'
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-slate-900">{facility.name}</h3>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded-md">
                          {facility.category}
                        </span>
                        {facility.hasEmergencyDept && (
                          <span className="px-2 py-0.5 text-[10px] font-black bg-red-100 text-red-800 rounded-md uppercase">
                            24/7 ER
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{facility.address}</span>
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0">
                      <span className="text-sm font-black text-blue-600">{facility.distanceKm} km</span>
                      <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{facility.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Specialties & Services */}
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {facility.specialties.map((spec, i) => (
                      <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
                        {spec}
                      </span>
                    ))}
                    {facility.services.slice(0, 2).map((srv, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {srv}
                      </span>
                    ))}
                  </div>

                  {/* Doctors Available */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Stethoscope className="w-4 h-4 text-slate-400" />
                      <span>
                        Doctors on Duty: <strong className="text-slate-800">{facility.doctors.map((d) => d.name).join(', ')}</strong>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <a
                        href={`tel:${facility.phone}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center space-x-1 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>

                      <button
                        onClick={() => onBookAppointment(facility)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Appointment</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
