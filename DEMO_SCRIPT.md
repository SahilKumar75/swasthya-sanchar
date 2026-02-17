# Swasthya Sanchar - Demo Script (Hackverse 4.0)

10-minute presentation flow for judges.

---

## 1. Hook (30 sec)

"What if healthcare worked like Uber - you could track your care journey in real time, and it worked even in villages with no internet?"

---

## 2. Zero-Net QR (2 min)

- Show QR code on patient Emergency page.
- Turn phone to **airplane mode**.
- Scan QR with another device: medical data appears without internet.
- Use **Read Aloud** in Hindi to show voice accessibility.
- Message: "This saves lives in rural emergencies when the network is down."

**Steps:**
1. Log in as patient, go to **Emergency**.
2. Generate Zero-Net QR (already embedded in URL).
3. Airplane mode on phone, open cached `/emergency/...` or scan QR on second device.
4. Tap **Read Aloud** – Hindi TTS reads data; phone numbers are digit-by-digit.

---

## 3. Journey Tracking (2 min)

- Patient: **Journey** > **Start New Visit** > choose hospital (e.g. AIIMS Delhi) > select departments > **Start Journey**.
- Show live tracker: current step, queue position, estimated wait.
- **Share with Family**: create share link, open on second device – family view.
- Staff: open **Hospital Admin** (`/hospital/admin`), select journey, **Start Service** / **Complete** on checkpoint.
- Message: "Families can track from anywhere; staff update once, everyone sees it."

**Steps:**
1. Patient: `/patient/journey` > Start New Visit > AIIMS Delhi > Start Journey.
2. Copy share link from **Share with Family**.
3. Open link in incognito/second device – family view.
4. Second tab: `/hospital/admin` > select active journey > Staff checkpoint updater > mark step complete.
5. Refresh family view – progress updates.

---

## 4. Voice & Accessibility (1 min)

- **Settings** > **Accessibility**: turn on **Simple Mode** (large buttons), **High Contrast**.
- Patient home: tap **Voice command**, say "medications" or "allergies" – app speaks the answer.
- Say "journey" or "emergency" – navigates.
- Message: "Works for illiterate and elderly users; Hindi and English."

**Steps:**
1. Settings > Accessibility > Simple Mode ON, High Contrast ON.
2. Patient portal home > **Voice command** > say "medications" / "allergies" / "journey" / "emergency" / "help".

---

## 5. Language & Signup (1 min)

- Show **Preferred Language** on signup (English, Hindi, Marathi, Bhojpuri).
- After signup, app uses that language; change later in **Language** selector.
- Message: "India-first: language chosen at signup, app stays in that language."

---

## 6. Blockchain & Records (1 min)

- Patient: **Medical Records** – list of records (if any).
- **Permissions**: grant/revoke doctor access.
- Doctor: **Patients** > view shared records.
- Message: "Patients own their data; access is permission-based and auditable."

---

## 7. AI Health Insights (1 min)

- Patient home: complete profile (allergies, conditions, medications) > **Generate Insights**.
- Show DO's and DON'Ts from Groq/Llama.
- Message: "Personalized advice from their own data, no typing required."

---

## 8. Close (30 sec)

- Recap: Zero-Net QR (offline), Journey tracking (family + staff), Voice + accessibility, Language at signup, Blockchain records, AI insights.
- "Swasthya Sanchar: healthcare that works for Bharat – urban, rural, literate, and illiterate."

---

## Pre-Demo Checklist

- [ ] Seed hospitals: `POST /api/seed` (or already seeded).
- [ ] Test patient account with profile and at least one journey.
- [ ] Test doctor account with access to that patient.
- [ ] Clear browser cache or use incognito for family view.
- [ ] Phone 1: Patient journey view.
- [ ] Phone 2: Family tracking view (shared link).
- [ ] Laptop: Doctor portal + Hospital admin.
- [ ] Language selector and Settings > Accessibility tested.
- [ ] Voice command tested in Chrome (Speech Recognition support).

---

## URLs Quick Reference

| Role   | Page              | URL                    |
|--------|-------------------|------------------------|
| Patient| Home              | /patient-portal/home   |
| Patient| Journey           | /patient/journey       |
| Patient| Start Visit        | /patient/journey/start |
| Patient| Emergency QR       | /patient/emergency     |
| Patient| Records            | /patient/records       |
| Family | Track (shared)     | /journey/track/[id]?share=[code] |
| Staff  | Hospital Admin     | /hospital/admin        |
| Staff  | Update checkpoint  | /hospital/journey/[id] |
| Doctor | Patients          | /doctor-portal/patients|
| All    | Settings           | /settings              |
