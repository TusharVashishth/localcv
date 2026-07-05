# Job Tracker — Full Flow Design
> Based on deep scan of your app's architecture, DB versioning, navigation, and existing flows.

---

## 🧭 Core Answer: Yes, Dedicated Section — But Deeply Connected

The tracker should be a **standalone section** (its own module page), not buried inside the dashboard. But it must be **deeply linked** to your existing `CompanyResume` and cover letter flows — not a siloed afterthought.

The mental model:
> **Company Resumes** = your document vault per company  
> **Job Tracker** = your pipeline manager per application  
> Both talk to each other — a tracker card can have an attached `CompanyResume` + cover letter.

---

## 🗺️ Full User Flow

### Flow A — Starting from Tracker (most common)
```
Dashboard → [Job Tracker] nav button
  ↓
Tracker Page (Kanban / List view)
  ↓
"+ Add Job" button
  ↓
Add Job Drawer/Dialog (step 1):
  • Company Name (required)
  • Role / Job Title (required)
  • Job URL (optional, saved locally)
  • Application Date (default: today)
  • Status (default: "Saved")
  ↓
Job Card created → appears in "Saved" column
  ↓
User opens the card → Job Detail Side Panel/Page:
  • Edit notes
  • Change status (drag or dropdown)
  • Attach Company Resume (see below)
  • Attach Cover Letter (auto-pulls from linked CompanyResume)
  • View linked resume / cover letter inline
  • Set follow-up date / reminder note
```

### Flow B — Starting from Company Resume (your key integration point)
```
Company Resumes page → user has just generated resume for "Google - SWE"
  ↓
"Track This Application" button on CompanyResumeCard (new action)
  ↓
Pre-filled "Add Job" drawer opens:
  • Company Name: "Google" (pre-filled from CompanyResume.companyName)
  • JD: pre-filled from CompanyResume.jobDescription
  • CompanyResume already linked
  ↓
Job card created in "Applied" status (since they already have a resume)
```

This Flow B is the **killer integration** — it makes the tracker feel native, not bolted on.

---

## 📄 Page Structure

```
/dashboard/tracker
```
A new module under `app/(modules)/dashboard/tracker/page.tsx` following the exact same pattern as `company-resumes`.

### View modes (tab toggle, top right):
| View | When useful |
|---|---|
| **Kanban** (default) | Active job hunting — see pipeline at a glance |
| **List / Table** | Power users tracking 20+ applications |

### Kanban Columns:
```
Saved  →  Applied  →  Screening  →  Interview  →  Offer  →  Rejected / Withdrawn
```
Each column shows a count badge. Cards are draggable between columns.

---

## 🗃️ Database Schema (New Table — DB v5)

Follows your exact Dexie versioning pattern:

```typescript
// New interface in db/schema.ts
export interface JobApplication {
  id?: number;
  companyName: string;
  role: string;
  jobUrl?: string;
  jobDescription?: string;          // optional — pasted JD for quick reference
  status: JobApplicationStatus;
  applicationDate: string;          // ISO date string
  followUpDate?: string;            // ISO date string
  notes?: string;                   // plain text / markdown notes
  salaryMin?: number;               // optional salary range
  salaryMax?: number;
  currency?: string;
  companyResumeId?: number;         // FK → CompanyResume.id (nullable)
  recruiterName?: string;
  recruiterEmail?: string;
  source?: string;                  // "LinkedIn" | "Company Site" | "Referral" | etc.
  createdAt: Date;
  updatedAt: Date;
}

export type JobApplicationStatus =
  | "saved"
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";
```

```typescript
// db/index.ts — new v5 migration (additive, never modifies previous versions)
db.version(5).stores({
  jobApplications: "++id, status, companyResumeId, applicationDate",
});
```

**Key design decisions:**
- `companyResumeId` is a **soft FK** — if the linked CompanyResume is deleted, the tracker card still exists with a broken reference (show "Resume deleted" gracefully)
- Cover letter is NOT a separate FK — it's accessed via `CompanyResume.coverLetter` (already embedded in the schema)
- `notes` is free text — keep it simple, don't over-engineer

---

## 🔗 Attaching Existing Resume & Cover Letter — The Right UX

### In the Job Detail Panel:

```
┌─────────────────────────────────────┐
│ Linked Resume & Cover Letter        │
│ ─────────────────────────────────── │
│ No resume attached                  │
│                                     │
│  [Attach Existing]  [Create New →]  │
└─────────────────────────────────────┘
```

**"Attach Existing" flow:**
- Opens a small picker dialog listing all `CompanyResume` entries from IndexedDB
- Filter by company name (matches the job card's company name automatically)
- Shows: Company name, creation date, whether cover letter exists (✓ badge — same as your existing `CompanyResumeCard`)
- User selects one → `companyResumeId` is saved to the `JobApplication` record

**"Create New →" flow:**
- Navigates to `/dashboard/company-resumes` with query param `?prefill=companyName` 
- After generation, user comes back to tracker and attaches it

**Once attached — the card shows:**
```
┌─────────────────────────────────────┐
│ Linked Resume & Cover Letter        │
│ ─────────────────────────────────── │
│ ✅ Google – SWE Resume              │
│    Created Jun 28 · With Cover ✉    │
│                                     │
│  [View Resume]  [View Cover Letter] │
│  [Detach]                           │
└─────────────────────────────────────┘
```

Cover letter access is automatic — it reads `CompanyResume.coverLetter` through the linked ID. **No extra storage needed.**

---

## 🧩 Component Breakdown (follows your feature folder pattern)

```
src/components/features/job-tracker/
  components/
    job-tracker-client.tsx          ← main client (like company-resumes-client.tsx)
    job-tracker-kanban.tsx          ← Kanban board with drag-and-drop columns
    job-tracker-list.tsx            ← table/list view alternative
    job-card.tsx                    ← individual card in kanban column
    add-job-dialog.tsx              ← "Add Job" form dialog (like create-company-resume-dialog.tsx)
    job-detail-panel.tsx            ← side panel/sheet for editing notes, status, attachments
    resume-picker-dialog.tsx        ← picker to attach an existing CompanyResume
    tracker-stats-bar.tsx           ← summary stats: X applied, Y interviews, Z offers
  hooks/
    use-job-applications.ts         ← Dexie CRUD hook (like use-company-resumes.ts)
  types/
    job-tracker-types.ts
  schema/
    job-tracker-schema.ts           ← Zod schema for add-job form validation
```

```
src/app/(modules)/dashboard/tracker/
  page.tsx                          ← server page wrapping JobTrackerClient
```

---

## 🎨 UX Details to Match Your Existing Design Language

### Status color coding (using your existing badge pattern):
| Status | Color |
|---|---|
| Saved | gray / muted |
| Applied | blue / primary |
| Screening | amber / yellow |
| Interview | violet / purple |
| Offer | emerald / green |
| Rejected | red / destructive muted |
| Withdrawn | gray / muted |

### Stats bar at top of tracker:
```
📬 12 Applied   📞 3 Screening   💬 1 Interview   ✅ 0 Offers
Response rate: 25%  |  Avg. time to response: 8 days
```
These stats are **computed purely from IndexedDB** — no AI needed.

### Empty state:
When no jobs added yet — show a compelling empty state with "Start tracking your first application" and a CTA that explains *why* tracking matters (response rates, follow-up timing).

---

## 🔑 Navigation Integration

Add "Tracker" to the navbar in `app/(modules)/layout.tsx` alongside "Dashboard":

```tsx
// In the existing nav actions div
<Button variant="ghost" size="sm">
  <Link href="/dashboard/tracker" className="flex items-center gap-1.5">
    <Kanban className="size-4" />
    Tracker
  </Link>
</Button>
```

And in the `DashboardClient` — add a new card/section in the feature grid linking to `/dashboard/tracker`.

---


