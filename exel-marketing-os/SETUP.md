# מדריך התקנה — EXEL Marketing Performance OS

> מדריך שלב-אחר-שלב להגדרה, חיבור בסיס נתונים, והפעלה ראשונה של המערכת

---

## דרישות מקדימות

לפני שמתחילים, ודא שיש לך:

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **npm** או **pnpm**
- חשבון **Supabase** (חינמי) — [supabase.com](https://supabase.com)
- חשבון **GitHub** (לפריסה) — אופציונלי
- חשבון **Vercel** (להפעלה בענן) — אופציונלי

---

## שלב 1: הכנת פרויקט Supabase

### 1.1 יצירת פרויקט חדש

1. היכנס ל-[supabase.com](https://supabase.com) וצור חשבון
2. לחץ **New Project**
3. בחר שם לפרויקט: `exel-marketing-os`
4. הגדר סיסמה חזקה לבסיס הנתונים ושמור אותה
5. בחר Region: `eu-central-1` (Frankfurt) — הכי קרוב לישראל
6. לחץ **Create new project** וחכה ~2 דקות

### 1.2 הרצת סכמת בסיס הנתונים

1. בפרויקט Supabase, לחץ על **SQL Editor** בתפריט הצד
2. לחץ **New query**
3. פתח את הקובץ `database/schema.sql` מהפרויקט
4. העתק את כל התוכן והדבק בחלון ה-SQL Editor
5. לחץ **Run** (Ctrl+Enter)
6. ודא שאין שגיאות — ייווצרו 9 טבלאות + נתוני ברירת מחדל

### 1.3 העתקת מפתחות API

1. בתפריט Supabase, לחץ **Settings → API**
2. העתק את:
   - **Project URL** (נראה כמו `https://xxxx.supabase.co`)
   - **anon / public** key
   - **service_role** key (שמור בסוד — אל תחשוף!)

---

## שלב 2: הגדרת משתני סביבה

1. בתיקיית הפרויקט `exel-marketing-os/`, צור קובץ `.env.local`:

```bash
cp .env.example .env.local
```

2. ערוך את הקובץ עם הערכים שהעתקת:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ **אזהרה**: לעולם אל תעלה את `.env.local` ל-GitHub. הוא כבר מוגדר ב-`.gitignore`.

---

## שלב 3: התקנה והפעלה מקומית

```bash
# התקנת תלויות
npm install

# הפעלה בסביבת פיתוח
npm run dev
```

פתח דפדפן ב-[http://localhost:3000](http://localhost:3000)

המערכת תפנה אוטומטית לדף ההתחברות.

---

## שלב 4: יצירת משתמש ראשון (Admin)

1. בלוח הבקרה של Supabase, לחץ **Authentication → Users**
2. לחץ **Invite user** או **Add user**
3. הזן כתובת אימייל וסיסמה
4. חזור למערכת והתחבר עם הפרטים שיצרת

### הגדרת תפקיד Admin (אופציונלי)

ב-SQL Editor של Supabase, הרץ:

```sql
-- בדוק את ה-UUID של המשתמש שיצרת
SELECT id, email FROM auth.users;

-- עדכן פרופיל (אם יש טבלת profiles)
-- המשתמש הראשון מקבל הרשאות Admin אוטומטית דרך RLS
```

---

## שלב 5: הגדרות ראשוניות במערכת

לאחר ההתחברות, עבור לדף **הגדרות** (⚙️ בסרגל הניווט) והגדר:

| הגדרה | ערך מומלץ |
|--------|------------|
| שם החברה | EXEL נדל"ן |
| מטבע | ₪ |
| מע"מ | 17% |
| יעד CPL | ₪500 |
| עלות יעד לפגישה | ₪2,000 |
| עלות יעד לסגירה | ₪15,000 |
| יעד ROI | 3× |
| שנת עבודה ראשית | 2026 |

---

## שלב 6: הוספת ערוצי שיווק פעילים

בדף **הגדרות → ניהול ערוצים**, ודא שהערוצים הרלוונטיים לפעילות שלך מסומנים כ**פעיל**.

המערכת מגיעה עם 21 ערוצי ברירת מחדל:
- פייסבוק / אינסטגרם
- גוגל / יוטיוב
- לידאין
- TikTok
- יד2 / מדלן / הומלס
- SMS / WhatsApp
- אאוטדור / אירועים
- ועוד...

---

## שלב 7: הזנת נתונים ראשונים

### הוספת רשומה חודשית

1. לחץ **רשומות חודשיות** בסרגל הניווט
2. לחץ **+ הוסף רשומה**
3. בחר חודש, שנה, וערוץ
4. הזן נתוני שיווק: הוצאות, לידים, פגישות, סגירות, הכנסה
5. שמור

### העלאת חשבונית

1. לחץ **חשבוניות** בסרגל הניווט
2. לחץ **+ חשבונית חדשה**
3. הזן: ספק, סכום, תאריך, ערוץ, חודש
4. הוסף קישור לקובץ ב-Google Drive (אופציונלי)
5. שמור

---

## פריסה לאוויר (Production)

### אפשרות א: Vercel (מומלץ)

1. העלה את הקוד ל-GitHub
2. היכנס ל-[vercel.com](https://vercel.com) והתחבר עם חשבון GitHub
3. לחץ **New Project** ובחר את הריפו
4. הגדר **Root Directory**: `exel-marketing-os`
5. תחת **Environment Variables**, הוסף את כל המשתנים מ-`.env.local`
6. שנה `NEXT_PUBLIC_APP_URL` לכתובת הדומיין האמיתי
7. לחץ **Deploy**

### אפשרות ב: Docker

```dockerfile
# בקובץ Dockerfile בתיקיית exel-marketing-os/
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t exel-marketing-os .
docker run -p 3000:3000 --env-file .env.local exel-marketing-os
```

---

## הגדרת כתובת Callback ב-Supabase (Production)

ב-Supabase → **Authentication → URL Configuration**:

```
Site URL: https://your-domain.com
Redirect URLs: https://your-domain.com/**
```

---

## בעיות נפוצות

### שגיאת "Invalid API Key"

- ודא שהדבקת את ה-`anon key` הנכון (לא ה-service role)
- בדוק שאין רווחים מיותרים בקובץ `.env.local`

### "User not found" בהתחברות

- ודא שיצרת משתמש ב-Supabase Authentication
- בדוק שהאימייל זהה בדיוק

### טבלאות לא נוצרו

- הרץ שוב את `database/schema.sql` ב-SQL Editor
- בדוק שה-extension `uuid-ossp` הותקן (השורה הראשונה בסכמה)

### דף לבן / שגיאת JavaScript

- פתח DevTools (F12) ובדוק את קונסול השגיאות
- ודא שכל משתני הסביבה הוגדרו
- הרץ `npm run build` ובדוק שגיאות TypeScript

---

## תמיכה

לשאלות טכניות, פנה לצוות הפיתוח עם:
1. תיאור השגיאה
2. צילום מסך של קונסול הדפדפן
3. גרסת Node.js (`node --version`)
4. שם קובץ הסביבה שבשימוש
