# DRARA — Missing Endpoints Inventory (Module 5 & Module 6 Planning)

הסמכה מרוכזת של ה-API Endpoints הנדרשים למימוש ב-Backend עבור מודולים 5 ו-6 (Messaging, Public Feed, Profile Management & Workspace Governance).

---

## 📩 Module 5: Messaging & Public Feed

### 💬 Messaging & Inbox
- `GET /conversations` — מחזיר רשימת שיחות פעילות (Inbox) עם הודעה אחרונה, תיוג NFC Confirmed ו-unread count.
- `GET /conversations/:threadId/messages` — מחזיר היסטוריית הודעות מול מועמד/שותף.
- `POST /conversations/:threadId/messages` — שליחת הודעה חדשה בזמן אמת.
- `POST /matches/:matchId/intro` — שליחת הודעת Intro ראשונית למועמד.

### 🌐 Public Ideas Feed & Search
- `GET /ideas/public` — מחזיר פיד רעיונות ציבוריים (`visibility = 'public'`) עם Readiness Score ותגיות.
- `GET /ideas/public/search?q=:query&tags=:tags` — חיפוש וסינון מתקדם של רעיונות ציבוריים.
- `GET /ideas/public/:id` — תצוגת רעיון ציבורי מורחב.

### 👤 Profile & User Settings
- `GET /users/me/full-profile` — שליפת פרופיל משתמש מלא (כולל offering/seeking tags ו-Bio).
- `PATCH /users/me` — עדכון פרטי פרופיל (Headline, Bio, Avatar, Tags, Availability).
- `GET /notifications` — שליפת התראות PUSH ומאצ'ים.
- `PATCH /notifications/:id/read` — סימון התראה כנקראה.

---

## 🏢 Module 6: Workspace & Active Co-Founder Collaboration

### 🤝 Workspace Overview & Milestones
- `GET /workspaces/:workspaceId/overview` — שליפת תמונת מצב של מרחב העבודה המשותף.
- `GET /workspaces/:workspaceId/roadmap` — שליפת מפת הדרכים ואבני הדרך (Milestones).
- `POST /workspaces/:workspaceId/roadmap` — הוספת אבן דרך חדשה.

### 📋 Idea Board (Kanban Tasks)
- `GET /workspaces/:workspaceId/tasks` — שליפת לוח המשימות (To Do, In Progress, Done).
- `POST /workspaces/:workspaceId/tasks` — יצירת משימה חדשה.
- `PATCH /workspaces/:workspaceId/tasks/:taskId` — עדכון סטטוס/מבצע של משימה.

### 📜 Decision Log & Equity Framework
- `GET /workspaces/:workspaceId/decisions` — שליפת יומן ההחלטות (Decision Log).
- `POST /workspaces/:workspaceId/decisions` — תיעוד החלטת מייסדים חדשה.
- `GET /workspaces/:workspaceId/equity` — שליפת מודל חלוקת האקוויטי (Equity Split & Vesting Schedule).
- `PATCH /workspaces/:workspaceId/equity` — עדכון מתווה האקוויטי.

---

*מסמך זה מהווה בסיס תכנוני לפיתוח ה-Backend עבור Module 5 & Module 6.*
