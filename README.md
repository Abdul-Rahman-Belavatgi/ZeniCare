# Zenicare
### One Patient. One Medical Story. Better Connected Care.

**Team:** Team Zenith  
**Event:** Jarvis 3.0  
**Challenge / event name:** Builda-Saur

Zenicare is a healthcare continuity platform concept designed to help patients bring medical records from different healthcare providers into one organized history and share selected records with doctors through patient-controlled consent.

> **Project status:** Hackathon project / prototype. Feature availability depends on the current implementation. Use synthetic demo records for presentations; do not upload real patient data into an unverified demo environment.

## Table of Contents
- [Problem Statement](#problem-statement)
- [Our Solution](#our-solution)
- [Core Features](#core-features)
- [Demo Workflow](#demo-workflow)
- [Proposed Architecture](#proposed-architecture)
- [Getting Started](#getting-started)
- [Privacy and Clinical Safety](#privacy-and-clinical-safety)
- [Current Scope and Future Enhancements](#current-scope-and-future-enhancements)
- [Team](#team)

## Problem Statement

Patients often have medical records scattered across different hospitals, clinics, and diagnostic centres. This makes it difficult to maintain a complete medical history or give a new doctor the information they need. Important details—such as prescriptions, test results, allergies, and previous clinical notes—may be difficult to find when care is spread across providers.

Zenicare aims to make that information easier to organize, review, and share with the patient's permission.

## Our Solution

Zenicare brings a patient's available medical documents into one organized record. It supports a timeline across healthcare providers, AI-assisted extraction of information from uploaded documents, and consent-based sharing with doctors.

The prototype is organized around four main areas:

1. **Clinical Overview** — a high-level view of records, connected facilities, and relevant safety alerts.
2. **Timeline & History** — a chronological view of clinical entries from different providers.
3. **Upload & Records** — a central library for medical documents and AI-assisted extraction.
4. **Doctors & Consent** — patient-controlled sharing permissions and access management.

## Core Features

### 1. Clinical Overview
- Summarizes the patient's available medical record.
- Shows record and connected-facility counts when supported by the data.
- Highlights documented safety discrepancies for review.
- Provides a quick route to the record-sharing workflow.

### 2. Timeline & History
- Organizes clinical entries chronologically across providers.
- Supports facility and date filtering where implemented.
- Shows clinical notes, including SOAP-style notes when available.
- Links timeline entries to their corresponding medical documents.
- Allows a user to add a clinical entry if that workflow is enabled.

**SOAP notes** use four sections:
- **Subjective:** what the patient reports.
- **Objective:** measured or observed findings.
- **Assessment:** the clinician's documented assessment.
- **Plan:** the documented next steps.

### 3. Upload & Records
- Provides a central place to upload and review medical documents.
- Organizes documents by type, such as laboratory reports, prescriptions, discharge summaries, and scans/imaging.
- Supports AI-assisted extraction of fields such as provider, date, diagnosis, and prescribed medicines when available.
- Allows extracted information to be reviewed before it is added to the record.
- Supports a unified record workflow so the same document can be referenced from the library and timeline rather than uploaded again.

**Radiology and multi-page reports:** A sonography or other imaging PDF may contain scan images on one page and written findings on another. The intended workflow keeps the original document together, allows page-by-page viewing, and links extracted text to its source page where supported.

### 4. Doctors & Consent
- Lets a patient grant access to a doctor through a consent workflow.
- Supports time-limited access and revocation where implemented.
- Is intended to let patients control which records are shared.
- Can display recent access activity when access logging is implemented.

A visual consent screen alone does not guarantee that access is securely enforced. The backend must validate permissions on every protected record request.

## Demo Workflow

A suggested presentation flow:

1. Sign in using the project's demo account, if configured.
2. Open **Clinical Overview** to see the unified-record concept.
3. Open **Timeline & History** and review entries from multiple facilities.
4. Upload or select a synthetic sample medical document in **Upload & Records**.
5. Review the extracted fields and correct any errors before confirming them.
6. Check that the confirmed entry appears in the timeline and links back to the original document.
7. Open **Doctors & Consent** and demonstrate granting or revoking access, if the backend workflow is implemented.

Use fictional patient information for demonstrations. Do not represent sample records as real hospital data.

## Proposed Architecture

The project description refers to a web interface, a backend extraction workflow, and a local AI model for document parsing. Confirm the actual stack and versions in the repository before relying on this section.

| Layer | Intended responsibility |

| Frontend | Dashboard, medical timeline, document library, and consent screens |
| Backend/API | Upload handling, extraction requests, record management, and authorization |
| AI extraction | Extract structured fields from document text for user review |
| Storage/database | Store document metadata, extracted fields, timeline entries, and consent records |
| Local demo model | The project notes describe a local Llama 3.2 3B model served through Ollama; verify that it is configured in the current code |

The project notes mention React/Vite or a plain HTML/JavaScript frontend and a Python backend. The exact framework, API routes, environment variables, and dependency commands must be confirmed from the repository before adding specific installation commands.

## Getting Started

### Prerequisites

Check the current codebase for its actual requirements. The project notes mention these possible dependencies:

- Node.js and npm, if the frontend uses React/Vite.
- Python, if a Python backend is included.
- Ollama and the `llama3.2:3b` model, if the local AI extraction workflow is configured.

### Run locally

The exact commands depend on the files in this repository. Before publishing setup instructions, confirm:
- The frontend directory and its `package.json` scripts.
- The backend entry point and `requirements.txt` (or equivalent).
- Required environment variables and configuration.
- Whether Ollama is required, and which model name is configured.
- The ports used by the frontend and backend.

Once confirmed, replace this section with the verified commands. Do not publish API keys, passwords, patient records, or other secrets in this repository.

## Privacy and Clinical Safety

Zenicare is intended to help organize and explain records; it is not a substitute for professional medical advice.

- Use synthetic data in demos and development.
- Treat AI-extracted fields as unverified until reviewed.
- Distinguish **AI Extracted**, **Patient Reviewed**, and **Clinician Verified**. Do not label a record clinician-verified unless a clinician actually verified it.
- Preserve the original document and provide a way to check extracted information against it.
- Do not invent missing medical information or reference ranges.
- Compare laboratory results only when the test, units, and applicable reference context are compatible. If a reliable reference source is not available, show that the range could not be established.
- Do not present AI output as a confirmed diagnosis or instruct patients to start, stop, or change medicines.
- Protect uploaded documents with private storage and server-side authorization.
- Enforce consent and revocation in the backend, not only in the user interface.
- Avoid putting sensitive medical details directly in QR codes or public URLs.
- Do not claim production-grade security, regulatory compliance, real hospital integration, or verified clinical performance unless these have been implemented and validated.

## Current Scope and Future Enhancements

### Core prototype focus
- Unified patient medical history across providers.
- Central medical-document upload and review.
- AI-assisted document extraction with patient review.
- Timeline entries linked to original records.
- Patient-controlled doctor sharing and consent.

### Potential future enhancements
- Reliable reference-range lookup for laboratory tests, with source and applicable context.
- Better comparison of compatible laboratory results over time.
- Enhanced multi-page radiology and sonography viewing.
- Integration with verified healthcare-provider directories.
- Appointment booking and emergency features, if they fit the final problem statement.
- Interoperability with established healthcare data standards, once the required integrations are implemented and tested.

## Team Zenith

**Event:** Jarvis 3.0  
**Challenge / event name:** Builda-Saur

### Team Members
Amir Shaikh 

Rashmi Rawat

Pratigya Sharma

Abdul Rahman


## Disclaimer
Zenicare is a prototype intended for demonstration and development. It does not replace clinical judgement, and any sample records or AI-generated explanations must be reviewed before being used for real-world healthcare decisions.
