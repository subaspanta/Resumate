# Resume Analyzer SaaS — Component Architecture

## Purpose

This document defines the internal backend components of the application, their responsibilities, ownership, and dependencies.

The goal is to ensure every component has a single responsibility and communicates through well-defined boundaries.

---

# Component Overview

```text
                   Backend

        ┌────────────────────┐
        │   Auth Module       │
        └────────────────────┘

        ┌────────────────────┐
        │   User Module       │
        └────────────────────┘

        ┌────────────────────┐
        │ Resume Module       │
        └─────────┬───────────┘
                  │
                  ▼
        ┌────────────────────┐
        │ Parsing Module      │
        └────────────────────┘

        ┌────────────────────┐
        │ Analysis Module     │
        └──────┬────────┬─────┘
               │        │
               ▼        ▼
        Analysis Engine   AI Module

        ┌────────────────────┐
        │ Storage Module      │
        └────────────────────┘
```

---

# Component Responsibilities

## Auth Module

**Purpose**

Manage authentication and user sessions.

**Responsibilities**

- Register users
- Authenticate users
- Manage sessions

**Dependencies**

None

---

## User Module

**Purpose**

Manage user account information.

**Responsibilities**

- View profile
- Update profile

**Dependencies**

Database

---

## Resume Module

**Purpose**

Manage the lifecycle of resumes.

**Responsibilities**

- Upload resume
- Update resume
- Delete resume
- Retrieve resume

**Dependencies**

- Parsing Module
- Storage Module
- Database

---

## Parsing Module

**Purpose**

Convert uploaded documents into structured resume data.

**Responsibilities**

- Extract text
- Parse resume
- Produce structured resume

**Dependencies**

None

---

## Analysis Module

**Purpose**

Coordinate the complete resume analysis workflow.

**Responsibilities**

- Load resume
- Parse job description
- Invoke Rule Engine
- Invoke AI Module
- Store analysis

**Dependencies**

- Parsing Module
- Rule Engine
- AI Module
- Database

---

## Rule Engine

**Purpose**

Perform deterministic resume analysis.

**Responsibilities**

- Match keywords
- Compare skills
- Calculate Match Score
- Calculate ATS Score
- Detect missing keywords

**Dependencies**

None

---

## AI Module

**Purpose**

Generate intelligent recommendations.

**Responsibilities**

- Suggest improvements
- Explain gaps
- Generate feedback

**Dependencies**

AI Provider

---

## Storage Module

**Purpose**

Manage PDF storage.

**Responsibilities**

- Upload files
- Delete files
- Retrieve files

**Dependencies**

Object Storage

---

# Dependency Rules

- Components may only depend on lower-level components.
- Parsing Module must not depend on Resume Module.
- Rule Engine must not depend on AI Module.
- AI Module must not calculate business scores.
- Storage Module must remain independent of business logic.
- Analysis Module acts as the orchestrator for resume analysis.

---

# Design Principles

- Single Responsibility Principle (SRP)
- Separation of Concerns
- Low Coupling
- High Cohesion
- Dependency Inversion
- Modular Monolith Architecture

---

# Future Evolution

As the application grows, the following components may be extracted into independent services without changing business behavior:

- Parsing Module
- AI Module
- Storage Module
- Notification Module (future)