# ResumeForge Backend Component Architecture

## Purpose

This document defines backend modules, responsibilities, ownership and dependencies.

Architecture follows:

* Modular Monolith
* Single Responsibility Principle (SRP)
* Low Coupling
* High Cohesion
* Future Microservice Extraction

---

## High-Level Architecture

                    Backend

           ┌────────────────────┐
           │    Auth Module     │
           └────────────────────┘

           ┌────────────────────┐
           │    User Module     │
           └────────────────────┘

           ┌────────────────────┐
           │   Resume Module    │
           └─────────┬──────────┘
                     │
                     ▼
           ┌────────────────────┐
           │   Parsing Module   │
           └─────────┬──────────┘
                     │
                     ▼
           ┌────────────────────┐
           │   Resume JSON      │
           └─────────┬──────────┘
                     │
                     ▼
           ┌────────────────────┐
           │ Analysis           │
           │ Orchestrator       │
           └──────┬───────┬─────┘
                  │       │
                  ▼       ▼
      Resume Analysis   AI Module
          Engine

           ┌────────────────────┐
           │ Export Module      │
           └────────────────────┘

           ┌────────────────────┐
           │ Storage Module     │
           └────────────────────┘

---

## Component Responsibilities

## Auth Module

 Purpose: Manage authentication and authorization.

## Responsibilities

* Register users
* Login
* Logout
* Refresh tokens
* Password reset
* Session management

## Dependencies

* Database

---

# User Module

## Purpose

Manage user profile and preferences.

## Responsibilities

* View profile
* Update profile
* Manage preferences
* Subscription information
* Usage statistics

## Dependencies

* Database

---

# Resume Module

## Purpose

Manage lifecycle of resumes.

## Responsibilities

* Upload resume
* Retrieve resume
* Update resume
* Delete resume
* Resume metadata
* Resume versions

## Dependencies

* Parsing Module
* Storage Module
* Database

---

# Parsing Module

## Purpose

Convert uploaded documents into structured data.

## Responsibilities

* Extract PDF text
* Extract DOCX text
* Detect resume sections
* Normalize content
* Generate structured Resume JSON

## Input

Resume document

## Output

Resume JSON

## Dependencies

None

---

# Resume JSON

## Purpose

Canonical representation of resume.

Example

```json
{
  "contact": {},
  "summary": "",
  "experience": [],
  "education": [],
  "skills": [],
  "projects": [],
  "certifications": []
}
```

Every backend component consumes Resume JSON.

Never consumes raw PDF.

---

# Analysis Orchestrator

## Purpose

Coordinate complete resume analysis workflow.

Does not perform analysis itself.

## Responsibilities

* Load Resume JSON
* Invoke Resume Analysis Engine
* Invoke AI Module
* Merge results
* Persist analysis
* Return analysis response

## Dependencies

* Resume Analysis Engine
* AI Module
* Database

---

# Resume Analysis Engine

## Purpose

Perform deterministic resume analysis.

Contains business rules.

No AI.

## Responsibilities

### Resume Health

* Resume completeness
* Section validation
* Contact validation

### ATS Analysis

* ATS score
* Formatting score
* Readability score

### Experience Analysis

* Action verbs
* Quantified achievements
* Date consistency

### Skills Analysis

* Categorization
* Duplicate detection
* Missing categories

### Summary Analysis

* Length
* Generic wording
* First-person detection

### Education Analysis

* Degree validation
* Graduation validation
* Ordering

### Formatting

* ATS compatibility
* Layout consistency

## Dependencies

None

---

# AI Module

## Purpose

Generate intelligent recommendations.

Never calculates business scores.

## Responsibilities

* Rewrite summary
* Improve experience bullets
* Improve skills wording
* Improve education wording
* Explain recommendations
* Generate section suggestions
* Compare revisions

## Dependencies

* AI Provider

---

# Export Module

## Purpose

Generate downloadable resume files.

## Responsibilities

* Export PDF
* Export DOCX (Future)
* Print formatting
* Export metadata

## Dependencies

* Resume Module

---

# Storage Module

## Purpose

Store uploaded and generated files.

## Responsibilities

* Upload files
* Retrieve files
* Delete files
* Store exported documents

## Dependencies

* Object Storage

---

# Module Dependencies

```text
Resume Module
        │
        ▼
Parsing Module
        │
        ▼
Resume JSON
        │
        ▼
Analysis Orchestrator
      │          │
      ▼          ▼
Resume Analysis  AI Module
Engine
```

---

# Dependency Rules

Resume Module may call Parsing Module.

Parsing Module must never depend on Resume Module.

Resume Analysis Engine must never call AI Module.

AI Module must never calculate ATS scores.

Storage Module must never contain business logic.

Analysis Orchestrator coordinates workflow only.

Resume JSON is single source of truth.

Every analysis consumes Resume JSON.

---

# Phase 1 Scope (Current MVP)

Implemented modules

* Auth Module
* User Module
* Resume Module
* Parsing Module
* Resume JSON
* Analysis Orchestrator
* Resume Analysis Engine
* AI Module
* Export Module (PDF)
* Storage Module

Workflow

```text
Authentication

↓

Upload Resume

↓

Parsing

↓

Resume JSON

↓

General Resume Analysis

↓

Resume Editor

↓

Section-wise AI Improvements

↓

Export PDF
```

---

# Phase 2 (Target-Based Optimization)

Future architecture

```text
           ┌────────────────────┐
           │ Target Module      │
           └─────────┬──────────┘
                     │
                     ▼
           ┌────────────────────┐
           │ Target Profile     │
           └─────────┬──────────┘
                     │
                     ▼
           ┌────────────────────┐
           │ Comparison Engine  │
           └─────────┬──────────┘
                     │
                     ▼
                 AI Module
```

## Target Module

Supports

* Job Title
* Job Description

Produces

* Required Skills
* Preferred Skills
* Responsibilities
* Keywords
* Company Context

Comparison Engine compares Resume JSON against Target Profile.

---

# Future Modules

Can be extracted independently.

* Parsing Module
* AI Module
* Export Module
* Storage Module
* Target Module
* Notification Module
* Billing Module

No business behavior changes required.

---

# Design Principles

* Single Responsibility Principle
* Separation of Concerns
* Low Coupling
* High Cohesion
* Dependency Inversion
* Modular Monolith First
* Resume JSON as Canonical Domain Model
* AI Assists Decision Making
* Rule Engine Owns Business Logic
