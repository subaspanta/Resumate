# Product Requirement Document (PRD) — Resume Analyzer SaaS

## 1. Product Overview

An AI-assisted resume analysis platform that helps job seekers compare their resume against a target job description, understand why their resume may not pass ATS screening, and receive actionable recommendations to improve their chances of getting shortlisted. The platform focuses on education and guidance rather than simply generating resumes, enabling users to continuously improve their professional profile.

---

## 2. Problem Statement

- Many job seekers repeatedly apply for jobs without understanding why their resume is not being shortlisted. They receive no feedback, struggle to identify missing skills or keywords, and often tailor resumes manually.
- Existing AI tools are either too generic, expensive, or not optimized for early-career professionals.
- Recruiters spend only a few seconds reviewing resumes.
- Many companies use ATS filters before a human ever sees the resume.
- Graduates often receive rejection emails with no explanation.
- Existing AI tools are either expensive, generic, or overwhelming.

---

## 3. Target Audience

### i) Primary Audience

- Final-year students
- Fresh graduates
- Early-career professionals (0–3 years of experience)
- Internship applicants

### ii) Secondary Audience

- Freelancers
- Career switchers
- Remote job seekers

---

## 4. Goals

- Help users understand why their resume doesn't match a job.
- Provide actionable improvement suggestions.
- Reduce the time required to tailor a resume.
- Help users understand why they received a particular compatibility score.
- Generate an ATS compatibility score.

---

## 5. Non-goals

- We are not building a job portal.
- We are not replacing recruiters.
- We are not automatically applying to jobs.
- We are not guaranteeing interviews.
- We are not editing resumes automatically without user approval.
- We are not guaranteeing ATS acceptance.
- We are not replacing career counseling.

---

## 6. User Personas

### Persona 1: The Fresh Graduate

- **Name:** Aashish
- **Age:** 22
- **Education:** BSc CSIT
- **Goal:** Get a frontend internship.
- **Pain:** Keeps getting rejected.
- **Needs:** Resume feedback.

### Persona 2: The Career Switcher

- **Name:** Priya
- **Age:** 29
- **Education:** BA in English Literature (Currently working in Customer Support)
- **Goal:** Transition into a Junior UX Writer or Content Strategist role.
- **Pain:** Her resume looks too focused on customer service metrics rather than design thinking and content strategy.
- **Needs:** Help translating transferable skills and identifying core UX keywords missing from her profile.

### Persona 3: The Final-Year Student

- **Name:** Liam
- **Age:** 21
- **Education:** BBA in Marketing
- **Goal:** Secure a corporate marketing executive training program before graduation.
- **Pain:** Has limited professional experience (mostly club activities and one short project) and doesn't know if his resume looks professional enough for corporate ATS algorithms.
- **Needs:** Clear guidance on how to structure non-traditional experience and highlight marketing keywords.

### Persona 4: The Early-Career Professional

- **Name:** Marcus
- **Age:** 25
- **Education:** B.E. in Mechanical Engineering
- **Goal:** Secure a Data Analyst role after 18 months of generic IT support work.
- **Pain:** He has spent hours editing his resume manually for every single job post, resulting in massive burnout and no response.
- **Needs:** A rapid way to identify missing technical competencies (like SQL/Tableau) against specific job listings without losing manual control over his content.

---

## 7. User Stories

- **As a fresh graduate,** I want to upload my resume, so that I can understand how well it matches a job description.
- **As a job seeker,** I want AI suggestions, so that I can improve weak sections.

---

## 8. User Journey

Landing Page ➔ Create Account ➔ Verify Email ➔ Dashboard ➔ Upload Resume ➔ Resume Parsed ➔ Paste Job Description ➔ Analysis Starts ➔ Score Generated ➔ Feedback Generated ➔ Analysis Saved ➔ Dashboard Updated

---

## 9. Functional Requirements

i) User Authentication & ManagementThe system shall authenticate users via JWT (JSON Web Tokens).The system shall securely hash user passwords using bcrypt.The system shall maintain user session states across frontend and backend.

ii) Document & Job Description IngestionThe system shall accept PDF resume uploads up to 5 MB using multer.The system shall reject unsupported file formats with descriptive error messages.The system shall parse and extract raw string data from PDF files using pdf-parse.The system shall accept text-based job descriptions pasted via a multi-line input field.

iii) Core AI Analysis Engine (MVP)The system shall pass structured prompts containing parsed resume text and job descriptions to the AI API.The system shall enforce strict JSON output format from the AI using JSON schemas.The system shall calculate an aggregate compatibility score from 0 to 100.The system shall extract a list of missing technical and soft keywords.The system shall provide structured improvement suggestions categorized by Education, Experience, and Skills.

iv) Data Storage & HistoryThe system shall store raw parsed text, metadata, and uploaded file paths in PostgreSQL.The system shall save analysis results, including compatibility scores, in JSONB format for flexible querying.The system shall fetch and display a historical log of past analyses on the user dashboard.

---

## 10. Non-functional Requirements

### Performance

- Analysis within 10 seconds

### Security

- JWT Authentication
- HTTPS
- Secure file storage

### Reliability

- Error handling
- Retry failed AI requests

### Usability

- Responsive
- Accessible

---

## 11. Success Metrics

- Users complete an analysis in under 2 minutes.
- 80% of uploaded resumes are parsed successfully.
- 60% of users perform more than one analysis.
- Average user satisfaction > 4/5 (through feedback).

---

## 12. MVP Scope

To get this live quickly and break your job gap, focus strictly on these core database-backed tasks:Backend: Setup Express server with Postgres (pg-pool) integration and JWT auth routes.File Processing: Implement file upload endpoint, file size validation, and text extraction logic.AI Layer: Connect a secure Node.js route to your chosen AI API using schema-driven JSON outputs.Database Optimization: Design the schema using Postgres native JSONB fields for missing_keywords and suggestions to ensure painless future migration to pgvector columns.Frontend: Build a responsive React layout featuring a dashboard, drag-and-drop file upload, a pasting interface for job requirements, and clean data cards for scores and missing keyword badges.

---

## 13. Future Scope

i) AI-Driven Context & Feature AutomationBuild URL Scraping Ingestion Agent: Create a backend pipeline using Puppeteer or Cheerio to extract messy HTML from job boards and use a lightweight LLM to parse it into structured JSON data.Develop STAR Method Optimizer: Build an API endpoint that analyzes passive user bullet points and rewrites them into metrics-driven statements following the Situation, Task, Action, and Result framework.Integrate Multimodal Vision Parsing: Deploy a Vision LLM workflow to process complex, multi-column Canva PDF layouts that break standard text-based parsers.

ii) Advanced Vector ArchitectureImplement pgvector Semantic Matching: Migrate from standard keyword matching to database-level vector operations, storing resume and job description embeddings directly in PostgreSQL using pgvector.Deploy RAG-Based Interactive Coach: Build a Retrieval-Augmented Generation chat system that chunks, embeds, and fetches contextual resume data to answer user-specific career queries.

iii) Platform Monetization & InfrastructureIntegrate Server-Side PDF Generator: Create an automated Node.js service using pdfkit or puppeteer to let users download their polished, optimized resume data back into a clean PDF format.Implement Usage Metering SaaS Infrastructure: Add a credit-based middleware layer in Express to track API usage per user and gate premium AI features behind local and global payment gateways.

---

## 14. Risks & Assumptions

### Risks

- AI suggestions may be inconsistent.
- PDF parsing quality depends on resume formatting.
- Some job descriptions are poorly structured.

### Assumptions

- Users can provide readable PDF resumes.
- Users have a target job description.
- AI providers remain available.

---

## 15. Product Principles

- Explain every score instead of hiding the logic.
- AI should assist, not replace user decision-making.
- Users always retain control over resume changes.
- Prioritize transparency over inflated scores.
- Focus on quality feedback rather than quantity of features.
