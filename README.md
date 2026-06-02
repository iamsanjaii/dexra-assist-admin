# Dexra Assist — Frontend Admin Dashboard

Frontend application for managing the AI knowledge base, chatbot configuration, analytics, and customer support workflows.

---

# Overview

The Dexra Assist Admin Dashboard provides a modern SaaS-style interface for managing the AI assistant ecosystem.

Administrators can:

* Upload and manage knowledge sources
* Create custom Q&A pairs
* Monitor AI analytics
* Test chatbot responses
* Observe token usage and latency
* Manage conversational workflows

The dashboard is designed with a clean, production-oriented user experience focused on usability, observability, and operational control.

---

# Features

# Knowledge Base Management

* Upload PDF, DOCX, XLSX, CSV, and TXT files
* View uploaded documents
* Delete knowledge sources
* Monitor processing state
* Chunk indexing support

---

# Q&A Management

* Create custom question-answer pairs
* Edit existing entries
* Delete entries
* Extend chatbot contextual knowledge

---

# Chatbot Playground

* Test chatbot responses
* Validate retrieval quality
* Observe grounded responses
* Verify hallucination prevention

---

# AI Analytics Dashboard

* Total token usage
* Request analytics
* Average response latency
* Estimated AI cost tracking
* Token usage visualization
* Request trends over time

---

# Security Features

* Protected admin routes
* JWT authentication flow
* Prompt injection protection feedback
* Secure API communication

---

# Tech Stack

## Framework

* Next.js

## Styling

* Tailwind CSS

## UI Components

* shadcn/ui

## Charts

* Recharts

## State Management

* Zustand

## Notifications

* Sonner

## Icons

* Lucide React

---

# Design Principles

The admin dashboard follows:

* minimal SaaS UI design
* professional light theme
* clean typography
* responsive layouts
* accessible interactions
* operational visibility

Inspired by:

* Linear
* Vercel
* Intercom
* modern AI tooling dashboards

---

# Folder Structure

```text id="v4m9pk"
src/
 ├── app/
 ├── components/
 │    ├── dashboard/
 │    ├── analytics/
 │    ├── knowledge-base/
 │    ├── qa-management/
 │    ├── chatbot/
 │    └── ui/
 ├── hooks/
 ├── lib/
 ├── services/
 ├── store/
 └── types/
```

---

# Dashboard Modules

# 1. Knowledge Base

Purpose:
Manage uploaded AI knowledge sources.

Features:

* drag-and-drop upload
* file search
* document deletion
* chunk tracking
* processing status

Supported formats:

* PDF
* DOCX
* XLSX
* CSV
* TXT

---

# 2. Q&A Management

Purpose:
Add curated contextual knowledge for chatbot retrieval.

Features:

* create/update/delete Q&A entries
* searchable table view
* modal-based editing workflows

---

# 3. Chatbot Playground

Purpose:
Internal AI testing interface.

Features:

* contextual conversations
* source citations
* memory-aware sessions
* hallucination validation
* security testing

---

# 4. AI Analytics

Purpose:
Observe AI operational metrics.

Metrics:

* total tokens
* total requests
* latency tracking
* estimated AI cost

Charts:

* token usage over time
* requests per day
* usage trends

---

# State Management

Global state handled using Zustand.

Stores include:

* authentication state
* chat sessions
* analytics state
* knowledge base state

---

# Authentication Flow

1. Admin login
2. JWT token generation
3. Protected route validation
4. Persistent authenticated sessions

---

# API Integration

Frontend communicates with the Gin backend using REST APIs.

Base API:

/api/v1


---

# Notifications

Toast notifications implemented using Sonner.

Used for:

* uploads
* deletions
* errors
* processing updates
* authentication events

---

# Charts & Analytics

Analytics visualizations are implemented using Recharts.

Includes:

* token usage graphs
* request analytics
* latency monitoring
* operational metrics

---

# Security Considerations

The frontend includes:

* protected routes
* sanitized markdown rendering
* secure token handling
* restricted admin access
* prompt injection awareness

---

# Responsive Design

The dashboard is fully responsive across:

* desktop
* tablet
* mobile devices

---

# Local Development

## Install Dependencies


npm install


---

## Start Development Server


npm run dev
---

# Environment Variables

NEXT_PUBLIC_API_URL=


---

# Future Improvements

* Real-time streaming responses
* WebSocket updates
* Role-based access control
* Multi-tenant dashboard
* Advanced analytics
* AI feedback monitoring

---

# Deployment

Frontend deployed using:

* Vercel

Recommended production setup:

* HTTPS
* CDN caching
* environment-based configs

---

# Author

Developed by Sanjai Kumar.
