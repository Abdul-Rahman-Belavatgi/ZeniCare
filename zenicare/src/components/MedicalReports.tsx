import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Download,
  Trash2,
  Eye,
  Share2,
  AlertCircle,
  Sparkles,
  FileSpreadsheet,
  X,
  FileCheck,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { MedicalReport, ReportCategory } from '../types/index.ts';

interface MedicalReportsProps {
  reports: MedicalReport[];
  onAddReport: (newReport: MedicalReport) => void;
  onDeleteReport: (reportId: string) => void;
  onVerifyReport: (reportId: string, status: 'Patient Verified' | 'Clinician Verified') => void;
  onOpenSharing: () => void;
}

export const MedicalReports: React.FC<MedicalReportsProps> = ({
  reports,
  onAddReport,
  onDeleteReport,
  onVerifyReport,
  onOpenSharing,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>('All Reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload simulation state
  const [uploadStep, setUploadStep] = useState<'idle' | 'uploading' | 'ocr_extracting' | 'review'>('idle');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [extractedForm, setExtractedForm] = useState<{
    title: string;
    providerName: string;
    reportDate: string;
    category: ReportCategory;
    summary: string;
    extractedKeyFindings: string[];
    medicationsOrTests: string[];
  }>({
    title: '',
    providerName: '',
    reportDate: new Date().toISOString().split('T')[0],
    category: 'Laboratory Tests',
    summary: '',
    extractedKeyFindings: [],
    medicationsOrTests: [],
  });

  const categories: ReportCategory[] = [
    'All Reports',
    'Laboratory Tests',
    'Prescriptions',
    'Doctor Visit Summaries',
    'Discharge Summaries',
    'Scans and Imaging',
    'Referrals',
    'Vaccination Records',
    'Other Documents',
  ];

  const filteredReports = reports.filter((rep) => {
    const matchesCategory = selectedCategory === 'All Reports' || rep.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleSimulateUpload = (fileName: string, category: ReportCategory, provider: string) => {
    setUploadedFile({ name: fileName, size: '1.2 MB', type: 'PDF' });
    setUploadStep('uploading');

    setTimeout(() => {
      setUploadStep('ocr_extracting');

      setTimeout(() => {
        setExtractedForm({
          title: fileName.replace('.pdf', '').replace(/_/g, ' '),
          providerName: provider,
          reportDate: new Date().toISOString().split('T')[0],
          category: category,
          summary: 'AI OCR extracted document with verified lab parameters and physician credentials.',
          extractedKeyFindings: [
            'All values analyzed against standard adult reference ranges',
            'No urgent critical flags found outside target tolerances',
          ],
          medicationsOrTests: ['Standard Panel Evaluation', 'Physician Review'],
        });
        setUploadStep('review');
      }, 1500);
    }, 1200);
  };

  const handleSaveUploadedReport = () => {
    const newReport: MedicalReport = {
      id: `rep-${Date.now()}`,
      title: extractedForm.title || 'Uploaded Medical Document',
      providerName: extractedForm.providerName || 'Local Medical Provider',
      reportDate: extractedForm.reportDate,
      category: extractedForm.category,
      uploadDate: new Date().toISOString().split('T')[0],
      verificationStatus: 'Patient Verified',
      processingStatus: 'AI Extracted',
      fileFormat: 'PDF',
      fileSize: uploadedFile?.size || '1.1 MB',
      summary: extractedForm.summary || 'Patient uploaded and verified health report.',
      aiConfidence: 97.2,
      extractedFields: {
        dates: [extractedForm.reportDate],
        medicationsOrTests: extractedForm.medicationsOrTests,
        results: [{ label: 'Status', value: 'Recorded', status: 'normal' }],
        keyFindings: extractedForm.extractedKeyFindings,
      },
      originalPreviewText: `DOCUMENT ARCHIVE: ${extractedForm.title}\nFacility: ${extractedForm.providerName}\nDate: ${extractedForm.reportDate}\nAI Processed: OCR and Entity Extraction Complete.`,
    };

    onAddReport(newReport);
    setIsUploadModalOpen(false);
    setUploadStep('idle');
    setUploadedFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                My Medical Reports
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                All your medical documents, organized in one place.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => {
              setIsUploadModalOpen(true);
              setUploadStep('idle');
            }}
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Medical Report</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search reports by title, clinic, test..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 w-full sm:w-auto justify-end">
            <span className="font-semibold">{filteredReports.length} reports</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px] border border-emerald-200">
              AI-Indexed & Verified
            </span>
          </div>
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => {
            const count =
              cat === 'All Reports'
                ? reports.length
                : reports.filter((r) => r.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No reports found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No medical documents match your selected category or search query. Upload a report to add it to your health history.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All Reports');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {report.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center space-x-1 ${
                      report.verificationStatus.includes('Verified')
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{report.verificationStatus}</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{report.title}</h3>

                <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate font-medium">{report.providerName}</span>
                </div>

                <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Report: {report.reportDate}</span>
                  </span>
                  <span>•</span>
                  <span>Uploaded: {report.uploadDate}</span>
                  <span>•</span>
                  <span>{report.fileFormat} ({report.fileSize})</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                  {report.summary}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Extracted ({report.aiConfidence}%)</span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>View Report</span>
                  </button>

                  <button
                    onClick={() => {
                      alert(`Downloading official original document: ${report.title} (${report.fileFormat})`);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Download original document"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to remove "${report.title}" from your records?`)) {
                        onDeleteReport(report.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedReport.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">{selectedReport.providerName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Metadata strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Report Date</span>
                  <span className="font-semibold text-slate-800">{selectedReport.reportDate}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Category</span>
                  <span className="font-semibold text-slate-800">{selectedReport.category}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Verification</span>
                  <span className="font-bold text-emerald-700">{selectedReport.verificationStatus}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Format / Size</span>
                  <span className="font-semibold text-slate-800">{selectedReport.fileFormat} • {selectedReport.fileSize}</span>
                </div>
              </div>

              {/* AI Clinical Summary */}
              <div className="space-y-1.5">
                <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>AI Clinical Summary</span>
                </div>
                <p className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-slate-700 leading-relaxed font-medium">
                  {selectedReport.summary}
                </p>
              </div>

              {/* Extracted Key Findings */}
              {selectedReport.extractedFields.keyFindings.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block">Extracted Key Findings</span>
                  <ul className="space-y-1.5">
                    {selectedReport.extractedFields.keyFindings.map((finding, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Extracted Results / Lab metrics / Medications */}
              {selectedReport.extractedFields.results.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block">Key Metrics & Parameters</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedReport.extractedFields.results.map((res, i) => (
                      <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 block truncate">{res.label}</span>
                        <div className="flex items-baseline space-x-1 mt-0.5">
                          <span className="text-sm font-black text-slate-900">{res.value}</span>
                          {res.unit && <span className="text-[10px] text-slate-500 font-semibold">{res.unit}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Original Document Preview Mock */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 block">Original Source Document</span>
                <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto border border-slate-800">
                  {selectedReport.originalPreviewText}
                </div>
              </div>

              {/* Verification & Doctor Sharing Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  {selectedReport.verificationStatus !== 'Patient Verified' && (
                    <button
                      onClick={() => {
                        onVerifyReport(selectedReport.id, 'Patient Verified');
                        setSelectedReport({ ...selectedReport, verificationStatus: 'Patient Verified' });
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors flex items-center space-x-1 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm & Verify Record</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSelectedReport(null);
                      onOpenSharing();
                    }}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold rounded-xl transition-colors flex items-center space-x-1"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Include in Doctor Sharing</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    alert(`Downloading official PDF copy: ${selectedReport.title}.pdf`);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload & AI Extraction Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Upload Medical Report</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadStep === 'idle' && (
              <div className="space-y-4 text-xs">
                <p className="text-slate-600">
                  Upload PDF reports, scanned documents, prescriptions, or laboratory tests. MediBridge AI will extract key fields and organize them into your health profile.
                </p>

                {/* Drag and Drop Zone */}
                <div
                  onClick={() =>
                    handleSimulateUpload(
                      'Labcorp_Endocrinology_Followup.pdf',
                      'Laboratory Tests',
                      'Labcorp Clinical Diagnostics'
                    )
                  }
                  className="p-8 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl bg-slate-50/70 hover:bg-blue-50/30 text-center space-y-2 cursor-pointer transition-all"
                >
                  <Upload className="w-8 h-8 text-blue-600 mx-auto" />
                  <p className="font-bold text-slate-700">Click to upload or drag files here</p>
                  <p className="text-[11px] text-slate-400">Supports PDF, JPG, PNG, Scanned files up to 25MB</p>
                </div>

                {/* Quick Presets for Demo Testing */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Or select sample document to simulate:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleSimulateUpload(
                          'Swedish_Neurology_Consult_Note.pdf',
                          'Doctor Visit Summaries',
                          'Swedish Neuroscience Institute'
                        )
                      }
                      className="p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl border border-slate-200 text-left font-medium transition-colors"
                    >
                      <span className="font-bold block truncate">Neurology Consult</span>
                      <span className="text-[10px] text-slate-400">Doctor Visit Summary</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleSimulateUpload(
                          'Pacific_Derm_Biopsy_Results.pdf',
                          'Laboratory Tests',
                          'Pacific Skin & Allergy Center'
                        )
                      }
                      className="p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl border border-slate-200 text-left font-medium transition-colors"
                    >
                      <span className="font-bold block truncate">Derm Pathology</span>
                      <span className="text-[10px] text-slate-400">Lab Analysis</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Uploading & Step 3: OCR extracting */}
            {(uploadStep === 'uploading' || uploadStep === 'ocr_extracting') && (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center animate-spin">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {uploadStep === 'uploading' ? 'Uploading document...' : 'AI OCR & Entity Extraction in progress...'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {uploadStep === 'uploading'
                      ? 'Securely encrypting and storing file'
                      : 'Extracting dates, test names, results, units, and medications...'}
                  </p>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden max-w-xs mx-auto">
                  <div
                    className={`h-full bg-blue-600 transition-all duration-1000 ${
                      uploadStep === 'uploading' ? 'w-1/2' : 'w-5/6'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review and Verify */}
            {uploadStep === 'review' && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">AI Extraction successful! Please review extracted fields:</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Report Title</label>
                    <input
                      type="text"
                      value={extractedForm.title}
                      onChange={(e) => setExtractedForm({ ...extractedForm, title: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Provider / Facility</label>
                      <input
                        type="text"
                        value={extractedForm.providerName}
                        onChange={(e) => setExtractedForm({ ...extractedForm, providerName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Report Date</label>
                      <input
                        type="date"
                        value={extractedForm.reportDate}
                        onChange={(e) => setExtractedForm({ ...extractedForm, reportDate: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={extractedForm.category}
                      onChange={(e) => setExtractedForm({ ...extractedForm, category: e.target.value as ReportCategory })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    >
                      {categories.filter((c) => c !== 'All Reports').map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Summary Note</label>
                    <textarea
                      rows={2}
                      value={extractedForm.summary}
                      onChange={(e) => setExtractedForm({ ...extractedForm, summary: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveUploadedReport}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20"
                  >
                    Save & Add to Health Records
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadStep('idle')}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
