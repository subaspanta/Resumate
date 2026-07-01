# ResumeForge — Sequence Diagrams

## Purpose

This document describes interaction between system components during ResumeForge's core business workflows.

Focus is on message flow and component responsibilities rather than implementation details.

Current document represents **Phase 1 (MVP)**.

Supported features:

* Upload Resume
* Resume Parsing
* Resume Analysis
* Resume Editor Editing
* AI Suggestions
* Export PDF

Job Title and Job Description workflows will be introduced in **Phase 2**.

---

# SD-001 Upload Resume

## Goal

Upload resume and generate Resume JSON.

```text
User
 │
 │ Upload Resume
 ▼
Frontend
 │
 │ POST /resumes
 ▼
Backend API
 │
 │ Validate Request
 ▼
Resume Module
 │
 │ Upload PDF
 ▼
Storage Module
 │
 │ Return File URL
 ▼
Resume Module
 │
 │ Parse Resume
 ▼
Parsing Module
 │
 ├── Extract Text
 ├── Detect Sections
 └── Generate Resume JSON
 │
 ▼
Resume Module
 │
 │ Save Resume
 ▼
Database
 │
 │ Success
 ▼
Frontend
 │
 ▼
User
```

### Result

* Resume created
* PDF stored
* Resume JSON generated
* Resume ready for analysis

---

# SD-002 Analyze Resume

## Goal

Generate general resume analysis.

```text
User
 │
 │ Analyze Resume
 ▼
Frontend
 │
 │ POST /analyses
 ▼
Backend API
 │
 ▼
Analysis Orchestrator
 │
 │ Load Resume JSON
 ▼
Database
 │
 │ Resume JSON
 ▼
Analysis Orchestrator
 │
 ▼
Resume Analysis Engine
 │
 ├── Validate Contact
 ├── Analyze Summary
 ├── Analyze Experience
 ├── Analyze Skills
 ├── Analyze Education
 ├── Resume Health
 ├── ATS Score
 └── Section Scores
 │
 ▼
AI Module
 │
 │ Generate Suggestions
 ▼
Analysis Orchestrator
 │
 │ Save Analysis
 ▼
Database
 │
 │ Analysis Complete
 ▼
Frontend
 │
 ▼
User
```

### Result

* Overall Score
* ATS Score
* Resume Health
* Section Scores
* AI Suggestions
* Analysis stored

---

# SD-003 View Analysis

## Goal

Display previously completed analysis.

```text
User
 │
 │ Open Analysis
 ▼
Frontend
 │
 │ GET /analyses/{id}
 ▼
Backend API
 │
 ▼
Analysis Orchestrator
 │
 ▼
Database
 │
 │ Analysis Data
 ▼
Analysis Orchestrator
 │
 ▼
Frontend
 │
 ▼
User
```

### Result

Existing analysis displayed without recalculation.

---

# SD-004 Replace Resume

## Goal

Replace resume with newer version.

```text
User
 │
 │ Upload New Resume
 ▼
Frontend
 │
 │ PUT /resumes/{id}
 ▼
Backend API
 │
 ▼
Resume Module
 │
 │ Replace PDF
 ▼
Storage Module
 │
 ▼
Resume Module
 │
 ▼
Parsing Module
 │
 ├── Extract Text
 ├── Parse Resume
 └── Generate Resume JSON
 │
 ▼
Resume Module
 │
 │ Update Resume
 ▼
Database
 │
 │ Invalidate Previous Analysis
 ▼
Frontend
 │
 ▼
User
```

### Result

* Resume updated
* Resume JSON regenerated
* Previous analysis invalidated

---

# SD-005 Delete Resume

## Goal

Delete resume and related resources.

```text
User
 │
 │ Delete Resume
 ▼
Frontend
 │
 │ DELETE /resumes/{id}
 ▼
Backend API
 │
 ▼
Resume Module
 │
 ├── Delete Resume
 ├── Delete Analyses
 └── Delete Export Metadata
 ▼
Database
 │
 ▼
Storage Module
 │
 │ Delete PDF
 ▼
Frontend
 │
 ▼
User
```

### Result

* Resume deleted
* Analysis deleted
* Uploaded files deleted

---

# SD-006 Edit Resume Section

## Goal

Edit one resume section inside Resume Editor.

```text
User
 │
 │ Select Summary
 ▼
Frontend
 │
 │ GET Resume Section
 ▼
Backend API
 │
 ▼
Resume Module
 │
 ▼
Database
 │
 │ Summary
 ▼
Frontend
 │
 ▼
User
 │
 │ Edit Summary
 ▼
Frontend
 │
 │ PATCH /resume/summary
 ▼
Backend API
 │
 ▼
Resume Module
 │
 │ Update Resume JSON
 ▼
Database
 │
 │ Saved
 ▼
Frontend
 │
 ▼
User
```

### Result

* Resume section updated
* Resume JSON updated
* Changes persisted immediately

---

# SD-007 Apply AI Suggestion

## Goal

Apply AI-generated improvement to one section.

```text
User
 │
 │ Improve Summary
 ▼
Frontend
 │
 │ POST /ai/summary
 ▼
Backend API
 │
 ▼
AI Module
 │
 │ Generate Improved Summary
 ▼
Backend API
 │
 ▼
Resume Module
 │
 │ Update Resume JSON
 ▼
Database
 │
 │ Saved
 ▼
Frontend
 │
 ▼
User
```

### Result

* AI rewrite generated
* Resume JSON updated
* Resume Editor refreshed

---

# SD-008 Export Resume

## Goal

Generate downloadable PDF.

```text
User
 │
 │ Export PDF
 ▼
Frontend
 │
 │ POST /export
 ▼
Backend API
 │
 ▼
Export Module
 │
 │ Generate PDF
 ▼
Storage Module
 │
 │ Store Generated File
 ▼
Export Module
 │
 │ Return Download URL
 ▼
Frontend
 │
 ▼
User
```

### Result

* PDF generated
* Download available
* Resume preserved

---

# Phase 2 (Future)

Future workflow introduces Target-based optimization.

```text
User

↓

Choose Target

↓

Job Title
or
Job Description

↓

Target Module

↓

Target Profile

↓

Comparison Engine

↓

AI Module

↓

Tailored Resume

↓

Export
```

This workflow intentionally remains outside current MVP.
