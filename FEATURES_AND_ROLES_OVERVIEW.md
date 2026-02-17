## Swasthya Sanchar – Features, Roles & Problem-Statement Coverage

This document is derived from actual code in the repo (pages, components, and API routes) and your clarified hackathon problem statements.

---

## 1. Roles Implemented (Verified from Code)

- **Patient**
  - `app/patient-portal/home/page.tsx`
  - `app/patient/journey/*`
  - `app/patient/emergency/page.tsx`
  - `app/patient/records/page.tsx`
  - `app/patient/permissions/page.tsx`
  - `app/patient/register/page.tsx`
- **Doctor**
  - `app/doctor-portal/home/page.tsx`
  - `app/doctor-portal/patients/page.tsx`
  - `app/doctor-portal/upload/page.tsx`
  - `app/doctor-portal/voice/page.tsx`
  - `app/doctor-portal/voice/[id]/page.tsx`
- **Hospital Staff / Admin**
  - `app/hospital/admin/page.tsx` (queue dashboard)
  - `app/hospital/journey/[id]/page.tsx` (checkpoint updater)
- **Family / Caregiver**
  - `app/journey/track/[id]/page.tsx` (public tracking via share code)
  - `app/patient-portal/home/page.tsx` + `components/JourneyTracker.tsx` (share link)
- **First Responder / Emergency Staff**
  - `app/emergency/[address]/page.tsx`
  - `app/patient/emergency/page.tsx`
- **Platform / System Roles (supporting)**
  - Auth & identity: `app/auth/*`, `app/api/auth/[...nextauth]/route.ts`
  - Blockchain & wallet: `app/api/user/wallet`, `app/api/user/link-wallet`, `contracts/*` (outside current scan)
  - Messaging / Integrations: `app/api/whatsapp/webhook`, `app/api/sms/send`

---

## 2. Feature Inventory (Verified from Code)

### 2.1 Patient-Facing Features

- **Patient portal home & profile**
  - `app/patient-portal/home/page.tsx`
  - Loads patient profile via `/api/patient/status`.
  - Shows **BMI**, blood group rarity, chronic conditions, medications.
  - AI insights powered by `/api/ai/health-insights`.

- **Blockchain-backed registration & wallet**
  - `app/patient/register/page.tsx`
  - APIs: `/api/patient/register`, `/api/user/wallet`, `/api/user/link-wallet`, `/api/patient/sync`.

- **Journey management**
  - Pages: `app/patient/journey/page.tsx`, `app/patient/journey/start/page.tsx`, `app/patient/journey/[id]/page.tsx`.
  - APIs: `/api/journey` (list/create), `/api/journey/[id]` (get/update), `/api/hospitals`, `/api/hospitals/[id]/journeys`.
  - Real-time tracker UI implemented in `components/JourneyTracker.tsx`.

- **Public / family tracking**
  - Share API: `/api/journey/[id]/share` (GET/POST/DELETE).
  - Public page: `app/journey/track/[id]/page.tsx` (uses `JourneyTracker` with `shareCode`).

- **Emergency QR & Zero-Net integration**
  - Patient emergency view: `app/patient/emergency/page.tsx` (generates QR via `qrcode` and blockchain address).
  - First-responder view: `app/emergency/[address]/page.tsx`.
  - Backend routes: `/api/emergency/[address]`, `/api/qr/generate`.

- **Medical records & permissions**
  - Records: `app/patient/records/page.tsx` + `/api/records/get`.
  - Doctor access: `app/patient/permissions/page.tsx` + `/api/patient/grant-access`, `/api/patient/revoke-access`.
  - Doctor upload: `app/doctor-portal/upload/page.tsx` + `/api/doctor/upload-record`.

- **AI Health Insights**
  - `app/patient-portal/home/page.tsx`:
    - Gathers age, BMI, conditions, meds, allergies.
    - Calls `/api/ai/health-insights` to generate DOs & DON’Ts.
    - Custom input modal: `components/patient/CustomAIInputModal.tsx`.

- **Voice commands for patients**
  - Hook: `hooks/useVoiceCommand.ts` – maps EN/Hindi phrases to intents (`medications`, `allergies`, `conditions`, `journey`, `emergency`, etc.).
  - Used in `app/patient-portal/home/page.tsx` to:
    - Speak meds / allergies / conditions using `SpeechSynthesis`.
    - Navigate to `/patient/journey` or `/patient/emergency`.

- **Language & localization**
  - Context + translations: `contexts/LanguageContext.tsx`, `lib/i18n/translations.ts`.
  - Multi-language (EN/HI/MR/BH) UI strings for nav, landing, portals, emergency, footer, etc.

- **Accessibility controls**
  - Context: `contexts/AccessibilityContext.tsx` with `simpleMode`, `highContrast`, `reducedMotion` and class toggles.
  - Settings UI: `app/settings/page.tsx` (not shown above but present in repo).

### 2.2 Doctor-Facing Features

- **Doctor portal home & patients**
  - `app/doctor-portal/home/page.tsx`, `app/doctor-portal/patients/page.tsx`.
  - Shows recent patients, permissions, and record upload flows.

- **Voice-based clinical documentation (SOAP notes)**
  - UI:
    - `app/doctor-portal/voice/page.tsx` – records consultations and lists clinical notes.
    - `app/doctor-portal/voice/[id]/page.tsx` – detailed note view (Chief Complaint, HPI, Exam, Diagnosis, Plan, Medications, Follow-up, raw transcript).
  - Component:
    - `components/voice/VoiceRecorder.tsx` – uses browser `SpeechRecognition` to capture transcript, then:
      - Calls `/api/voice/soap-note` to generate a structured SOAP note (AI).
      - Refreshes notes list via `/api/voice/notes`.
  - APIs:
    - `/api/voice/soap-note`
    - `/api/voice/notes`
    - `/api/voice/notes/[id]`

### 2.3 Hospital Staff / Admin Features

- **Hospital queue management dashboard**
  - `app/hospital/admin/page.tsx`:
    - Loads hospitals via `/api/hospitals?departments=true`.
    - Loads active journeys via `/api/hospitals/[id]/journeys`.
    - Shows:
      - Total queue size.
      - Active journey count.
      - Average wait time (computed from `currentQueue * avgServiceTime`).
      - Departments with utilization and capacity.
      - List of active journeys (links to staff journey page).

- **Checkpoint updater (service start/complete)**
  - `app/hospital/journey/[id]/page.tsx`:
    - Fetches journey via `/api/journey/[id]`.
    - Staff actions:
      - `Start Service` → sets checkpoint to `in_progress`.
      - `Complete` → sets checkpoint to `completed`.
    - Uses `/api/journey/[id]/checkpoint` to update checkpoint status and re-fetches journey.

### 2.4 Family / Caregiver Features

- **Public tracking link**
  - Generated and managed via `/api/journey/[id]/share`.
  - `JourneyTracker` supports `shareCode` for read-only view.
  - Used on `/journey/track/[id]` to allow family to see:
    - Current checkpoint, queue position.
    - Predicted wait-time range (via `/api/queue/predict`).
    - Overall progress and completion.

### 2.5 First-Responder / Emergency Features

- **Offline-friendly emergency page**
  - QR-based access: `/emergency/[address]` page + `/api/emergency/[address]`.
  - Patient portal generates QR to this route using wallet address.
  - Emergency view exposes blood group, allergies, conditions, emergency contact.
  - Text-to-speech and multi-language (via translations) enable non-English and low-literacy use.

### 2.6 Wait-Time Prediction & Queue Intelligence

- **Backend**
  - `/api/queue/predict` – returns `confidenceLow`, `confidenceHigh`, `source` (historical vs rule-based).
  - `/api/queue/stats/log` – logs queue metrics for training and rule-based estimates.

- **Frontend**
  - `components/JourneyTracker.tsx`:
    - For current checkpoint with `in_queue`/`in_progress`, calls `/api/queue/predict?departmentId=...`.
    - Displays `min–max` predicted wait range.
  - `app/hospital/admin/page.tsx`:
    - Derives per-department estimated wait (`currentQueue * avgServiceTime`).

### 2.7 Messaging & Integrations

- **WhatsApp**
  - Webhook route: `/api/whatsapp/webhook` with processor & sender (`lib/whatsapp/*`).
  - Templates defined in `lib/whatsapp/templates.ts`:
    - Journey started, checkpoint updates, emergency QR, voice AI responses.

- **SMS**
  - `/api/sms/send` – generic SMS sending endpoint (used as fallback for journey sharing and alerts).

### 2.8 Auth, Language, Accessibility

- **Auth**
  - `/auth/signup`, `/auth/login`, `/auth/error`.
  - Signup supports role selection (patient/doctor) and language.

- **Language preference**
  - API: `/api/user/language`.
  - Context: `contexts/LanguageContext.tsx`.

- **Accessibility**
  - `contexts/AccessibilityContext.tsx` + `app/settings/page.tsx`.
  - Toggles for simple mode, high contrast, reduced motion.

---

## 3. Mapping to Hackathon 2 Problem Statements

### 3.1 Problem 1 – Patient Journey Visibility & Real-Time Status Tracking

> **Statement**: Patients often lack clarity on wait times, next steps, and care progress. This problem focuses on making the patient journey visible and predictable.

**Present in code (implemented):**

- **Journey modeling & endpoints**
  - `app/api/journey` & `app/api/journey/[id]` – journeys and checkpoints.
  - `app/api/hospitals` & `app/api/hospitals/[id]/journeys` – hospital-level journey aggregation.

- **Patient-facing journey UI**
  - `app/patient/journey/*` – list, start, detail pages.
  - `components/JourneyTracker.tsx`:
    - Shows hospital, token, progress %, remaining minutes.
    - Displays each checkpoint with status, queue position, timing info.
    - Fetches **predicted wait-time range** from `/api/queue/predict`.
    - Auto-refresh every 30 seconds for active journeys.
    - “Read Aloud” status in Hindi for accessibility.

- **Family / caregiver visibility**
  - `/api/journey/[id]/share` – share codes for public tracking.
  - `app/journey/track/[id]/page.tsx` – read-only tracker via `JourneyTracker` with `shareCode`.

- **Hospital-side operations**
  - `app/hospital/admin/page.tsx` – queue dashboard:
    - Per-department queues and estimated waits.
    - Active journeys with current checkpoints and progress.
  - `app/hospital/journey/[id]/page.tsx` – staff checkpoint updater:
    - Explicit `Start Service` and `Complete` actions per step.

- **Prediction & analytics**
  - `/api/queue/predict` and `/api/queue/stats/log` as data plane.
  - JourneyTracker uses prediction output directly in UI.

**Partially present / could be extended:**

- **Richer journey explanations**
  - Currently mostly status + numbers; could add:
    - Plain-language step descriptions (“Registration”, “X-Ray”, etc.).
    - Reason codes for delays (not yet modeled).

- **Per-patient historical patterns**
  - Prediction is currently department-centric; no explicit “this is longer/shorter than your usual” comparison.

- **Realtime push vs poll**
  - JourneyTracker uses 30s polling; Supabase Realtime is used elsewhere, but full push-based journey updates could reduce lag.

### 3.2 Problem 2 – Documentation Burden & Smart Data Capture for Clinicians

> **Statement**: Clinicians spend excessive time typing and documenting. This challenge targets smarter data capture to reduce workload while improving data quality.

**Present in code (implemented):**

- **Voice-first documentation flow**
  - `components/voice/VoiceRecorder.tsx`:
    - Uses browser speech recognition for continuous dictation.
    - Shows live transcript in the UI.
    - On stop:
      - Sends transcript to `/api/voice/soap-note`.
      - Triggers AI to generate structured SOAP note.
  - `app/doctor-portal/voice/page.tsx`:
    - Wraps `VoiceRecorder` for doctors.
    - Fetches and lists existing AI-generated notes via `/api/voice/notes`.
  - `app/doctor-portal/voice/[id]/page.tsx`:
    - Displays full SOAP structure: Chief Complaint, HPI, Exam, Diagnosis, Plan, Medications, Follow-up, raw transcript.

- **Structured clinical data**
  - AI endpoint `/api/voice/soap-note` returns structured fields stored and later rendered.
  - Notes API `/api/voice/notes/[id]` exposes structured note for downstream integration.

**Partially present / missing vs ideal problem coverage:**

- **Direct linkage to patient journeys**
  - Current code does **not** clearly link voice notes to a specific `PatientJourney` or checkpoint (the plan calls this “optional”).
  - That means documentation is smart and structured, but not yet **contextually attached** to a path in the care journey.

- **Deep EHR integration & billing codes**
  - No explicit diagnosis coding (ICD-10/11), procedure codes, or billing export.
  - No templating per specialty (e.g. cardiology vs ortho) beyond generic SOAP.

- **Multi-language clinician speech**
  - VoiceRecorder uses a single `language` parameter (e.g. `"en-IN"`); there’s no separate mapping for full Hindi dictation, though browser APIs would support it with configuration.

---

## 4. Overall: What We Have vs What We Don’t

### 4.1 Strongly Implemented

- **Patient journey visibility (end-to-end)**
  - Modeled journeys and checkpoints.
  - Patient, staff, and family views with consistent status.
  - Queue metrics and basic prediction deployed in UI.

- **Voice-based smart documentation (for doctors)**
  - Browser-based speech recognition.
  - AI-generated SOAP notes stored and viewable in detail.

- **Emergency & offline access**
  - QR-based emergency pages wired to wallet addresses.
  - Multi-language text + TTS for emergency data.

- **Data ownership & sharing**
  - Blockchain identity and wallet linkage.
  - Permissioned doctor access and record upload per patient.

- **India-first UX**
  - Multi-language (EN/HI/MR/BH).
  - Voice commands for patients (journey/emergency/meds/allergies).
  - Accessibility toggles (simple mode, high contrast, reduced motion).

- **Messaging integrations**
  - WhatsApp webhook + templates.
  - SMS fallback.

### 4.2 Partially Implemented / Not Fully There Yet

- **Full real-time push for journeys**
  - Poll-based in `JourneyTracker`; could use Supabase Realtime for instant updates.

- **Explicit linkage between voice notes and journeys/checkpoints**
  - Planned but not clearly wired in the current code.

- **Richer analytics & forecasting**
  - Baseline prediction exists; full ML pipeline, forecasting dashboards, and historical charts are not in the UI.

- **Clinician workflow integration**
  - Currently focused on capturing notes; less on downstream workflows like signing, editing templates, exporting to external HIS/EHR.

- **End-to-end offline story**
  - Emergency QR is offline-ready; other surfaces (journey view, admin dashboards) expect connectivity.

---

## 5. Summary

- The **roles** covered in code are: Patient, Doctor, Hospital Staff/Admin, Family/Caregiver, and First Responder.
- For **Hackathon 2**:
  - The **patient journey visibility** problem is addressed robustly with journeys, checkpoints, queue dashboards, and prediction.
  - The **documentation burden** problem is significantly addressed via voice → AI SOAP notes, though linkage to journeys and deeper EHR integration remain future extensions.

