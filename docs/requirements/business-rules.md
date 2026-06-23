# Business Rules

These rules define how the business operates independently of the technology stack.

## User Rules

### BR-001

A user must be authenticated before accessing resumes.

### BR-002

A user may own multiple resumes.

### BR-003

A user may delete their own resumes. Deleting a resume also deletes its analyses.

---

## Resume Rules

### BR-004

A resume belongs to exactly one user.

### BR-005

Each resume stores only the latest uploaded PDF. Uploading a new PDF replaces the previous file.

### BR-006

A resume must be successfully parsed before analysis can begin.

### BR-007

Structured resume data is generated immediately after upload.

---

## Analysis Rules

### BR-008

An analysis always belongs to exactly one resume.

### BR-009

Every analysis uses exactly one job description.

### BR-010

An analysis cannot exist without a resume.

### BR-011

Analyses are immutable. Once created, they cannot be modified.

### BR-012

Each analysis stores the results generated at the time of analysis. Results are never recalculated automatically.

### BR-013

Every analysis generates:

* Match Score
* ATS Score
* Missing Keywords
* Matching Keywords
* AI Suggestions

---

## AI Rules

### BR-014

Resume parsing occurs only when the resume is uploaded or updated.

### BR-015

Job descriptions are parsed during analysis.

### BR-016

AI suggestions are generated once and stored with the analysis.

---

## 📘 Data Responsibilities

Think of this as defining who owns what data.

| Entity | Responsible For |
| :--- | :--- |
| **User** | Identity, authentication, account ownership |
| **Resume** | PDF, extracted text, structured resume profile |
| **Analysis** | Job description, parsed JD, scores, keywords, AI output, historical snapshot |