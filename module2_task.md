# Module 2 Task & TODO Summary — GitHub Scanning & AI Microservice

## 📌 TODO עתידי
- [ ] **שדרוג Readiness Score ל-AI אמיתי**: כרגע מדד ה-Readiness Score מחושב לפי ספירת קבצים ולוגיקה בסיסית. בהמשך יש לשדרג את המנגנון כך שייעזר מודל AI (Gemini) שינתח לעומק את איכות הארכיטקטורה, כיסוי הטסטים, התיעוד ומורכבות הקוד. זהו TODO נפרד למעקב.

---

## 🚀 מה בוצע ב-Module 2
1. **GitHub App & OAuth**:
   - `GET /github/install-url` להפניית משתמש להתקנת ה-App.
   - אימות Webhooks באמצעות חתימת HMAC בעזרת secret.
   - שמירת `connected_repos` המקשרת בין `user_id`, `idea_id` ו-`repo_full_name`.

2. **FastAPI AI Service (`apps/ai-service`)**:
   - נקודת קצה `POST /scan` המבצעת אנליזה של עץ הקוד, הקבצים והטכנולוגיות בעזרת Gemini.
   - הפקת סיכום ארכיטקטורה (`ai_summary`) וטכנולוגיות עיקריות.

3. **Rate Limiting & Caching**:
   - הגבלת כמות סריקות יומית דרך Redis (`MAX_SCANS_PER_DAY`).
   - שמירת תוצאות ב-Redis ומניעת סריקות מיותרות.

4. **Integration & Multi-Repo Testing**:
   - נכתב ונבדק `multi-repo.integration.test.ts` המוודא שסריקת מאגרים שונים מחזירה ניתוח ייחודי ומובחן לכל פרויקט.
