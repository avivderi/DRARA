# 🚀 DRARA — AI Co-Founder & Idea Protection Platform
### תכנון MVP v0.2 — פלטפורמת ה-Co-Founder החכמה עם NFC Handshake

---

## 🎯 Vision

פלטפורמה שמחברת יזמים (בעיקר מפתחים) עם שותפים/יועצים משלימים — תוך שימוש ב-AI כדי להבין את הפרויקט שלהם (כולל ניתוח קוד אמיתי מ-GitHub), למצוא את ההתאמה הנכונה, ולאשר את החיבור הסופי באמצעות **מגע פיזי מאובטח (NFC)** ברגע שהצדדים נפגשים ומחליטים להמשיך.

**One-liner**: *"DRARA מבינה את הפרויקט שלך, מוצאת לך את השותף הנכון, והחיבור נחתם במגע — לא רק בקליק."*

**מה חדש מול v0.1**: המוצר כבר לא "עוד co-founder matching app". הבידול האמיתי הוא השילוב של שלושה דברים שאף מתחרה לא עושה יחד: (1) הבנת AI אמיתית של הפרויקט מתוך הקוד עצמו, לא רק תיאור טקסטואלי, (2) שכבת פרטיות/הרשאה בררנית של היזם על מי רואה מה, ו-(3) אישור פיזי מאובטח (DRARA NFC) כטקס המעבר בין "התאמה דיגיטלית" ל-"שותפות אמיתית".

---

## 🧩 הבעיה שאנחנו פותרים

- מתכנת עם רעיון לסטארטאפ **לא יודע הכל** — חסר לו ידע עסקי/עיצובי/שיווקי, וגם לא תמיד יודע למי בטוח לחשוף את הפרויקט
- הכלים הקיימים (LinkedIn, Discord, פורומים) הם **passive וטקסטואליים** — אף אחד לא באמת "רואה" מה בנית, רק קורא תיאור שיווקי
- אין מנגנון שנותן ליזם שליטה עדינה: "אני רוצה עזרה, אבל לא רוצה שכל העולם יראה את הקוד/רעיון שלי"
- אין "טקס סגירה" ברור לרגע שבו שיחת הכרות הופכת לשותפות מחייבת — היום זה קורה בהודעת WhatsApp מבולבלת

---

## 👤 Target Users

| Persona | תיאור |
|---|---|
| **The Builder** | מפתח עם רעיון ו-repo, חסר לו Product / Marketing / Sales |
| **The Advisor/Mentor** | בעל ניסיון שרוצה לייעץ בלי מחויבות מלאה, לפני שנכנס כשותף |
| **The Specialist** | DevOps, מעצב, איש מכירות — מחפש פרויקט קונקרטי (לא "עוד רעיון סטארטאפי") |
| **The Repeater** | יזם סדרתי עם כמה רעיונות, בוחר מה חושף ולמי |

---

## ⚡ Core Features — MVP (בנייה מודולרית, מוצר שלם)

### 🔐 1. הרשמה וזהות
- אפליקציית **נייטיב (React Native + Expo)** — הפלטפורמה הראשית, כולל NFC אמיתי
- **ממשק ווב נלווה** — לא תחליף לאפליקציה, אלא הרחבה: dashboard מתקדם, עריכת פרופיל מורחבת, ניהול פרויקטים מרובים. חיבור בין המכשירים באמצעות **סריקת QR** מהווב לאפליקציה (כמו WhatsApp Web) — לא הרשמה כפולה, session linking בלבד
- Auth: OAuth (Google + **GitHub**, כי זה חובה למודול הסריקה) + JWT RS256 (כמו שכבר תכננת ב-DRARA/MakeDev)

### 📤 2. העלאת רעיון — חיבור GitHub
- היזם מחבר repo **פרטי** דרך GitHub App (לא Personal Access Token — Github App עם scoped permissions, פחות מפחיד מבחינת אמון)
- המערכת סורקת: README, מבנה תיקיות, package.json/requirements.txt (זיהוי stack), ולא את כל הקוד שורה-שורה — **סיכום ברמת ארכיטקטורה**, לא code review מלא (זה שומר על עלות AI סבירה ועל פרטיות)
- AI (Claude/Gemini API) מייצר: תקציר "מה האפליקציה עושה", זיהוי stack טכני, **Readiness Score**
- היזם משלים ידנית: "מה חסר לי" (roles/skills מבוקשים) — טקסט חופשי + tags מובנים

### 🕶️ 3. שכבת פרטיות והרשאות (התחליף ל"הגנת זכויות יוצרים")
במקום "בעלות/חסימה" (שהיא בעייתית משפטית) — **שליטה בררנית של היזם**:
- **Timestamp Proof**: כל רעיון מקבל חותמת זמן קריפטוגרפית ברגע ההעלאה (hash של התיאור + metadata, לא של הקוד עצמו) — "הוכחת קיום", לא "בעלות משפטית". שקוף למשתמש שזה לא ייעוץ משפטי
- **Visibility Levels** לכל רעיון:
  - 🌍 **Public** — כולם רואים תיאור מלא ברשימה
  - 🔒 **Private + AI Recommends** — לא מוצג ברשימה הכללית; ה-AI ממליץ ליזם על מועמדים ספציפיים (לפי skill gap שהוגדר), והיזם בוחר אם לפנות
  - 👥 **Invite Only** — היזם שולח הזמנה ישירה לאדם ספציפי שכבר מכיר

### 🎯 4. AI-Powered Matching Engine
- Embedding-based matching: וקטור של "מה חסר ליזם" מול וקטור "מיומנויות + ניסיון" של מועמדים (לא rule-based פשוט של keyword matching — זה מה שיבדיל אתכם מהמתחרים)
- דירוג התאמה + הסבר קצר "למה זה מתאים" (AI-generated rationale)

### 💬 5. תהליך היכרות מובנה
1. **Intro Round**: 3 שאלות מוגדרות מראש (כמו ב-v0.1)
2. **Deep Dive**: שיחה חופשית בצ'אט בתוך האפליקציה
3. **Compatibility Report**: סיכום AI לפני שקובעים פגישה

### 🤝 6. ה-Handshake הפיזי — שילוב DRARA
זה הלב של הבידול. אחרי שיחה/פגישה (פיזית או וירטואלית), אם שני הצדדים מחליטים להמשיך:
- היזם המקורי **פותח הרשאות לפרויקט** (repo access, workspace access) רק לאחר **מגע NFC מאובטח** מול מכשיר המועמד
- טכנית: משתמשים בפרוטוקול ה-offline handshake שכבר תכננת ב-DRARA v3.0 (Zero-Knowledge signaling) — ה-NFC לא "מפעיל קסם", הוא **מייצר טוקן קריפטוגרפי חתום** שמאמת "שני האנשים האלה היו פיזית באותו מקום באותו רגע", ואז השרת פותח את ההרשאות בפועל
- זה נותן שכבת אמון שאין לאף מתחרה: את זה אי אפשר לזייף מרחוק

### 🏗️ 7. Co-Building Workspace (Post-Handshake)
- Idea Board, Roadmap Builder (AI-suggested), Decision Log — כמו ב-v0.1
- Equity Framework — מדריך, לא ייעוץ משפטי (disclaimer ברור)

---

## 🗺️ User Flow

```
[הרשמה — Native App] → [חיבור GitHub App לפרויקט פרטי]
     ↓
[AI סורק README + מבנה + מייצר תקציר] → [Readiness Score]
     ↓
[היזם מגדיר: מה חסר לו] → [בוחר Visibility Level לרעיון]
     ↓
[AI מציע מועמדים מתאימים] → [היזם בוחר למי לפנות (אם Private)]
     ↓
[Intro → Deep Dive → Compatibility Report]
     ↓
[פגישה — פיזית או וירטואלית]
     ↓
[החלטה להמשיך] → [NFC Handshake מאמת נוכחות פיזית] → [הרשאות נפתחות אוטומטית]
     ↓
[Co-Building Workspace]
```

---

## 🛠️ Tech Stack

### Native App (הליבה)
- **React Native + Expo** (כמו MakeDev / DRARA)
- NFC: `react-native-nfc-manager` (אמיתי, לא Web NFC המוגבל)
- JWT RS256 auth, secure storage (Keychain/Keystore)

### Web Companion
- **Next.js 14** — dashboard מורחב בלבד, לא duplicate של האפליקציה
- **QR Session Linking**: הווב מציג QR, האפליקציה סורקת → session token מועבר, דומה ל-WhatsApp Web / Notion mobile handoff

### Backend
- **Node.js + Express** (יש לך כבר ניסיון עמוק בזה מ-BlackJack, MakeDev, Bitcoin SaaS)
- **PostgreSQL** — Users, Projects, Matches (יחסי, מתאים לסכמה הזו טוב יותר מ-Mongo)
- **Redis** — session cache, matching queue
- **Python microservice נפרד (FastAPI)** — ל-AI/GitHub scanning pipeline (שפה שאתה שולט בה טוב לעבודת AI/data), מתקשר ל-Node core דרך REST פנימי
- **NFC Signaling Server** — הרכיב שכבר תכננת ב-DRARA (Zero-Knowledge, in-memory Python)

### AI Layer
- **Claude API / Gemini** — סריקת README + קוד ברמת מבנה, יצירת תקציר, matching embeddings
- שימי לב: זה המודול שאני ממליץ לבנות עם **feature flag** — אם הוא נתקע/יקר מדי ב-token usage, שאר המוצר ממשיך לעבוד עם קלט טקסטואלי ידני כ-fallback

### Infrastructure
- Vercel (web) / Railway-Render (backend) / Cloudinary / Resend — כמו v0.1

---

## 🗄️ Database Schema — מעודכן

```
Users
  - id, name, email, avatar
  - skills[], experience_level, commitment_level
  - github_username (OAuth linked)
  - device_public_key (ל-NFC handshake verification)

Ideas
  - id, user_id (owner)
  - title, description, ai_summary (מה-GitHub scan)
  - github_repo_url (encrypted reference, לא URL גלוי)
  - stack_detected[] (AI generated)
  - visibility (public / private_ai_recommend / invite_only)
  - timestamp_proof_hash
  - looking_for[] (skills needed)
  - readiness_score

Matches
  - id, user1_id, user2_id, idea_id
  - status (suggested/intro/deep_dive/report/pending_handshake/confirmed)
  - compatibility_score, compatibility_report

VettingMessages
  - id, match_id, sender_id, round, message

HandshakeEvents
  - id, match_id
  - nfc_token_signature, verified_at, location_hash (לא GPS מדויק, רק hash לאימות קרבה)
  - permissions_granted[] (מה נפתח בעקבות זה)

Projects (Post-Match)
  - id, match_id, roadmap[], decisions[], equity_notes
```

---

## 💰 Monetization

זהה במהותו ל-v0.1, אבל עם דגש: ה-GitHub scanning וה-NFC handshake הם הפיצ'רים שמצדיקים tier בתשלום (לא matching בסיסי):

| Plan | מחיר | כלול |
|---|---|---|
| **Free** | $0 | פרופיל + תיאור טקסטואלי + 3 matches/חודש |
| **Builder** | $29/mo | + חיבור GitHub + AI summary + unlimited matches |
| **Pro** | $79/mo | + NFC Handshake + Co-Building Workspace |
| **Startup** | $149/mo | + Investor intros, multiple projects |

---

## 📅 Roadmap — בנייה מודולרית (לא multi-release, אלא ארכיטקטורת מודולים עצמאיים מההתחלה)

היות ובחרת לבנות מוצר שלם מההתחלה, ההמלצה הטכנית שלי: **תבנה כל מודול בבידוד עם ממשק ברור ביניהם**, כך שאם מודול אחד (בעיקר GitHub scanning) לוקח יותר זמן ממתוכנן, שאר המערכת ממשיכה להתקדם:

1. **Core**: Auth (native + web QR linking) + Profiles + PostgreSQL schema
2. **Idea Engine**: העלאת רעיון + GitHub App scan + AI summary (מאחורי feature flag)
3. **Privacy Layer**: Visibility levels + timestamp proof
4. **Matching**: embedding-based engine + recommendations
5. **Vetting**: Intro/Deep Dive/Report + chat
6. **DRARA Handshake**: אינטגרציה עם הפרוטוקול שכבר תוכנן — **זה המודול שכבר יש לך spec מלא עליו, תתחיל ממנו מוקדם כי הידע כבר קיים אצלך**
7. **Workspace**: Post-match tools

---

## ⚠️ סיכונים טכניים שכדאי להכיר מראש

- **GitHub scanning cost**: קריאת AI API על כל repo יכולה להתייקר מהר. תכנן caching + rate limiting מההתחלה
- **NFC UX בעולם האמיתי**: אנדרואיד ו-iOS מתנהגים שונה מאוד עם NFC (iOS מגביל הרבה יותר). ודא compatibility מוקדם, לא בסוף
- **Privacy trust**: יזמים יהססו לתת GitHub App access ל-repo פרטי. שקול onboarding שמסביר בדיוק מה נסרק ומה לא (transparency כ-feature, לא רק כ-disclaimer)

---

## ❓ שאלות פתוחות

1. **שם המוצר** — ✅ **DRARA** (סגור)
2. **GitHub App permissions** — read-only מלא, או רק metadata+README בשלב ראשון?
3. **NFC handshake — מה קורה אם אחד המשתמשים על iOS עם מגבלות NFC?** צריך fallback (QR code מאובטח כגיבוי?)
4. **מודל AI** — Claude API בלבד או hybrid?

---

*v0.2 — נוצר ב-03/09/2026 — **DRARA** — AI Co-Founder Platform with NFC Trust Layer*
