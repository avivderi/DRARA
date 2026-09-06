# 🚀 DRARA — פלטפורמת חיבור שותפים וסריקת AI למיזמים

> מצא את השותף המדויק למיזם שלך. בנה את הסטארטאפ. הכל במקום אחד.

---

## 🏗️ ארכיטקטורת המערכת

```text
drara/
├── apps/
│   ├── api/          # Node.js + Express backend (REST API, OAuth, Knex PostgreSQL, Redis)
│   ├── mobile/       # React Native + Expo app (cross-platform, NFC Handshake, Google/GitHub OAuth)
│   └── web/          # Next.js web application
├── packages/
│   └── shared-types/ # Shared TypeScript types & DTO interfaces
├── docker-compose.yml
└── README.md
```

---

## 🛠️ טכנולוגיות מרכזיות (Tech Stack)

| שכבה | טכנולוגיה | סיבה |
|---|---|---|
| **Backend** | Node.js + Express (TypeScript) | שרת מהיר, יציב ופשוט להרחבה |
| **מסד נתונים** | PostgreSQL + Knex.js (`pgvector`) | יחסים מובנים + חיפוש וקטורי מובנה ב-AI |
| **זיכרון מטמון** | Redis | ניהול סשנים מהיר ותפוגת טוקנים |
| **אימות** | JWT RS256 + OAuth (Google, GitHub) | אימות תקני, מאובטח ונטול מדינה |
| **מובייל** | React Native + Expo | תמיכה מלאה ב-NFC חומרה בניידים |
| **עיצוב & טיפוגרפיה**| Google Sans + Pacifico (`drara` logo) | מראה אלגנטי, מודרני ונקי |

---

## 📱 מפת כל 45 המסכים באפליקציה (קבוצות 1-6)

להלן הטבלה המלאה של כל מסכי האפליקציה לפי הסדר הלוגי של חוויית המשתמש:

### קבוצה 1 — Onboarding & Auth (אימות והגדרת פרופיל)

| # | שם המסך (`.tsx`) | מה הוא עושה | מחובר ל-API אמיתי? | איך מגיעים אליו בזרימה הרגילה |
|---|---|---|---|---|
| 1 | `WelcomeScreen.tsx` | מסך פתיחה, מיתוג `drara`, וכפתורי התחברות Google / GitHub / דוא"ל | כן (`/auth/google`, `/auth/github`) | מסך פתיחה ראשי בהפעלת האפליקציה |
| 2 | `LoginScreen.tsx` | טופס התחברות עם דוא"ל וסיסמה | כן (`/auth/login`) | בלחיצה על "התחברות" מ-WelcomeScreen |
| 3 | `OAuthCallbackScreen.tsx` | מסך חזית לטעינת טוקנים מ-OAuth | כן (`/auth/google/callback`) | אוטומטית בחזרה מ-OAuth |
| 4 | `RoleSelectionScreen.tsx` | בחירת מטרת תפקיד: יזם (Founder) / מפתח (Developer) / שניהם | כן (`PATCH /users/me`) | אחרי התחברות מוצלחת ב-WelcomeScreen |
| 5 | `OfferingSeekingScreen.tsx` | בחירת תגיות מה אני מציע (Offering) ומה מחפש (Seeking) | כן (`PATCH /users/me`) | בלחיצה על "המשך" מ-RoleSelectionScreen |
| 6 | `SkillsScreen.tsx` | בחירת מיומנויות טכניות ועסקיות ראשיות | כן (`PATCH /users/me`) | בלחיצה על "המשך" מ-OfferingSeekingScreen |
| 7 | `ExperienceAvailabilityScreen.tsx` | הגדרת שנות ניסיון (Senior/Mid/Junior) וזמינות בשעות שבועיות | כן (`PATCH /users/me`) | בלחיצה על "המשך" מ-SkillsScreen |
| 8 | `BioScreen.tsx` | כתיבת תיאור קצר/פיץ' אישי | כן (`PATCH /users/me`) | בלחיצה על "המשך" מ-ExperienceAvailabilityScreen |
| 9 | `AvatarHeadlineScreen.tsx` | העלאת תמונת פרופיל וכותרת אישית (Headline) | כן (`PATCH /users/me`) | בלחיצה על "המשך" מ-BioScreen |
| 10 | `ProfileCompletionSuccessScreen.tsx` | מסך אישור סיום הגדרת פרופיל והנעה לפעולה ראשונה | כן (מחובר לסטייט) | בלחיצה על "סיום הרשמה" מ-AvatarHeadlineScreen |

### קבוצה 2 — Idea Upload & AI Scanning (העלאת רעיון וסריקת GitHub ב-AI)

| # | שם המסך (`.tsx`) | מה הוא עושה | מחובר ל-API אמיתי? | איך מגיעים אליו בזרימה הרגילה |
|---|---|---|---|---|
| 11 | `IdeaEntryScreen.tsx` | הזנת שם רעיון, תיאור קצר ופלטפורמה | כן (`POST /ideas`) | בלחיצה על "צור מיזם חדש" ב-MyIdeasScreen |
| 12 | `GitHubConnectScreen.tsx` | חיבור חשבון GitHub לסריקת קוד | כן (`GET /github/repos`, OAuth) | בלחיצה על "חבר GitHub" מ-IdeaEntryScreen |
| 13 | `RepoSelectionScreen.tsx` | בחירת מאגר קוד (Repository) לסריקה מתוך רשימת המאגרים | כן (`GET /github/repos`) | בלחיצה על "בחר Repo" מ-GitHubConnectScreen |
| 14 | `AIScanLoadingScreen.tsx` | מסך טעינה ואנימציה בעת ניתוח קוד ב-AI | כן (`POST /ideas/scan`) | בלחיצה על "התחל ניתוח AI" מ-RepoSelectionScreen |
| 15 | `AIScanResultsScreen.tsx` | הצגת תוצאות ניתוח ה-AI (Stack, architecture, tags, summary) | כן (`GET /ideas/:id/scan`) | אוטומטית בגמר טעינת AIScanLoadingScreen |
| 16 | `MissingGapsScreen.tsx` | השלמת פערים ותפקידים חסרים בצוות שה-AI זיהה | כן (`PATCH /ideas/:id`) | בלחיצה על "המשך להגדרת תפקידים" מ-AIScanResultsScreen |
| 17 | `VisibilitySettingsScreen.tsx` | קביעת הגדרות חשיפה ופרטיות לרעיון | כן (`PATCH /ideas/:id`) | בלחיצה על "המשך להגדרות פרטיות" מ-MissingGapsScreen |
| 18 | `PublishConfirmationScreen.tsx` | אישור סופי ופרסום הרעיון לפלטפורמה | כן (`POST /ideas/:id/publish`) | בלחיצה על "פרסם מיזם" מ-VisibilitySettingsScreen |

### קבוצה 3 — Matches & Candidate Profiles (התאמות AI ופרופילים)

| # | שם המסך (`.tsx`) | מה הוא עושה | מחובר ל-API אמיתי? | איך מגיעים אליו בזרימה הרגילה |
|---|---|---|---|---|
| 19 | `MatchesFeedScreen.tsx` | פיד התאמות כרטיסים מבוסס AI vector search | כן (`GET /matching/feed`) | בלחיצה על טאב "התאמות" בתפריט התחתון |
| 20 | `MyIdeasScreen.tsx` | ניהול הרעיונות והפרויקטים של המשתמש | כן (`GET /ideas/me`) | בלחיצה על "הרעיונות שלי" |
| 21 | `CandidateProfileScreen.tsx` | פרופיל מועמד מורחב כולל ניתוח התאמה סמנטי | כן (`GET /matching/candidates/:id`) | בלחיצה על כרטיס מועמד ב-MatchesFeedScreen |
| 22 | `MatchIntroModalScreen.tsx` | מודל שליחת הודעת היכרות ראשונית למועמד | כן (`POST /matching/intro`) | בלחיצה על "צור קשר" ב-CandidateProfileScreen |
| 23 | `DeepDiveReportScreen.tsx` | דוח ניתוח עומק של ההתאמה (Semantic Alignment Score & Gaps) | כן (`GET /matching/deep-dive/:id`) | בלחיצה על "צפה בדוח עומק" ב-CandidateProfileScreen |

### קבוצה 4 — Physical NFC Handshake (אישור פיזי בלחיצת יד NFC)

| # | שם המסך (`.tsx`) | מה הוא עושה | מחובר ל-API אמיתי? | איך מגיעים אליו בזרימה הרגילה |
|---|---|---|---|---|
| 24 | `ScheduleMeetingScreen.tsx` | תיאום מפגש פיזי לאישור בלחיצת יד NFC | כן (`POST /handshake/schedule`) | בלחיצה על "קבע מפגש NFC" מ-MatchIntroModalScreen |
| 25 | `MeetingFeedbackScreen.tsx` | דיווח ומשוב על מפגש פיזי שהתקיים | כן (`POST /handshake/feedback`) | בלחיצה על "דווח על מפגש" מ-ScheduleMeetingScreen |
| 26 | `NFCPreparationScreen.tsx` | מסך הכנה, הוראות והפעלת רכיב ה-NFC במכשיר | כן (`GET /handshake/status`) | בלחיצה על "התחל לחיצת יד" מ-MeetingFeedbackScreen |
| 27 | `NFCHandshakeScreen.tsx` | מסך לחיצת יד NFC בזמן אמת עם אימות הצפנתי | כן (`POST /handshake/verify`) | בלחיצה על "בצע הצמדה" מ-NFCPreparationScreen |
| 28 | `NFCSuccessScreen.tsx` | אישור הצלחת לחיצת היד הפיזית ופתיחת הרשאות | כן (`GET /handshake/success`) | אוטומטית בגמר אימות NFCHandshakeScreen |
| 29 | `NFCTimeoutErrorScreen.tsx` | מסך שגיאה וניסיון חוזר במקרה של חריגת זמן ב-NFC | כן (`POST /handshake/retry`) | אוטומטית בעת כשל/חריגת זמן ב-NFCHandshakeScreen |

### קבוצה 5 — Community, Chat & Profile (קהילה, הודעות ופרופיל)

| # | שם המסך (`.tsx`) | מה הוא עושה | מחובר ל-API אמיתי? | איך מגיעים אליו בזרימה הרגילה |
|---|---|---|---|---|
| 30 | `PublicFeedScreen.tsx` | פיד ציבורי של מיזמים ורעיונות בקהילה | כן (`GET /ideas/public`) | בלחיצה על טאב "קהילה" בתפריט התחתון |
| 31 | `PublicIdeaDetailsScreen.tsx` | תצוגה מפורטת של רעיון ציבורי כולל AI summary | כן (`GET /ideas/public/:id`) | בלחיצה על רעיון מ-PublicFeedScreen |
| 32 | `IdeaSearchScreen.tsx` | מסך חיפוש וסינון רעיונות לפי מילות מפתח ותגיות | כן (`GET /ideas/search`) | בלחיצה על כפתור החיפוש ב-PublicFeedScreen |
| 33 | `InboxScreen.tsx` | תיבת הודעות ושיחות פעילות במיזם | כן (`GET /conversations`) | בלחיצה על טאב "צ׳אט" בתפריט התחתון |
| 34 | `ChatConversationScreen.tsx` | חלון שיחה וצ׳אט בזמן אמת עם מועמד/שותף | כן (`GET /conversations/:id/messages`) | בלחיצה על שיחה מ-InboxScreen |
| 35 | `UserProfileScreen.tsx` | צפייה בפרופיל האישי של המשתמש המחובר | כן (`GET /users/me`) | בלחיצה על טאב "פרופיל" בתפריט התחתון |
| 36 | `EditProfileScreen.tsx` | טופס עריכת פרטי פרופיל, מיומנויות ותמונה | כן (`PATCH /users/me`) | בלחיצה על "ערוך פרופיל" מ-UserProfileScreen |
| 37 | `SettingsScreen.tsx` | הגדרות חשבון, התנתקות ומידע על המערכת | כן (`POST /auth/logout`) | בלחיצה על כפתור ההגדרות מ-UserProfileScreen |
| 38 | `NotificationsScreen.tsx` | מרכז התראות מערכת (בקשות היכרות, התאמות, Handshakes) | כן (`GET /notifications`) | בלחיצה על פעמון ההתראות ב-BrandHeader |

### קבוצה 6 — Shared Workspace & Equity (מרחב עבודה משותף ואקוויטי)

| # | שם המסך (`.tsx`) | מה הוא עושה | מחובר ל-API אמיתי? | איך מגיעים אליו בזרימה הרגילה |
|---|---|---|---|---|
| 39 | `PartnershipsScreen.tsx` | רשימת מיזמים פעילים שאומתו פיזית ב-NFC Handshake | כן (`GET /partnerships`) | בלחיצה על טאב "Workspace" בתפריט התחתון |
| 40 | `WorkspaceOverviewScreen.tsx` | מרכז שליחה וסקירה כללית של מרחב העבודה המשותף | כן (`GET /workspaces/:id`) | בלחיצה על מיזם מ-PartnershipsScreen |
| 41 | `IdeaBoardScreen.tsx` | לוח משימות ורעיונות משותף לצוות (Kanban / Board) | כן (`GET /workspaces/:id/board`) | בלחיצה על טאב "לוח משימות" ב-WorkspaceOverviewScreen |
| 42 | `RoadmapScreen.tsx` | מפת דרכים ואבני דרך (Milestones & Roadmap) למיזם | כן (`GET /workspaces/:id/roadmap`) | בלחיצה על טאב "Roadmap" ב-WorkspaceOverviewScreen |
| 43 | `DecisionLogScreen.tsx` | יומן החלטות מתועד של הצוות (Decision Log) | כן (`GET /workspaces/:id/decisions`) | בלחיצה על טאב "החלטות" ב-WorkspaceOverviewScreen |
| 44 | `EquityFrameworkScreen.tsx` | מודל והסכם חלוקת אקוויטי דינמי (Dynamic Equity Split) | כן (`GET /workspaces/:id/equity`) | בלחיצה על טאב "אקוויטי" ב-WorkspaceOverviewScreen |

### כלי בדיקה פנימי (DEV Only)

| # | שם המסך (`.tsx`) | מה הוא עושה | מחובר ל-API אמיתי? | איך מגיעים אליו בזרימה הרגילה |
|---|---|---|---|---|
| 45 | `DebugMenuScreen.tsx` | תפריט Debug פנימי לניווט ישיר לכל המסכים | פנימי (`__DEV__` בלבד) | בלחיצה ארוכה על הלוגו במסך פתיחה או ב-DEV badge |

---

## ⚡ הרצה מהירה לדרגות הפיתוח

### 1. הרצת השרת (API Server)
```bash
npm run dev:api
```
*(רץ בפורט 3001, מקליט את כל הבקשות בזמן אמת לקובץ `apps/api/logs/requests.log`)*

### 2. מעקב בזמן אמת אחרי לוג הבקשות
```bash
tail -f apps/api/logs/requests.log
```

### 3. הרצת אפליקציית ה-Mobile (Expo)
```bash
npm run dev:mobile
```
- **Web**: גלוש ל-`http://localhost:19006`.
- **נייד**: סרוק את קוד ה-QR באפליקציית Expo Go.

### 4. שימוש בתפריט ה-Debug במצב פיתוח
במסך הפתיחה (Welcome), לחץ בלחיצה ארוכה על הלוגו `drara` או לחץ על ה-Badge הצהוב **`🛠️ DEV: תפריט 49 מסכים`** כדי לקפוץ ישירות לכל אחד ממסכי האפליקציה!