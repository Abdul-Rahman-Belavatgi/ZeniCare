import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Search,
  Eye,
  Plus,
  ArrowRight,
  Database,
} from 'lucide-react';
import { UploadedDocument } from '../types/index.ts';

interface AIDocumentLabProps {
  documents: UploadedDocument[];
  onUploadNewDocument: (doc: UploadedDocument) => void;
  onIngestToTimeline: (docId: string) => void;
}

export const AIDocumentLab: React.FC<AIDocumentLabProps> = ({
  documents,
  onUploadNewDocument,
  onIngestToTimeline,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [ingestedDocs, setIngestedDocs] = useState<{ [key: string]: boolean }>({});

  const activeDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingUpload(true);
    setUploadProgress(20);

    const timer1 = setTimeout(() => setUploadProgress(65), 500);
    const timer2 = setTimeout(() => {
      setUploadProgress(100);
      const newDoc: UploadedDocument = {
        id: `doc-${Date.now()}`,
        fileName: file.name,
        fileType: file.name.endsWith('.pdf') ? 'PDF' : 'JPEG',
        uploadDate: 'Just now',
        facilitySource: 'North Valley Family Clinic (Uploaded Records)',
        status: 'Extracted',
        confidenceScore: 97.8,
        documentCategory: 'Discharge Summary',
        rawOcrSnippet: `OCR EXTRACT [${file.name}]: Patient Alex Morgan, #NX-88204. Primary Care Follow-up. Assessed for Glycemic Stability and Lisinopril 10mg compliance. Blood pressure noted at 122/78 mmHg. Fasting glucose stable. No new adverse drug reactions reported. Signed: Dr. Meera Patel, MD.`,
        extractedEntities: {
          medications: [
            { name: 'Lisinopril', dose: '10 mg oral daily', frequency: 'Once daily' }
          ],
          vitals: [
            { label: 'Blood Pressure', value: '122/78 mmHg' }
          ],
          conditions: [
            { name: 'Essential Hypertension', code: 'ICD-10 I10' }
          ],
          allergies: []
        },
        sourceCitations: [
          { page: 1, boundingSnippet: 'Blood pressure noted at 122/78 mmHg (LOINC: 85354-9)', targetField: 'Observation/bp', verified: true },
          { page: 1, boundingSnippet: 'Lisinopril 10mg daily oral intake', targetField: 'MedicationRequest/lisinopril', verified: true }
        ]
      };

      onUploadNewDocument(newDoc);
      setSelectedDocId(newDoc.id);
      setIsProcessingUpload(false);
      setUploadProgress(0);
    }, 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  const handleIngest = (docId: string) => {
    setIngestedDocs((prev) => ({ ...prev, [docId]: true }));
    onIngestToTimeline(docId);
  };

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              AI Document Lab
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-purple-100 text-purple-800">
              OCR & Source Citations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Upload fragmented clinic PDFs, scanned discharge summaries, or lab sheets. MediBridge extracts clinical entities with verifiable source evidence and maps them to HL7 FHIR standards.
          </p>
        </div>

        {/* Upload Trigger */}
        <div className="relative">
          <input
            type="file"
            id="clinical-file-upload"
            accept=".pdf,.png,.jpg,.jpeg,.dicom"
            onChange={handleSimulatedFileUpload}
            className="hidden"
          />
          <label
            htmlFor="clinical-file-upload"
            className="cursor-pointer px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-xs"
          >
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Upload Medical Document (PDF/Image)</span>
          </label>
        </div>
      </div>

      {/* Upload Progress Bar if active */}
      {isProcessingUpload && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-xs text-purple-900 space-y-2 animate-pulse">
          <div className="flex justify-between font-bold">
            <span className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
              <span>Running Optical Character Recognition & Entity Disambiguation...</span>
            </span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-purple-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Main 2-Column Split: Document Repository & Extraction Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Uploaded Documents List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Uploaded Documents ({documents.length})
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Demo Dataset</span>
          </div>

          <div className="space-y-2">
            {documents.map((doc) => {
              const isSelected = selectedDocId === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-50/70 border-purple-300 ring-2 ring-purple-100'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2 truncate">
                      <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-purple-600' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {doc.fileName}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-white text-slate-700 border border-slate-200 rounded shrink-0">
                      {doc.fileType}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1 truncate">
                    {doc.facilitySource}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">{doc.uploadDate}</span>
                    <span className="font-bold text-emerald-600 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{doc.confidenceScore}% Confidence</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Extraction Review & Source Evidence */}
        <div className="lg:col-span-2 space-y-4">
          {activeDoc ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
              {/* Document Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-bold text-slate-900">
                      {activeDoc.fileName}
                    </h2>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-800 rounded-md">
                      {activeDoc.documentCategory}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Source: {activeDoc.facilitySource} • Processed {activeDoc.uploadDate}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>AI Confidence: {activeDoc.confidenceScore}%</span>
                  </span>

                  <button
                    onClick={() => handleIngest(activeDoc.id)}
                    disabled={ingestedDocs[activeDoc.id]}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      ingestedDocs[activeDoc.id]
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    {ingestedDocs[activeDoc.id] ? 'Ingested to FHIR Record' : 'Ingest to Record'}
                  </button>
                </div>
              </div>

              {/* Raw OCR Snippet Box */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wide">
                  Raw OCR Extraction Stream
                </span>
                <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-3.5 rounded-xl border border-slate-800 leading-relaxed overflow-x-auto max-h-36">
                  {activeDoc.rawOcrSnippet}
                </div>
              </div>

              {/* Extracted Structured Entities */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wide">
                  Extracted Clinical Entities (LOINC, RxNorm & ICD-10 Mapped)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Medications */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 block text-xs flex items-center justify-between">
                      <span>Prescriptions Detected</span>
                      <span className="text-[10px] text-purple-600 font-mono">RxNorm</span>
                    </span>
                    {activeDoc.extractedEntities.medications.length > 0 ? (
                      activeDoc.extractedEntities.medications.map((m, i) => (
                        <div key={i} className="bg-white p-2 rounded-lg border border-slate-200 text-slate-800">
                          <p className="font-bold">{m.name} ({m.dose})</p>
                          <p className="text-[11px] text-slate-500">{m.frequency}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 italic">No new medications in this document.</p>
                    )}
                  </div>

                  {/* Conditions */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 block text-xs flex items-center justify-between">
                      <span>Diagnoses / Findings</span>
                      <span className="text-[10px] text-blue-600 font-mono">ICD-10</span>
                    </span>
                    {activeDoc.extractedEntities.conditions.length > 0 ? (
                      activeDoc.extractedEntities.conditions.map((c, i) => (
                        <div key={i} className="bg-white p-2 rounded-lg border border-slate-200 text-slate-800">
                          <p className="font-bold">{c.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{c.code}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 italic">No primary diagnoses extracted.</p>
                    )}
                  </div>

                  {/* Vitals & Labs */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 block text-xs flex items-center justify-between">
                      <span>Vitals & Biomarkers</span>
                      <span className="text-[10px] text-emerald-600 font-mono">LOINC</span>
                    </span>
                    {activeDoc.extractedEntities.vitals.length > 0 ? (
                      activeDoc.extractedEntities.vitals.map((v, i) => (
                        <div key={i} className="bg-white p-2 rounded-lg border border-slate-200 text-slate-800 flex justify-between">
                          <span className="font-medium">{v.label}</span>
                          <span className="font-bold text-slate-900">{v.value}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 italic">No quantitative vitals in this document.</p>
                    )}
                  </div>

                  {/* Allergies */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-900 block text-xs flex items-center justify-between">
                      <span>Allergy Signals</span>
                      <span className="text-[10px] text-rose-600 font-mono">SNOMED CT</span>
                    </span>
                    {activeDoc.extractedEntities.allergies.length > 0 ? (
                      activeDoc.extractedEntities.allergies.map((a, i) => (
                        <div key={i} className="bg-rose-50 p-2 rounded-lg border border-rose-200 text-rose-900">
                          <p className="font-bold">{a.name}</p>
                          <p className="text-[11px] text-rose-700">{a.severity}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 italic">No allergy mentions in this document.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Source Evidence & Citations */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wide">
                  Verifiable Source Evidence Citations
                </span>

                <div className="space-y-2">
                  {activeDoc.sourceCitations.map((cite, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 text-xs flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-purple-200 text-purple-900 rounded font-mono">
                            Page {cite.page}
                          </span>
                          <span className="text-[11px] font-mono text-purple-800">
                            Target: {cite.targetField}
                          </span>
                        </div>
                        <p className="text-slate-800 italic">
                          "{cite.boundingSnippet}"
                        </p>
                      </div>

                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md shrink-0 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Source Verified</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
              Select or upload a document to review AI extraction evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
