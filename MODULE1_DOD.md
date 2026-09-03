# DRARA — Module 1: Definition of Done

## ✅ Checklist לפני סגירת Module 1

### תשתית
- [ ] `docker-compose up` עולה בלי שגיאות (Postgres + Redis healthy)
- [ ] `npm run dev:api` מאתחל בלי שגיאות, מדפיס logs מובנים (JSON/pino)
- [ ] Health check `GET /health` מחזיר `{"status": "ok"}`
- [ ] אין אף `console.log` בקוד production (רק ב-scripts CLI)

### Database
- [ ] Migrations רצות בהצלחה: `npm run db:migrate`
- [ ] טבלאות קיימות: `users`, `refresh_tokens`
- [ ] שדות פרופיל קיימים ב-users: `skills[]`, `experience_level`, `commitment_level`, `bio`, `github_username`, `device_public_key`

### Auth — End to End
- [ ] הרשמה + התחברות דרך **Google** עובדת end-to-end
- [ ] הרשמה + התחברות דרך **GitHub** עובדת end-to-end
- [ ] `POST /auth/refresh` מחזיר tokens חדשים + מבטל את הישן
- [ ] `POST /auth/logout` מבטל refresh token
- [ ] ניסיון עם token פג תוקף מחזיר 401
- [ ] ניסיון עם token מבוטל מחזיר 401

### User Profile
- [ ] `GET /users/me` עם Bearer token תקין מחזיר פרטי משתמש
- [ ] `GET /users/me` בלי token מחזיר 401
- [ ] `PATCH /users/me` עם input תקין מעדכן ומחזיר משתמש מעודכן
- [ ] `PATCH /users/me` עם input לא תקין מחזיר 400 עם הסבר

### QR Session
- [ ] `POST /session/qr-init` מחזיר session_token + qr_payload
- [ ] `POST /session/qr-confirm` עם token תקין מקשר בין session ל-user
- [ ] `GET /session/qr-status/:token` מחזיר status נכון
- [ ] Session שפג תוקפו (2 דקות) מחזיר 404

### טסטים
- [ ] כל הטסטים עוברים: `npm test`
- [ ] User repository: CRUD מלא ✓
- [ ] RefreshToken repository: create, find, revoke, revokeAll, deleteExpired ✓
- [ ] AuthService: login, duplicate, conflict, refresh rotation, revoked, expired, logout ✓

### CI
- [ ] GitHub Actions CI עובר על branch `main`

### Documentation
- [ ] README ראשי מעודכן עם הוראות הרצה
- [ ] `.env.example` מלא ומעודכן

---

*Module 1 נסגר רק כשכל הסימונות ✅*
