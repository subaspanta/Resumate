# ResumeForge API Specification

## Purpose

Defines REST API endpoints for ResumeForge MVP.

Base URL

```text
/api/v1
```

Authentication uses JWT Bearer Tokens.

---

## Authentication

## Register

```http
POST /auth/register
```

Purpose

Create new account.

---

## Login

```http
POST /auth/login
```

Purpose

Authenticate user.

Returns

* Access Token
* User

---

## Logout

```http
POST /auth/logout
```

Purpose

Invalidate current session.

---

## Get Current User

```http
GET /auth/me
```

Purpose

Return authenticated user.

---

## User

## Get Profile

```http
GET /users/profile
```

Purpose

Return user profile.

---

## Update Profile

```http
PATCH /users/profile
```

Purpose

Update account information.

---

## Resume

## Upload Resume

```http
POST /resumes
```

Purpose

Upload PDF and generate Resume JSON.

Multipart

```text
resume.pdf
```

Returns

* Resume ID
* Parsing Status

---

## Get All Resumes

```http
GET /resumes
```

Purpose

Dashboard resume list.

---

## Get Resume

```http
GET /resumes/:resumeId
```

Purpose

Load resume.

---

## Replace Resume

```http
PUT /resumes/:resumeId
```

Purpose

Upload newer version.

---

## Delete Resume

```http
DELETE /resumes/:resumeId
```

Purpose

Delete resume.

---

## Analysis

## Analyze Resume

```http
POST /analyses
```

Purpose

Generate resume analysis.

Body

```json
{
  "resumeId": "uuid"
}
```

Returns

* Overall Score
* ATS Score
* Section Scores

---

## Get Analysis

```http
GET /analyses/:analysisId
```

Purpose

Load completed analysis.

---

## Get Latest Analysis

```http
GET /resumes/:resumeId/latest-analysis
```

Purpose

Load newest analysis.

---

## Get Analysis History

```http
GET /resumes/:resumeId/analyses
```

Purpose

List previous analyses.

---

## Delete Analysis

```http
DELETE /analyses/:analysisId
```

Purpose

Delete analysis.

---

# Resume Editor

## Get Resume Editor

```http
GET /Resume Editor/:resumeId
```

Purpose

Load Resume Editor.

Returns

* Resume JSON
* Latest Analysis
* AI Suggestions

---

# Resume Editing

## Update Contact

```http
PATCH /Resume Editor/:resumeId/contact
```

Purpose

Update contact section.

---

## Update Summary

```http
PATCH /Resume Editor/:resumeId/summary
```

Purpose

Update summary.

---

## Update Experience

```http
PATCH /Resume Editor/:resumeId/experience
```

Purpose

Update experience.

---

## Update Skills

```http
PATCH /Resume Editor/:resumeId/skills
```

Purpose

Update skills.

---

## Update Education

```http
PATCH /Resume Editor/:resumeId/education
```

Purpose

Update education.

---

## Update Projects

```http
PATCH /Resume Editor/:resumeId/projects
```

Purpose

Update projects.

---

## Update Certifications

```http
PATCH /Resume Editor/:resumeId/certifications
```

Purpose

Update certifications.

---

# AI

## Improve Summary

```http
POST /ai/summary
```

Purpose

Generate improved summary.

---

## Improve Experience

```http
POST /ai/experience
```

Purpose

Improve experience bullets.

---

## Improve Skills

```http
POST /ai/skills
```

Purpose

Improve skills section.

---

## Improve Education

```http
POST /ai/education
```

Purpose

Improve education section.

---

## Improve Contact

```http
POST /ai/contact
```

Purpose

Suggest contact improvements.

---

## Improve Projects

```http
POST /ai/projects
```

Purpose

Improve project descriptions.

---

## Improve Certifications

```http
POST /ai/certifications
```

Purpose

Improve certification section.

---

# Export

## Export PDF

```http
POST /export/pdf
```

Purpose

Generate downloadable PDF.

Returns

Download URL.

---

# Health

## Health Check

```http
GET /health
```

Purpose

Verify API availability.

---

# Endpoint Summary

## Authentication

```text
POST   /auth/register
POST   /auth/login
POST   /auth/logout
GET    /auth/me
```

---

## User

```text
GET    /users/profile
PATCH  /users/profile
```

---

## Resume

```text
POST   /resumes
GET    /resumes
GET    /resumes/:resumeId
PUT    /resumes/:resumeId
DELETE /resumes/:resumeId
```

---

## Analysis

```text
POST   /analyses
GET    /analyses/:analysisId
GET    /resumes/:resumeId/latest-analysis
GET    /resumes/:resumeId/analyses
DELETE /analyses/:analysisId
```

---

## Resume Editor

```text
GET    /Resume Editor/:resumeId

PATCH  /Resume Editor/:resumeId/contact
PATCH  /Resume Editor/:resumeId/summary
PATCH  /Resume Editor/:resumeId/experience
PATCH  /Resume Editor/:resumeId/skills
PATCH  /Resume Editor/:resumeId/education
PATCH  /Resume Editor/:resumeId/projects
PATCH  /Resume Editor/:resumeId/certifications
```

---

## AI

```text
POST /ai/contact
POST /ai/summary
POST /ai/experience
POST /ai/skills
POST /ai/education
POST /ai/projects
POST /ai/certifications
```

---

## Export

```text
POST /export/pdf
```

---

## System

```text
GET /health
```

---

# Phase 2 Endpoints

Not part of MVP.

```text
POST /targets

GET /targets/:id

POST /comparisons

POST /analyses/job-match

POST /ai/tailor

GET /keywords/missing
```

These power Job Title and Job Description optimization after MVP completion.
