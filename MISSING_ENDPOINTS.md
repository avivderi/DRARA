# DRARA — Missing Backend Endpoints Document (Modules 5 & 6)

This document details the required REST API endpoints for **Module 5 (Vetting & Messaging/Inbox)** and **Module 6 (Workspace & Co-Building)**. The mobile UI components currently render rich mock data annotated with `// TODO: needs backend`.

---

## 💬 Module 5 — Messaging, Inbox & Vetting Endpoints

### 1. Conversational Inbox
- **`GET /conversations`**
  - Returns list of active chats for the logged-in user.
  - Payload: `[{ id, match_id, participant: { name, avatar_url, role }, last_message: { text, sent_at }, unread_count }]`
- **`GET /conversations/:id/messages`**
  - Returns message history for a conversation.
  - Query params: `limit`, `before`
- **`POST /conversations/:id/messages`**
  - Sends a new chat message.
  - Body: `{ text: string }`

### 2. Vetting Process (3-Question Intro & AI Compatibility Report)
- **`GET /vetting/:match_id/intro-questions`**
  - Fetches the 3 introductory vetting questions for the match.
- **`POST /vetting/:match_id/intro-answers`**
  - Submits answers to the 3 intro questions.
- **`POST /vetting/:match_id/generate-report`**
  - Triggers Gemini AI service to generate `compatibility_report` based on intro answers & profiles.

---

## 🏗️ Module 6 — Workspace & Co-Building Endpoints

### 1. Active Partnerships
- **`GET /partnerships/me`**
  - Returns list of confirmed co-founder partnerships post-NFC handshake.

### 2. Idea Board
- **`GET /workspace/:project_id/ideas`**
  - Returns idea cards on the workspace board.
- **`POST /workspace/:project_id/ideas`**
  - Creates a new idea/feature card.

### 3. Roadmap Builder
- **`GET /workspace/:project_id/roadmap`**
  - Returns roadmap items grouped by phase (`Now`, `Next`, `Later`).
- **`POST /workspace/:project_id/roadmap`**
  - Adds or updates roadmap items.

### 4. Decision Log
- **`GET /workspace/:project_id/decisions`**
  - Returns formal decision logs.
- **`POST /workspace/:project_id/decisions`**
  - Creates a new decision entry.

---

*Generated as part of DRARA Mobile Handoff — Ready for Module 5 & 6 Backend Implementation.*
