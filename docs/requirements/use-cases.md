# Resume Analyzer SaaS — Use Cases

## Purpose

This document defines all user interactions supported by the MVP.

Each use case describes a business capability of the system without specifying implementation details.

---

## Actors

## Primary Actor

- User

---

## Authentication

## UC-001 Register

### Goal

Create a new account.

### Preconditions

- User is not authenticated.

### Main Flow

1. User enters registration details.
2. System validates input.
3. Account is created.
4. User is authenticated.
5. User is redirected to the dashboard.

### Postconditions

- User account exists.

---

## UC-002 Login

## Goal

Authenticate into the application.

## Preconditions

- User account exists.

### Main Flow

1. User enters credentials.
2. System validates credentials.
3. Session is created.
4. Dashboard is displayed.

### Postconditions

- User is authenticated.

---

## UC-003 Logout

### Goal

End the current session.

### Preconditions

- User is authenticated.

### Main Flow

1. User clicks Logout.
2. Session is destroyed.
3. User returns to Landing Page.

---

# Resume Management

## UC-004 Upload Resume

### Goal

Upload a resume for future analysis.

### Preconditions

- User is authenticated.
- PDF file selected.

### Main Flow

1. User uploads PDF.
2. System validates file.
3. PDF is stored.
4. Text is extracted.
5. Resume is parsed.
6. Structured resume is generated.
7. Resume is saved.

### Alternative Flows

- Invalid file format
- File exceeds size limit
- Parsing fails

### Postconditions

- Resume is available for analysis.

---

## UC-005 View Resume

### Goal

View uploaded resume information.

### Preconditions

- Resume exists.

### Main Flow

1. User selects resume.
2. System displays resume details.

---

## UC-006 Replace Resume

### Goal

Replace an existing resume with a newer version.

### Preconditions

- Resume exists.

### Main Flow

1. User uploads a new PDF.
2. Old PDF is replaced.
3. Resume is re-parsed.
4. Structured data is updated.

### Postconditions

- Resume contains latest version.

---

## UC-007 Delete Resume

### Goal

Delete a resume.

### Preconditions

- Resume exists.

### Main Flow

1. User selects Delete.
2. System requests confirmation.
3. Resume is deleted.
4. Associated analyses are deleted.

### Postconditions

- Resume no longer exists.

---

# Resume Analysis

## UC-008 Analyze Resume

### Goal

Analyze a resume against a job description.

### Preconditions

- Resume exists.
- User provides job description.

### Main Flow

1. User pastes job description.
2. Job description is parsed.
3. Rule Engine performs analysis.
4. AI generates recommendations.
5. Analysis is stored.
6. Results are displayed.

### Alternative Flows

- Empty job description
- AI unavailable
- Analysis fails

### Postconditions

- Analysis history contains a new record.

---

## UC-009 View Analysis

### Goal

View a previously completed analysis.

### Preconditions

- Analysis exists.

### Main Flow

1. User selects an analysis.
2. System displays:
   - Match Score
   - ATS Score
   - Missing Keywords
   - Matching Keywords
   - AI Suggestions

---

## UC-010 View Analysis History

### Goal

Browse previous analyses.

### Preconditions

- User has completed at least one analysis.

### Main Flow

1. User opens History.
2. System lists previous analyses.
3. User selects one.

---

## UC-011 Delete Analysis

### Goal

Remove an analysis from history.

### Preconditions

- Analysis exists.

### Main Flow

1. User selects Delete.
2. Confirmation is shown.
3. Analysis is deleted.

---

# Profile

## UC-012 View Profile

### Goal

View account information.

### Preconditions

- User is authenticated.

### Main Flow

1. User opens Profile.
2. System displays account details.

---

## UC-013 Update Profile

### Goal

Update profile information.

### Preconditions

- User is authenticated.

## Main Flow

1. User edits profile.
2. System validates changes.
3. Profile is updated.

---

## MVP Summary

The MVP supports the following capabilities:

- User authentication
- Resume management
- Resume analysis
- Analysis history
- Profile management

Features intentionally excluded from the MVP include:

- Resume version history
- Cover letter generation
- Resume builder
- Job recommendations
- Portfolio builder
- Interview preparation
- Team collaboration
