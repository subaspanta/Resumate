# Resume Analyzer SaaS - Domain Model

## Purpose

The domain model defines the core business entities of the application and their relationships. It focuses on the business domain rather than database implementation.

## Domain Overview

User
│
├── owns
│
▼
Resume
│
├── can be analyzed many times
│
▼
Analysis

## Entity 1 — User

### Purpose

Represents a registered user of the platform.

### Responsibilities

- Authenticate into the system
- Own multiple resumes
- View analysis history
- Manage account

### Relationships

- **User** has many **Resumes**

## Entity 2 — Resume

### Purpose

Represents one professional resume owned by a user.
A resume is considered a business object rather than just a PDF file.
Each resume stores only the latest uploaded PDF in the MVP.

### Responsibilities

- Store uploaded PDF
- Store extracted text
- Store structured resume data
- Serve as input for resume analysis

### Contains

- Title
- Original PDF
- Extracted Text
- Structured Resume
- Created Date
- Updated Date

### Relationships

- **Resume** has many **Analyses**

## Entity 3 — Analysis

### Purpose

Represents a historical snapshot comparing one Resume against one Job Description.
An Analysis is immutable after creation.

### Responsibilities

- Store Job Description
- Store parsed Job Description
- Store analysis results
- Preserve historical record

### Contains

- Job Description
- Parsed Job Data
- Match Score
- ATS Score
- Missing Keywords
- Matching Keywords
- AI Suggestions
- Summary
- Created Date

### Relationships

- **Analysis** belongs to one **Resume**

## Domain Relationships

- **User (1)** ➔ **Resume (Many)** ➔ **Analysis (Many)**

## Design Decisions

### Resume

- Multiple resumes per user.
- Only latest uploaded PDF stored.
- No version history in MVP.

### Analysis

- Immutable.
- Historical snapshot.
- Never recalculated automatically.

### Job Description

- Not a separate entity.
- Exists only within an Analysis.

### Structured Resume

- Stored inside Resume as structured JSON for the MVP.
- This can be normalized into separate entities in future versions.
