# Resume Analyzer SaaS — Sequence Diagrams

## Purpose

This document describes the interaction between system components during the application's core business workflows.

The diagrams focus on message flow rather than implementation details.

---

# SD-001 Upload Resume

## Goal

Upload a PDF resume and generate a structured resume profile.

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
 │ Store PDF
 ▼
Storage Module
 │
 │ Return File URL
 ▼
Resume Module
 │
 │ Extract Text
 ▼
Parsing Module
 │
 │ Parse Resume
 │
 │ Generate Structured Resume
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

- Resume created
- PDF stored
- Raw text extracted
- Structured resume generated

---

# SD-002 Analyze Resume

## Goal

Compare a resume against a job description.

```text
User
 │
 │ Paste Job Description
 ▼
Frontend
 │
 │ POST /analyses
 ▼
Backend API
 │
 ▼
Analysis Module
 │
 │ Load Resume
 ▼
Database
 │
 │ Structured Resume
 ▼
Analysis Module
 │
 │ Parse Job Description
 ▼
Parsing Module
 │
 │ Parsed Job
 ▼
Rule Engine
 │
 │
 ├── Extract Keywords
 ├── Compare Skills
 ├── Calculate Match Score
 ├── Calculate ATS Score
 └── Detect Missing Keywords
 │
 ▼
AI Module
 │
 │ Generate Suggestions
 ▼
Analysis Module
 │
 │ Save Analysis
 ▼
Database
 │
 │ Analysis Result
 ▼
Frontend
 │
 ▼
User
```

### Result

- Match Score
- ATS Score
- Missing Keywords
- Matching Keywords
- AI Suggestions
- Analysis stored

---

# SD-003 View Analysis

## Goal

Display a previously completed analysis.

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
Analysis Module
 │
 ▼
Database
 │
 │ Analysis Data
 ▼
Analysis Module
 │
 ▼
Frontend
 │
 ▼
User
```

### Result

Existing analysis is displayed without recalculation.

---

# SD-004 Replace Resume

## Goal

Replace an existing resume with a newer PDF.

```text
User
 │
 │ Upload New PDF
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
 │ Replace File
 ▼
Storage Module
 │
 ▼
Resume Module
 │
 │ Extract Text
 ▼
Parsing Module
 │
 │ Parse Resume
 ▼
Resume Module
 │
 │ Update Resume
 ▼
Database
 │
 ▼
Frontend
 │
 ▼
User
```

### Result

- Previous PDF replaced
- Structured resume regenerated

---

# SD-005 Delete Resume

## Goal

Delete a resume and its associated analyses.

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
 │ Delete Resume
 │
 │ Delete Analyses
 ▼
Database
 │
 │ Delete PDF
 ▼
Storage Module
 │
 ▼
Frontend
 │
 ▼
User
```

### Result

- Resume removed
- Associated analyses removed
- PDF removed from storage