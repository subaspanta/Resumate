# Resume Analyzer SaaS

## REST API Specification (v1.0)

This document defines the REST API contract for the Resume Analyzer SaaS MVP.

---

## Base URL

```
/api/v1

```

---

## Authentication

Authentication uses JWT Bearer Tokens.

```
Authorization: Bearer <access_token>
```

All protected endpoints require a valid JWT.

---

## Content Types

| Request | Content-Type |
|----------|--------------|
| JSON | application/json |
| File Upload | multipart/form-data |

---

## Standard Success Response

```json
{
  "success": true,
  "data": {}
}
```

---

## Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The uploaded file exceeds the maximum allowed size of 5 MB.",
    "details": []
  }
}
```

---

## HTTP Status Codes

| Status | Meaning |
|---------|----------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Failed |
| 500 | Internal Server Error |

---

## Authentication Module

---

## Register

**POST**

```
/auth/register
```

Authentication:

None

### Request

```json
{
  "name": "Aashish",
  "email": "aashish@example.com",
  "password": "SecurePassword123!"
}
```

### Validation

- Name required
- Email required
- Email unique
- Password minimum 8 characters

### Response

**201 Created**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "Aashish",
      "email": "aashish@example.com"
    }
  }
}
```

---

## Login

**POST**

```
/auth/login
```

Authentication:

None

### Request

```json
{
  "email": "aashish@example.com",
  "password": "SecurePassword123!"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "accessToken": "jwt-token",
    "user": {
      "id": "uuid",
      "name": "Aashish",
      "email": "aashish@example.com"
    }
  }
}
```

---

## Current User

**GET**

```
/auth/me
```

Authentication:

Required

### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Aashish",
    "email": "aashish@example.com"
  }
}
```

---

# Resume Module

---

## List Resumes

**GET**

```
/resumes
```

Authentication:

Required

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Frontend Resume",
      "originalFileName": "resume.pdf",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

## Get Resume

**GET**

```
/resumes/{resumeId}
```

Authentication:

Required

---

## Upload Resume

**POST**

```
/resumes
```

Authentication:

Required

Content-Type

```
multipart/form-data
```

### Request

| Field | Type |
|---------|------|
| title | string |
| file | PDF |

Validation

- PDF only
- Maximum 2 MB

### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Frontend Resume",
    "originalFileName": "resume.pdf",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## Replace Resume

**PUT**

```
/resumes/{resumeId}
```

Authentication:

Required

Content-Type

```
multipart/form-data
```

Same validation as Upload.

---

## Delete Resume

**DELETE**

```
/resumes/{resumeId}
```

Authentication:

Required

### Response

```json
{
  "success": true,
  "data": null
}
```

Deleting a resume also deletes every Analysis associated with it.

---

# Analysis Module

---

## Create Analysis

**POST**

```
/resumes/{resumeId}/analyses
```

Authentication:

Required

### Request

```json
{
  "jobDescription": "We are looking for..."
}
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "resumeId": "uuid",

    "analysisResult": {

      "ruleEngine": {

        "overallScore": 82,

        "sectionScores": {

          "skills": 90,
          "experience": 72,
          "education": 81,
          "projects": 76
        },

        "matchingKeywords": [
          "React",
          "JavaScript"
        ],

        "missingKeywords": [
          "TypeScript",
          "Redux"
        ]
      },

      "ai": {

        "summary": "Your resume aligns well with the role but lacks several required technologies.",

        "suggestions": [

          {
            "category": "Skills",
            "priority": "HIGH",
            "title": "Add TypeScript",

            "description": "Mention your TypeScript experience in projects."
          }

        ]

      }

    },

    "createdAt": "..."
  }
}
```

---

## List Resume Analyses

**GET**

```
/resumes/{resumeId}/analyses
```

Authentication:

Required

Query Parameters

```
?page=1

&limit=20
```

Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "overallScore": 82,
      "createdAt": "..."
    }
  ]
}
```

Ordered by newest first.

---

## Get Analysis

**GET**

```
/analyses/{analysisId}
```

Authentication:

Required

Returns the complete immutable analysis snapshot.

---

# Business Rules

- Users can only access their own resumes.
- Users can only access analyses belonging to their own resumes.
- Every analysis stores a snapshot of the resume used during analysis.
- Replacing a resume does not modify previous analyses.
- Deleting a resume permanently deletes all associated analyses.
- Uploaded files must be PDF format.
- Maximum upload size is 5 MB.

---

# Error Codes

| Code | Meaning |
|--------|----------|
| INVALID_CREDENTIALS | Login failed |
| EMAIL_ALREADY_EXISTS | Registration failed |
| UNAUTHORIZED | Missing JWT |
| FORBIDDEN | Access denied |
| RESOURCE_NOT_FOUND | Resource does not exist |
| FILE_TOO_LARGE | Upload exceeds 5 MB |
| UNSUPPORTED_FILE_TYPE | Only PDF accepted |
| PARSING_FAILED | Resume parsing failed |
| VALIDATION_FAILED | Request validation failed |
| INTERNAL_SERVER_ERROR | Unexpected server error |

---

# API Versioning

Current version:

```
v1
```

Future breaking changes will be released under:

```
/api/v2
```

without modifying previous versions.