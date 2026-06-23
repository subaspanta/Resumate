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

The system shall:

- Accept PDF resumes.
- Reject unsupported file types.
- Reject files larger than 5 MB.
- Display upload progress.
- Notify users of parsing failures.
- Accept pasted job descriptions.
- Extract text from uploaded documents.
- Calculate a compatibility score.
- Highlight missing keywords.
- Generate improvement suggestions.
- Store previous analyses.

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

For now:

- Authentication
- Resume upload
- Job description upload
- Resume parsing
- Match score
- Missing keywords
- AI suggestions
- Resume history

---

## 13. Future Scope

Everything intentionally postponed. Examples:

- Cover letters
- Portfolio builder
- Job recommendations
- Interview preparation
- Mock interviews
- Career roadmap

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
