# 🚀 FounderMatch — AI Co-Founder Platform
### תכנון ראשוני v0.1

---

## 🎯 Vision
פלטפורמה שמחברת יזמים עם שותפים משלימים, תוך שימוש ב-AI כ-Virtual Co-Founder שמלווה את כל התהליך — מרעיון גולמי ועד להשקה.

**One-liner**: *"Find your co-founder. Build your startup. All in one place."*

---

## 🧩 הבעיה שאנחנו פותרים

- **90%** מהסטארטאפים נכשלים — אחת הסיבות הגדולות: **צוות לא מתאים / לא שלם**
- LinkedIn הוא passive — אנשים לא מוצאים co-founders, הם מוצאים עובדים
- אין כלי שמלווה את כל ה-journey: רעיון → שותף → בנייה משותפת

---

## 👤 Target Users

| Persona | תיאור |
|---------|-------|
| **The Builder** | Full-stack / מפתח עם רעיון, חסר לו Product / Marketing |
| **The Visionary** | יש לו Domain Expertise + רעיון, חסר לו הצד הטכני |
| **The Operator** | ניסיון ב-Business / Sales, מחפש פרויקט להצטרף |
| **The Repeater** | יזם סדרתי שמחפש team לרעיון חדש |

---

## ⚡ Core Features — MVP

### 🔐 1. Smart Onboarding
- פרופיל מפורט: Skills, Experience, Commitment Level
- **Idea Canvas**: ממלא תבנית שמגדירה את הרעיון שלו (בעיה, פתרון, שוק יעד)
- AI מנתח את הרעיון ונותן Readiness Score + שאלות לחידוד

### 🎯 2. AI-Powered Matching Engine
- לא מחפשים אנשים דומים — מחפשים **משלימים**
- Matching לפי: Skills gap, Commitment level, Values, Working style
- AI מציג למה השניים מתאימים + פוטנציאל Red Flags

### 💬 3. Structured Vetting Process
- לא "שלח הודעה" כמו LinkedIn — תהליך מובנה:
  1. **Intro Round**: 3 שאלות מוגדרות מראש
  2. **Deep Dive**: AI שואל שאלות לפי הפרופיל של השני
  3. **Compatibility Report**: דו"ח AI לפני ה-"פגישה" הרשמית
- Trust Score: מבוסס על פעילות בפלטפורמה

### 🏗️ 4. Co-Building Workspace (Post-Match)
- **Idea Board**: כתיבה משותפת של ה-Vision
- **Roadmap Builder**: AI מציע milestones לפי סוג הסטארטאפ
- **Decision Log**: כל החלטה גדולה מתועדת (מי, מה, למה)
- **Equity Framework**: מדריך מובנה לשיחה על חלוקה (לא ייעוץ משפטי)

### 🤖 5. AI Co-Founder Assistant
- זמין תמיד בצ'אט
- יודע את כל ההקשר של הפרויקט שלך
- עוזר ב: Idea validation, Market research, Pitch deck structure, Red flag detection

---

## 🗺️ User Flow

```
[Landing] → [Sign Up] → [Smart Onboarding]
     ↓
[Idea Canvas + AI Readiness Check]
     ↓
[Browse Matches / Get Suggested Matches]
     ↓
[Vetting Process: Intro → Deep Dive → Report]
     ↓
[Match Confirmed!]
     ↓
[Co-Building Workspace + AI Assistant]
     ↓
[Launch Ready 🚀]
```

---

## 🛠️ Tech Stack המוצע

### Frontend
- **Next.js 14** (App Router) — SSR + SEO + Performance
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **shadcn/ui** — Component Library

### Backend
- **Node.js + Express** — API Server
- **PostgreSQL** — Primary Database (Users, Projects, Matches)
- **Redis** — Caching + Session management
- **Socket.io** — Real-time messaging

### AI Layer
- **Google Gemini API** — Core AI Engine
  - Onboarding analysis
  - Matching algorithm enhancement
  - Vetting question generation
  - Co-Founder Assistant chatbot

### Infrastructure
- **Vercel** — Frontend deployment
- **Railway / Render** — Backend deployment
- **Cloudinary** — Image/Media storage
- **Resend** — Email

### Auth
- **NextAuth.js** — Authentication (Google + LinkedIn OAuth)

---

## 🗄️ Database Schema — ראשוני

```
Users
  - id, name, email, avatar
  - skills[], experience_level
  - commitment_level (full-time/part-time/weekends)
  - location, timezone
  - linkedin_url, github_url

Ideas
  - id, user_id (owner)
  - title, problem, solution
  - market, stage (idea/prototype/mvp)
  - looking_for[] (skills needed)
  - readiness_score (AI generated)

Matches
  - id, user1_id, user2_id, idea_id
  - status (pending/vetting/matched/rejected)
  - compatibility_score
  - compatibility_report (AI generated)

VettingMessages
  - id, match_id, sender_id
  - round (intro/deep_dive)
  - message, ai_generated_question

Projects (Post-Match)
  - id, match_id
  - roadmap[], decisions[], equity_notes
```

---

## 💰 Monetization

| Plan | מחיר | מה כלול |
|------|------|---------|
| **Free** | $0 | פרופיל + 3 matches/חודש |
| **Builder** | $29/mo | Unlimited matches + AI Assistant בסיסי |
| **Pro** | $79/mo | הכל + AI Workspace + Priority matching |
| **Startup** | $149/mo | Co-Building Workspace מלא + Investor intros |

---

## 📅 Roadmap

### Phase 1 — MVP (חודשים 1-3)
- [ ] Smart Onboarding + Idea Canvas
- [ ] Matching Engine (rule-based + AI)
- [ ] Vetting Process (3 rounds)
- [ ] Basic Messaging
- [ ] Landing Page + Waitlist

### Phase 2 — Growth (חודשים 4-6)
- [ ] Co-Building Workspace
- [ ] AI Co-Founder Assistant
- [ ] Trust Score System
- [ ] Mobile Responsive PWA

### Phase 3 — Scale (חודשים 7-12)
- [ ] Investor Network Integration
- [ ] Startup Accelerator Partnerships
- [ ] Community Features
- [ ] Mobile App (iOS/Android)

---

## ❓ שאלות פתוחות לדיון

1. **גיאוגרפיה**: מתחילים גלובלי או מתמקדים בשוק ספציפי קודם?
2. **Trust & Verification**: איך מוודאים שאנשים רציניים? (רק LinkedIn login? תשלום?)
3. **NDA / Legal**: האם מוסיפים NDA אוטומטי לפני שיתוף רעיון?
4. **AI Model**: Gemini בלבד או Hybrid עם OpenAI?
5. **שם המוצר**: FounderMatch? CoBuildr? FounderLayer?

---

## 🎨 Design Direction
- **Dark mode first** — תחושת Tech / Premium
- **Colors**: Deep Navy + Electric Purple + Warm Gold accents
- **Typography**: Inter / Geist
- **Vibe**: "YC meets Tinder meets Notion"

---

*v0.1 — נוצר ב-03/09/2026 — לעדכון ולמילוי על ידי היזם*
