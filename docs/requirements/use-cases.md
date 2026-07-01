# ResumeForge — Use Cases

## Purpose

This document defines all user interactions supported by ResumeForge MVP.

Each use case describes a business capability without specifying implementation details.

---

# Actors

## Primary Actor

* User

---

# Authentication

## UC-001 Register

### Goal

Create a new account.

### Preconditions

* User is not authenticated.

### Main Flow

1. User enters registration details.
2. System validates input.
3. Account is created.
4. User is authenticated.
5. Dashboard is displayed.

### Postconditions

* User account exists.

---

## UC-002 Login

### Goal

Authenticate user.

### Preconditions

* User account exists.

### Main Flow

1. User enters credentials.
2. System validates credentials.
3. Session is created.
4. Dashboard is displayed.

### Postconditions

* User is authenticated.

---

## UC-003 Logout

### Goal

End current session.

### Preconditions

* User is authenticated.

### Main Flow

1. User clicks Logout.
2. Session is destroyed.
3. Landing page is displayed.

---

# Resume Management

## UC-004 Upload Resume

### Goal

Upload resume for analysis.

### Preconditions

* User is authenticated.
* PDF selected.

### Main Flow

1. User uploads PDF.
2. System validates file.
3. PDF is stored.
4. Resume is parsed.
5. Resume JSON is generated.
6. Resume is saved.

### Alternative Flows

* Invalid file format
* File too large
* Parsing failed

### Postconditions

* Resume ready for analysis.

---

## UC-005 Analyze Resume

### Goal

Generate general resume analysis.

### Preconditions

* Resume exists.

### Main Flow

1. User clicks **Analyze Resume**.
2. Resume JSON is loaded.
3. Resume Analysis Engine evaluates resume.
4. AI Module generates recommendations.
5. Analysis is stored.
6. Dashboard updates.

### Postconditions

* Analysis completed.
* Resume Health generated.
* ATS Score generated.
* Section Scores generated.

---

## UC-006 Open Resume Resume Editor

### Goal

Open interactive editing Resume Editor.

### Preconditions

* Resume analyzed.

### Main Flow

1. User selects Resume Resume Editor.
2. System loads Resume JSON.
3. Latest analysis is loaded.
4. Resume Editor is displayed.

### Postconditions

* Resume ready for editing.

---

# Resume Editing

## UC-007 Edit Summary

### Goal

Modify summary section.

### Preconditions

* Resume exists.

### Main Flow

1. User selects Summary.
2. Summary becomes editable.
3. User updates content.
4. Changes are saved.

### Postconditions

* Resume JSON updated.

---

## UC-008 Edit Experience

### Goal

Modify experience section.

### Preconditions

* Resume exists.

### Main Flow

1. User selects Experience.
2. Experience becomes editable.
3. User updates entries.
4. Changes are saved.

### Postconditions

* Resume JSON updated.

---

## UC-009 Edit Skills

### Goal

Modify skills section.

### Preconditions

* Resume exists.

### Main Flow

1. User selects Skills.
2. Skills become editable.
3. User updates skills.
4. Changes are saved.

### Postconditions

* Resume JSON updated.

---

## UC-010 Edit Education

### Goal

Modify education section.

### Preconditions

* Resume exists.

### Main Flow

1. User selects Education.
2. User edits information.
3. Changes are saved.

### Postconditions

* Resume JSON updated.

---

## UC-011 Edit Contact Information

### Goal

Modify contact section.

### Preconditions

* Resume exists.

### Main Flow

1. User selects Contact.
2. User edits information.
3. Changes are saved.

### Postconditions

* Resume JSON updated.

---

# AI Assistance

## UC-012 Apply AI Suggestion

### Goal

Improve selected resume section.

### Preconditions

* Resume exists.
* Analysis completed.

### Main Flow

1. User selects AI Improve.
2. AI generates improved version.
3. User reviews suggestion.
4. User accepts suggestion.
5. Resume JSON is updated.

### Alternative Flows

* AI unavailable
* User rejects suggestion

### Postconditions

* Resume updated.

---

# Resume Export

## UC-013 Export Resume

### Goal

Generate downloadable PDF.

### Preconditions

* Resume exists.

### Main Flow

1. User clicks Export PDF.
2. System generates PDF.
3. Download begins.

### Postconditions

* Resume exported successfully.

---

# Resume Management

## UC-014 Replace Resume

### Goal

Replace uploaded resume.

### Preconditions

* Resume exists.

### Main Flow

1. User uploads newer PDF.
2. Resume is parsed again.
3. Resume JSON regenerated.
4. Previous analysis invalidated.

### Postconditions

* Latest resume stored.

---

## UC-015 Delete Resume

### Goal

Delete resume.

### Preconditions

* Resume exists.

### Main Flow

1. User clicks Delete.
2. Confirmation displayed.
3. Resume removed.
4. Analyses removed.
5. Files removed.

### Postconditions

* Resume permanently deleted.

---

# Profile

## UC-016 View Profile

### Goal

View account information.

### Preconditions

* User authenticated.

### Main Flow

1. User opens Profile.
2. Profile displayed.

---

## UC-017 Update Profile

### Goal

Update account information.

### Preconditions

* User authenticated.

### Main Flow

1. User edits profile.
2. System validates changes.
3. Profile updated.

---

# MVP Summary

ResumeForge MVP supports:

* User Authentication
* Resume Upload
* Resume Parsing
* Resume Health Analysis
* ATS Score
* Section Scores
* Resume Resume Editor
* Section-wise Editing
* AI Suggestions
* Resume Export
* Resume Management
* Profile Management

---

# Features Excluded From MVP

* Job Title Optimization
* Job Description Optimization
* Comparison Engine
* Missing Keyword Analysis
* Resume Version History
* Cover Letter Generation
* LinkedIn Optimization
* Portfolio Builder
* Interview Preparation
* Job Tracker
* Team Collaboration
