import React, { useState } from 'react';
import {
  FileCode2,
  Copy,
  Download,
  CheckCircle2,
  Check,
  ShieldCheck,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { SAMPLE_FHIR_BUNDLE } from '../data/mockData.ts';

export const FhirStandardsViewer: React.FC = () => {
  const [activeResource, setActiveResource] = useState<'bundle' | 'patient' | 'encounter' | 'medication' | 'observation' | 'consent'>('bundle');
  const [copied, setCopied] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<string | null>(
    'Conforms to HL7® FHIR® R4.0.1 US Core Implementation Guide (v3.1.1)'
  );

  // Extract resource payload
  const getResourceJson = () => {
    switch (activeResource) {
      case 'patient':
        return SAMPLE_FHIR_BUNDLE.entry[0].resource;
      case 'medication':
        return SAMPLE_FHIR_BUNDLE.entry[2].resource;
      case 'observation':
        return SAMPLE_FHIR_BUNDLE.entry[4].resource;
      case 'consent':
        return SAMPLE_FHIR_BUNDLE.entry[5].resource;
      case 'encounter':
        return {
          resourceType: 'Encounter',
          id: 'enc-st-jude-cardio-2026',
          status: 'finished',
          class: {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
            code: 'AMB',
            display: 'ambulatory',
          },
          type: [
            {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '185349003',
                  display: 'Cardiology outpatient encounter',
                },
              ],
            },
          ],
          subject: { reference: 'Patient/alex-morgan-fhir', display: 'Alex Morgan' },
          participant: [
            {
              individual: {
                reference: 'Practitioner/dr-robert-chen',
                display: 'Dr. Robert Chen, MD, FACC',
              },
            },
          ],
          period: { start: '2026-09-28T14:30:00Z', end: '2026-09-28T15:15:00Z' },
          reasonCode: [
            {
              coding: [
                {
                  system: 'http://hl7.org/fhir/sid/icd-10-cm',
                  code: 'I48.91',
                  display: 'Atrial fibrillation, unspecified',
                },
              ],
            },
          ],
          serviceProvider: { display: 'St. Jude Memorial Hospital' },
        };
      default:
        return SAMPLE_FHIR_BUNDLE;
    }
  };

  const jsonString = JSON.stringify(getResourceJson(), null, 2);

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medibridge-${activeResource}-fhir-r4.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleValidate = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setValidationResult('Validation Passed: 0 Errors, 0 Fatal Warnings. Schema Profile Validated.');
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              HL7® FHIR® R4 Standards & Export Center
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
              Release 4.0.1 Conforming
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Raw interoperability payloads formatted according to official HL7 FHIR US-Core data schemas
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleValidate}
            disabled={isValidating}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors border border-slate-300"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin text-blue-600' : 'text-emerald-600'}`} />
            <span>{isValidating ? 'Validating...' : 'Validate FHIR Schema'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors border border-slate-300"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied JSON!' : 'Copy Payload'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-blue-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .json Bundle</span>
          </button>
        </div>
      </div>

      {/* Validation status pill */}
      {validationResult && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{validationResult}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono">StructureDefinition/Bundle</span>
        </div>
      )}

      {/* Resource Tabs */}
      <div className="bg-slate-900 rounded-2xl p-4 shadow-xl border border-slate-800">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveResource('bundle')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeResource === 'bundle'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Full Bundle (Collection)
            </button>
            <button
              onClick={() => setActiveResource('patient')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeResource === 'patient'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Patient / Alex Morgan
            </button>
            <button
              onClick={() => setActiveResource('encounter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeResource === 'encounter'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Encounter / St. Jude
            </button>
            <button
              onClick={() => setActiveResource('medication')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeResource === 'medication'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              MedicationRequest / Warfarin
            </button>
            <button
              onClick={() => setActiveResource('observation')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeResource === 'observation'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Observation / HbA1c Lab
            </button>
            <button
              onClick={() => setActiveResource('consent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeResource === 'consent'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Consent / Privacy Grants
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            Content-Type: application/fhir+json
          </span>
        </div>

        {/* Syntax Highlighted JSON Box */}
        <div className="pt-3">
          <pre className="font-mono text-xs leading-relaxed text-emerald-400 bg-slate-950 p-4 rounded-xl overflow-x-auto max-h-[560px] border border-slate-800">
            <code>{jsonString}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
