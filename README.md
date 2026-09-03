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
- 🔜 **Module 2** — GitHub Scanning + AI Idea Analysis
- 🔜 **Module 3** — Matching Engine
- 🔜 **Module 4** — NFC Handshake (DRARA Protocol)
- 🔜 **Module 5** — Vetting Flow + Chat
- 🔜 **Module 6** — Co-Building Workspace

## API Endpoints (Module 1)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | - | Service health check |
| GET | `/auth/google` | - | Start Google OAuth |
| GET | `/auth/github` | - | Start GitHub OAuth |
| POST | `/auth/refresh` | - | Rotate refresh token |
| POST | `/auth/logout` | - | Revoke refresh token |
| GET | `/users/me` | Bearer | Get own profile |
| PATCH | `/users/me` | Bearer | Update profile |
| POST | `/session/qr-init` | - | Init QR web session |
| POST | `/session/qr-confirm` | Bearer | Mobile confirms QR |
| GET | `/session/qr-status/:token` | - | Poll QR status |

---

*Built by Aviv Deri — DRARA v0.1 — Module 1*