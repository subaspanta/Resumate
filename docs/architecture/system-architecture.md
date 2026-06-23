# Resume Analyzer SaaS — System Architecture

## Purpose

This document describes the high-level architecture of the Resume Analyzer SaaS.

It defines the major system components, their responsibilities, and how they communicate. This document intentionally avoids implementation details such as database schemas, API endpoints, or folder structures.

---

## Architecture Goals

The system is designed with the following goals:

- Simplicity for MVP
- Clear separation of responsibilities
- Modular backend architecture
- Easy future scalability
- Low infrastructure cost
- Minimal AI dependency
- Production-ready design

---

## High-Level Architecture

```text
                         User
                           │
                           ▼
                  ┌─────────────────┐
                  │ Next.js Frontend│
                  └────────┬────────┘
                           │
                     HTTPS / REST API
                           │
                           ▼
              ┌──────────────────────────┐
              │      Backend API         │
              └──────────┬───────────────┘
                         │
        ┌──────────────────────────────────────┐
        │                                      │
        │  Auth Module                         │
        │  User Module                         │
        │  Resume Module                       │
        │  Parsing Module                      │
        │  Analysis Module                     │
        │  Rule Engine                         │
        │  AI Module                           │
        │  Storage Module                      │
        └─────────────┬───────────────┬────────┘
                      │               │
                      ▼               ▼
                PostgreSQL      Object Storage
                                      │
                                      ▼
                               AI Provider
```

---

## System Components

## Frontend

Responsibilities

- User Interface
- Authentication
- Resume Upload
- Job Description Input
- Display Analysis Results
- Display Analysis History

The frontend never communicates directly with the database, storage, or AI provider.

All communication passes through the Backend API.

---

## Backend API

The backend acts as the orchestrator of the application.

Responsibilities

- Authentication
- Business Logic
- Request Validation
- Authorization
- Module Coordination
- Database Communication
- File Management
- AI Communication

The backend is the only component allowed to communicate with external services.

---

## Backend Modules

## Auth Module

Responsible for:

- Register
- Login
- Session Management
- Authentication

---

## User Module

Responsible for:

- User Profile
- Account Management

---

## Resume Module

Responsible for:

- Resume Upload
- Resume Update
- Resume Retrieval
- Resume Deletion

This module manages the lifecycle of resumes.

---

## Parsing Module

Responsible for:

- PDF Text Extraction
- Resume Parsing
- Structured Resume Generation

This module has no knowledge of users, analyses, or AI.

Its only responsibility is transforming uploaded documents into structured data.

---

## Analysis Module

Core business module of the application.

Responsible for:

- Resume Analysis
- Analysis History
- Result Generation
- Analysis Persistence

---

## Rule Engine

Responsible for deterministic analysis.

Responsibilities include:

- Keyword Matching
- Skill Matching
- Match Score Calculation
- ATS Score Calculation
- Missing Keyword Detection
- Experience Comparison

The Rule Engine performs all deterministic business logic without using AI.

---

## AI Module

Responsible only for intelligent recommendations.

Responsibilities include:

- Resume Improvement Suggestions
- Personalized Feedback
- Explanation Generation

The AI Module never calculates scores or performs deterministic comparisons.

---

## Storage Module

Responsible for file management.

Responsibilities include:

- Store Resume PDFs
- Delete Resume PDFs
- Retrieve Resume Files

The Storage Module has no business logic.

---

## External Systems

The application depends on the following external systems:

## PostgreSQL

Stores all persistent business data.

---

## Object Storage

Stores uploaded PDF resumes.

Examples:

- AWS S3
- Cloudinary
- Supabase Storage

---

## AI Provider

Used exclusively for intelligent suggestions and explanations.

Examples:

- OpenAI
- Anthropic
- Google Gemini

The application should continue functioning if the AI provider is temporarily unavailable, with AI-specific features gracefully degraded.

---

## Architectural Principles

## 1. Modular Monolith

The MVP will be implemented as a modular monolith.

Modules remain logically separated while sharing the same application.

Microservices are intentionally avoided during the MVP phase.

---

## 2. Separation of Concerns

Each module owns one responsibility.

Business logic should never be duplicated across modules.

---

## 3. AI as an Enhancement

Artificial Intelligence enhances the application.

It does not replace deterministic business logic.

Rule-based analysis remains the primary source of truth.

---

## 4. Backend-First Architecture

All external communication occurs through the backend.

The frontend never communicates directly with:

- Database
- Storage
- AI Provider

---

## 5. Future Scalability

Modules are designed to be extractable into independent services if required.

For example:

Parsing Module

↓

Resume Parsing Service

without changing business logic.

---

## Architecture Decisions

## ADR-001

Resume parsing will remain a backend module during the MVP.

A dedicated parsing service will not be created.

Reason:

- Simpler deployment
- Easier debugging
- Lower infrastructure cost
- Faster development

---

## ADR-002

Deterministic analysis will be performed by the Rule Engine.

Artificial Intelligence will only generate recommendations and explanations.

Reason:

- Lower AI costs
- Faster response times
- Better reliability
- Predictable scoring
- Easier testing

---

## Current Architecture Status

This document describes the MVP architecture only.

Future versions may introduce:

- Dedicated Parsing Service
- Background Job Queue
- Search Engine
- Notification Service
- Caching Layer
- Event Bus
- Microservices
