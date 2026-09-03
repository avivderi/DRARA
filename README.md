# 🚀 DRARA — AI Co-Founder & Idea Protection Platform

> Find your co-founder. Build your startup. All in one place.

## Architecture

```
drara/
├── apps/
│   ├── api/          # Node.js + Express backend (Module 1 — complete)
│   ├── mobile/       # React Native + Expo (scaffold)
│   └── web/          # Next.js (scaffold)
├── packages/
│   └── shared-types/ # Shared TypeScript types
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Backend | Node.js + Express | Familiar, battle-tested |
| Database | PostgreSQL + Knex | Relational schema, raw SQL control |
| Cache/Sessions | Redis | Fast TTL-based QR sessions |
| Auth | JWT RS256 + OAuth | Industry standard, stateless |
| Mobile | React Native + Expo | True NFC support (Module 4) |
| Web | Next.js 14 | SSR + performance |
| Logging | Pino (JSON) | Structured, no console.log |
| Testing | node:test + fake repos | Zero overhead, no DB needed |

## Quick Start (Local Dev)

### Prerequisites
- Node.js 20+
- Docker + Docker Compose
- npm 10+

### 1. Clone & Install
```bash
git clone https://github.com/avivderi/DRARA.git
cd DRARA
npm install
```

### 2. Environment
```bash
cp .env.example apps/api/.env
# Fill in: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
```

### 3. Generate RSA Keys
```bash
cd apps/api
npm run keys:generate
cd ../..
```

### 4. Start Services
```bash
docker-compose up -d
# Wait for postgres and redis to be healthy
```

### 5. Run Migrations
```bash
cd apps/api
npm run db:migrate
cd ../..
```

### 6. Start API
```bash
npm run dev:api
# API available at http://localhost:3001
# Health check: GET http://localhost:3001/health
```

## Running Tests
```bash
# All tests (no DB required — uses fake repositories)
npm test

# API tests only
npm test --workspace=apps/api
```

## Module Roadmap
- ✅ **Module 1** — Core Infrastructure (Auth, DB, QR Session)
- ✅ **Module 2** — GitHub Scanning + AI Idea Analysis
- ✅ **Module 3** — Matching Engine (`pgvector` cosine similarity, Voyage AI embeddings, symmetric matching)
- 🔜 **Module 4** — NFC Handshake (DRARA Protocol)
- 🔜 **Module 5** — Vetting Flow + Chat
- 🔜 **Module 6** — Co-Building Workspace

## Module 3 Architecture & Vector Embeddings

Module 3 implements embedding-based similarity matching using PostgreSQL's `pgvector` extension and Voyage AI (`voyage-3-lite`, 1024 dimensions):
- **Vector Storage**: `offering_embedding` (1024-dim) and `seeking_embedding` (1024-dim) stored directly on `users` and `ideas` with `HNSW` vector cosine index (`vector_cosine_ops`).
- **Symmetric Matching**: Supports bidirectional matching — Idea `seeking_tags` vs User `offering_tags` (`GET /ideas/:id/matches`), and User `seeking_tags` vs active public Ideas (`GET /users/me/matches`).
- **Visibility Rules**: Ideas marked `private_ai_recommend` or `invite_only` restrict match access strictly to the owner (`403 MATCHES_PRIVATE_TO_OWNER`).
- **Caching & Rate Limiting**: Match query results are cached in Redis with a 24-hour TTL (`forceRecompute` query parameter supported).

### ⚠️ Future Scalability Risk & TODO (Debounce / Background Queue)
When users update `offering_tags`/`seeking_tags` frequently on Screen 9, synchronous calls to `/embed` can introduce latency or trigger Voyage AI API rate limits.
*Future Action*: Implement a background job queue (e.g. BullMQ / Celery) with a 5-second debounce window to batch embedding regeneration asynchronously.

---

*Built by Aviv Deri — DRARA v0.3 — Module 3*