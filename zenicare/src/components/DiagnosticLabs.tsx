import React, { useState } from 'react';
import {
  FlaskConical,
  TrendingDown,
  TrendingUp,
  Activity,
  Calendar,
  Building2,
  Search,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { DiagnosticLabReport } from '../types/index.ts';
import { BIOMARKER_TRENDS } from '../data/mockData.ts';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DiagnosticLabsProps {
  labReports: DiagnosticLabReport[];
}

export const DiagnosticLabs: React.FC<DiagnosticLabsProps> = ({ labReports }) => {
  const [selectedBiomarker, setSelectedBiomarker] = useState<'hba1c' | 'glucose' | 'bp' | 'lipids'>('hba1c');
  const [reportFilter, setReportFilter] = useState<'all' | 'Metabolic' | 'Lipid' | 'Hematology'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Chart configuration for HbA1c
  const hba1cChartData = {
    labels: BIOMARKER_TRENDS.hba1c.map((d) => d.date),
    datasets: [
      {
        label: 'HbA1c Level (%)',
        data: BIOMARKER_TRENDS.hba1c.map((d) => d.value),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#1d4ed8',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  // Chart configuration for Glucose
  const glucoseChartData = {
    labels: BIOMARKER_TRENDS.glucose.map((d) => d.date),
    datasets: [
      {
        label: 'Fasting Blood Glucose (mg/dL)',
        data: BIOMARKER_TRENDS.glucose.map((d) => d.value),
        borderColor: '#059669',
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#047857',
        pointRadius: 6,
      },
    ],
  };

  // Chart configuration for Blood Pressure
  const bpChartData = {
    labels: BIOMARKER_TRENDS.bloodPressure.map((d) => d.date),
    datasets: [
      {
        label: 'Systolic BP (mmHg)',
        data: BIOMARKER_TRENDS.bloodPressure.map((d) => d.systolic),
        borderColor: '#dc2626',
        backgroundColor: 'transparent',
        tension: 0.3,
        pointBackgroundColor: '#b91c1c',
        pointRadius: 5,
      },
      {
        label: 'Diastolic BP (mmHg)',
        data: BIOMARKER_TRENDS.bloodPressure.map((d) => d.diastolic),
        borderColor: '#f97316',
        backgroundColor: 'transparent',
        tension: 0.3,
        pointBackgroundColor: '#ea580c',
        pointRadius: 5,
      },
    ],
  };

  // Chart configuration for Lipids
  const lipidsChartData = {
    labels: BIOMARKER_TRENDS.lipids.map((d) => d.date),
    datasets: [
      {
        label: 'Total Cholesterol',
        data: BIOMARKER_TRENDS.lipids.map((d) => d.total),
        borderColor: '#7c3aed',
        backgroundColor: 'transparent',
        tension: 0.3,
        pointRadius: 5,
      },
      {
        label: 'LDL Cholesterol',
        data: BIOMARKER_TRENDS.lipids.map((d) => d.ldl),
        borderColor: '#2563eb',
        backgroundColor: 'transparent',
        tension: 0.3,
        pointRadius: 5,
      },
      {
        label: 'HDL Cholesterol',
        data: BIOMARKER_TRENDS.lipids.map((d) => d.hdl),
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        tension: 0.3,
        pointRadius: 5,
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          font: { size: 11, weight: 'bold' },
        },
      },
      tooltip: {
        callbacks: {
          afterLabel: function (context: any) {
            const index = context.dataIndex;
            if (selectedBiomarker === 'hba1c') {
              return `Facility: ${BIOMARKER_TRENDS.hba1c[index].facility} (${BIOMARKER_TRENDS.hba1c[index].threshold})`;
            }
            if (selectedBiomarker === 'glucose') {
              return `Facility: ${BIOMARKER_TRENDS.glucose[index].facility}`;
            }
            if (selectedBiomarker === 'bp') {
              return `Facility: ${BIOMARKER_TRENDS.bloodPressure[index].facility}`;
            }
            return `Facility: ${BIOMARKER_TRENDS.lipids[index]?.facility || 'Quest'}`;
          },
        },
      },
    },
    scales: {
      y: {
        grid: { color: '#f1f5f9' },
        ticks: { font: { size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
    },
  };

  const filteredReports = labReports.filter((rep) => {
    if (reportFilter !== 'all' && rep.category !== reportFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = rep.testName.toLowerCase().includes(q);
      const matchFacility = rep.facility.toLowerCase().includes(q);
      const matchItem = rep.items.some((it) => it.name.toLowerCase().includes(q));
      if (!matchName && !matchFacility && !matchItem) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Diagnostic Labs & Longitudinal Biomarker Trends
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
              24-Month Synthesized
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Seamlessly harmonizes fragmented lab results from Quest Diagnostics, Metro Health, and St. Jude
          </p>
        </div>
      </div>

      {/* Dynamic Biomarker Visualizer (Chart.js) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          {/* Tabs for Trend Selection */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedBiomarker('hba1c')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedBiomarker === 'hba1c'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              HbA1c Series (24 Mo)
            </button>
            <button
              onClick={() => setSelectedBiomarker('glucose')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedBiomarker === 'glucose'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Fasting Blood Glucose
            </button>
            <button
              onClick={() => setSelectedBiomarker('bp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedBiomarker === 'bp'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Blood Pressure Trend
            </button>
            <button
              onClick={() => setSelectedBiomarker('lipids')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedBiomarker === 'lipids'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Lipid Panel (Total / LDL / HDL)
            </button>
          </div>

          <div className="text-xs text-slate-500 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-500" />
            <span>Multi-Lab Stitching Active</span>
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-72 w-full pt-2">
          {selectedBiomarker === 'hba1c' && <Line data={hba1cChartData} options={chartOptions} />}
          {selectedBiomarker === 'glucose' && <Line data={glucoseChartData} options={chartOptions} />}
          {selectedBiomarker === 'bp' && <Line data={bpChartData} options={chartOptions} />}
          {selectedBiomarker === 'lipids' && <Line data={lipidsChartData} options={chartOptions} />}
        </div>

        {/* Longitudinal Interpretation Card */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
            <span className="font-bold text-blue-900 block">Baseline vs Latest</span>
            <span className="text-blue-800 text-[11px] mt-0.5 block">
              HbA1c declined from 7.6% (Diabetic range, Oct 2024) to 5.8% (Target control, Oct 2026).
            </span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
            <span className="font-bold text-emerald-900 block">Cardiometabolic Risk Reduction</span>
            <span className="text-emerald-800 text-[11px] mt-0.5 block">
              LDL Cholesterol lowered from 142 mg/dL to 94 mg/dL under Atorvastatin 20mg.
            </span>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
            <span className="font-bold text-purple-900 block">Independent Labs Unified</span>
            <span className="text-purple-800 text-[11px] mt-0.5 block">
              3 laboratory entities (Quest, Metro Health, St. Jude) mapped to LOINC ontology.
            </span>
          </div>
        </div>
      </div>

      {/* Diagnostic Reports Table matching Reference Image Screen 8 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Sub-tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setReportFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                reportFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Reports ({labReports.length})
            </button>
            <button
              onClick={() => setReportFilter('Metabolic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                reportFilter === 'Metabolic'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Metabolic & Glycemic
            </button>
            <button
              onClick={() => setReportFilter('Lipid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                reportFilter === 'Lipid'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Lipid Profiles
            </button>
            <button
              onClick={() => setReportFilter('Hematology')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                reportFilter === 'Hematology'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Hematology / Coagulation
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports or analytes..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Detailed Panels */}
        <div className="divide-y divide-slate-200">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-slate-50/50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <FlaskConical className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-900">{report.testName}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {report.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center space-x-2">
                    <span className="font-semibold text-slate-700">{report.facility}</span>
                    <span>•</span>
                    <span>Ordered by {report.orderingPhysician}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-400">{report.date}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
                    Status: {report.status}
                  </span>
                </div>
              </div>

              {/* Lab Result Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                {report.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                  >
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span className="font-medium truncate">{item.name}</span>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          item.status === 'normal'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-1 flex items-baseline space-x-1">
                      <span className="text-lg font-black text-slate-900">{item.value}</span>
                      <span className="text-[11px] text-slate-500 font-medium">{item.unit}</span>
                    </div>

                    <p className="text-[10px] text-slate-400 mt-1 truncate">
                      Ref: {item.referenceRange}
                    </p>
                  </div>
                ))}
              </div>

              {/* Impression */}
              <div className="mt-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="font-semibold">Pathologist / Lab Impression:</strong>{' '}
                  {report.clinicalImpression}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
