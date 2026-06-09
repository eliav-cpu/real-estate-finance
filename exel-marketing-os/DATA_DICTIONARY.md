# מילון נתונים — EXEL Marketing Performance OS

> תיאור מלא של כל שדה, טבלה, וחישוב במערכת

---

## טבלאות בסיס הנתונים

### 1. `channels` — ערוצי שיווק

| שדה | סוג | תיאור |
|-----|-----|--------|
| `id` | UUID | מזהה ייחודי (PK) |
| `name` | TEXT | שם הערוץ בעברית (ייחודי) |
| `name_en` | TEXT | שם הערוץ באנגלית |
| `is_active` | BOOLEAN | האם הערוץ פעיל כעת |
| `created_at` | TIMESTAMPTZ | תאריך יצירה |

**ערוצים ברירת מחדל (21):**
פייסבוק, אינסטגרם, גוגל, יוטיוב, לידאין, TikTok, Taboola, Outbrain, יד2, מדלן, הומלס, SMS, WhatsApp, אימייל, אאוטדור, אירועים, רדיו, TV, SEO, תוכן שיתופי, אחר

---

### 2. `campaigns` — קמפיינים

| שדה | סוג | תיאור |
|-----|-----|--------|
| `id` | UUID | מזהה ייחודי (PK) |
| `name` | TEXT | שם הקמפיין |
| `channel_id` | UUID | FK → channels |
| `month_key` | TEXT | מפתח חודשי (YYYY-MM) |
| `status` | TEXT | סטטוס: active/paused/ended/draft |
| `budget` | NUMERIC | תקציב מתוכנן (₪) |
| `actual_spend` | NUMERIC | הוצאה בפועל (₪) |
| `objective` | TEXT | מטרת הקמפיין |
| `target_audience` | TEXT | קהל יעד |
| `creative_description` | TEXT | תיאור הקריאייטיב |
| `what_worked` | TEXT | מה עבד |
| `what_failed` | TEXT | מה לא עבד |
| `decision` | TEXT | החלטה: scale/stop/continue/pause/test |
| `notes` | TEXT | הערות חופשיות |
| `created_at` | TIMESTAMPTZ | תאריך יצירה |
| `updated_at` | TIMESTAMPTZ | עדכון אחרון |

**ערכי status:**
- `active` — פעיל
- `paused` — מושהה
- `ended` — הסתיים
- `draft` — טיוטה

**ערכי decision:**
- `scale` — להגדיל
- `stop` — לעצור
- `continue` — להמשיך
- `pause` — להשהות
- `test` — לבדוק

---

### 3. `monthly_marketing_records` — רשומות חודשיות

טבלת הליבה של המערכת. כל שורה = ערוץ אחד + חודש אחד.

#### זיהוי

| שדה | סוג | תיאור |
|-----|-----|--------|
| `id` | UUID | מזהה ייחודי (PK) |
| `month_key` | TEXT | מפתח חודשי (YYYY-MM) — לדוגמה: `2026-06` |
| `year` | INTEGER | שנה (2024–2030) |
| `month` | INTEGER | חודש (1–12) |
| `channel_id` | UUID | FK → channels |

#### נתוני הוצאות

| שדה | סוג | תיאור |
|-----|-----|--------|
| `spend` | NUMERIC | סה"כ הוצאה על ערוץ זה בחודש (₪) |
| `impressions` | INTEGER | חשיפות (Impressions) |
| `clicks` | INTEGER | קליקים |

#### משפך המכירות (Funnel)

| שדה | סוג | תיאור |
|-----|-----|--------|
| `leads` | INTEGER | לידים שהגיעו |
| `qualified_leads` | INTEGER | לידים מוסמכים (עברו סינון ראשוני) |
| `meetings` | INTEGER | פגישות שנוצרו |
| `offers_sent` | INTEGER | הצעות מחיר שנשלחו |
| `closings` | INTEGER | עסקאות שנסגרו |

#### נתוני עסקאות

| שדה | סוג | תיאור |
|-----|-----|--------|
| `revenue` | NUMERIC | הכנסה מעסקאות שנסגרו (₪) |
| `avg_deal_value` | NUMERIC | ערך עסקה ממוצע (₪) |
| `commission_rate` | NUMERIC | אחוז עמלה (0–1) |

#### חשבוניות

| שדה | סוג | תיאור |
|-----|-----|--------|
| `invoice_status` | TEXT | סטטוס חשבונית: received/missing/partial |
| `invoice_amount` | NUMERIC | סכום חשבונית שהתקבלה (₪) |
| `invoice_drive_link` | TEXT | קישור לחשבונית ב-Google Drive |
| `payment_status` | TEXT | סטטוס תשלום: paid/pending/overdue |

#### QA ומעקב

| שדה | סוג | תיאור |
|-----|-----|--------|
| `qa_status` | TEXT | סטטוס QA: ok/review/blocked/pending |
| `qa_notes` | TEXT | הערות QA |
| `notes` | TEXT | הערות כלליות |
| `created_at` | TIMESTAMPTZ | תאריך יצירה |
| `updated_at` | TIMESTAMPTZ | עדכון אחרון |

**ערכי invoice_status:**
- `received` — התקבלה
- `missing` — חסרה
- `partial` — חלקית

**ערכי payment_status:**
- `paid` — שולם
- `pending` — ממתין
- `overdue` — באיחור

---

### 4. `invoices` — חשבוניות

| שדה | סוג | תיאור |
|-----|-----|--------|
| `id` | UUID | מזהה ייחודי (PK) |
| `month_key` | TEXT | חודש החשבונית (YYYY-MM) |
| `channel_id` | UUID | FK → channels |
| `vendor_name` | TEXT | שם הספק / נותן השירות |
| `invoice_number` | TEXT | מספר חשבונית |
| `amount` | NUMERIC | סכום לפני מע"מ (₪) |
| `vat_amount` | NUMERIC | סכום מע"מ (₪) |
| `total_amount` | NUMERIC | סכום כולל מע"מ (₪) |
| `invoice_date` | DATE | תאריך החשבונית |
| `due_date` | DATE | תאריך לתשלום |
| `status` | TEXT | סטטוס: received/missing/partial |
| `payment_status` | TEXT | סטטוס תשלום: paid/pending/overdue |
| `file_url` | TEXT | קישור לקובץ (Drive URL) |
| `file_name` | TEXT | שם הקובץ |
| `drive_folder_id` | TEXT | מזהה תיקיית Google Drive |
| `matching_status` | TEXT | סטטוס התאמה: matched/unmatched/partial |
| `record_id` | UUID | FK → monthly_marketing_records |
| `notes` | TEXT | הערות |
| `created_at` | TIMESTAMPTZ | תאריך יצירה |
| `updated_at` | TIMESTAMPTZ | עדכון אחרון |

**ערכי matching_status:**
- `matched` — מותאם לרשומה חודשית
- `unmatched` — לא מותאם
- `partial` — מותאם חלקית

---

### 5. `budgets` — תקציבים

| שדה | סוג | תיאור |
|-----|-----|--------|
| `id` | UUID | מזהה ייחודי (PK) |
| `month_key` | TEXT | חודש (YYYY-MM) |
| `channel_id` | UUID | FK → channels |
| `planned_budget` | NUMERIC | תקציב מאושר (₪) |
| `notes` | TEXT | הערות |
| `created_at` | TIMESTAMPTZ | תאריך יצירה |
| `updated_at` | TIMESTAMPTZ | עדכון אחרון |

---

### 6. `tasks` — משימות ופעולות

| שדה | סוג | תיאור |
|-----|-----|--------|
| `id` | UUID | מזהה ייחודי (PK) |
| `title` | TEXT | כותרת המשימה |
| `description` | TEXT | תיאור מפורט |
| `month_key` | TEXT | חודש רלוונטי |
| `channel_id` | UUID | FK → channels (אופציונלי) |
| `issue_type` | TEXT | סוג הבעיה |
| `priority` | TEXT | עדיפות: critical/high/medium/low |
| `status` | TEXT | סטטוס: open/in_progress/done/cancelled |
| `assigned_to` | TEXT | אחראי |
| `due_date` | DATE | תאריך יעד |
| `completed_at` | TIMESTAMPTZ | תאריך השלמה |
| `notes` | TEXT | הערות |
| `created_at` | TIMESTAMPTZ | תאריך יצירה |
| `updated_at` | TIMESTAMPTZ | עדכון אחרון |

**ערכי issue_type:**
- `missing_invoice` — חשבונית חסרה
- `high_cpl` — CPL גבוה
- `low_conversion` — המרה נמוכה
- `budget_exceeded` — תקציב חרג
- `qa_error` — שגיאת QA
- `campaign_review` — קמפיין לבדיקה
- `data_missing` — נתון חסר
- `general` — כללי

**ערכי priority:**
- `critical` — קריטי
- `high` — גבוה
- `medium` — בינוני
- `low` — נמוך

---

### 7. `settings` — הגדרות מערכת

| שדה | סוג | תיאור |
|-----|-----|--------|
| `id` | UUID | מזהה ייחודי (PK) |
| `key` | TEXT | מפתח ייחודי |
| `value` | TEXT | ערך |
| `label` | TEXT | תווית בעברית |
| `category` | TEXT | קטגוריה (targets/general/integrations) |
| `updated_at` | TIMESTAMPTZ | עדכון אחרון |

**הגדרות ברירת מחדל:**

| key | value | תיאור |
|-----|-------|--------|
| `company_name` | EXEL נדל"ן | שם החברה |
| `currency` | ₪ | מטבע |
| `vat_rate` | 0.17 | שיעור מע"מ (17%) |
| `target_cpl` | 500 | יעד עלות לליד (₪) |
| `target_cost_per_meeting` | 2000 | יעד עלות לפגישה (₪) |
| `target_cost_per_closing` | 15000 | יעד עלות לסגירה (₪) |
| `target_roi` | 3 | יעד ROI (מכפיל) |
| `fiscal_year` | 2026 | שנת עבודה |
| `drive_root_folder_id` | — | מזהה תיקיית Drive שורש |
| `alert_email` | — | אימייל לקבלת התראות |

---

## KPIs — מדדי ביצוע מחושבים

המדדים הבאים **מחושבים בזמן אמת** מתוך נתוני הרשומות החודשיות (אינם נשמרים בבסיס הנתונים):

| KPI | נוסחה | יחידה |
|-----|--------|--------|
| **CPL** | `spend / leads` | ₪/ליד |
| **CPM** | `(spend / impressions) × 1000` | ₪/1000 חשיפות |
| **Cost per Meeting** | `spend / meetings` | ₪/פגישה |
| **Cost per Closing** | `spend / closings` | ₪/סגירה |
| **ROI** | `(revenue - spend) / spend` | מכפיל (×) |
| **ROAS** | `revenue / spend` | מכפיל (×) |
| **Gross Profit** | `revenue - spend` | ₪ |
| **Lead → Meeting Rate** | `meetings / leads × 100` | % |
| **Meeting → Closing Rate** | `closings / meetings × 100` | % |
| **Lead → Closing Rate** | `closings / leads × 100` | % |
| **Qualified Lead Rate** | `qualified_leads / leads × 100` | % |
| **CTR** | `clicks / impressions × 100` | % |

---

## מנוע המלצות ערוץ

המערכת מחשבת המלצה אוטומטית לכל ערוץ על בסיס ביצועיו:

| תנאי | המלצה |
|------|--------|
| ROI > 0 וסגירות > 0 | **להגדיל — ROI חיובי** |
| לידים = 0 | **לעצור — אפס לידים** |
| סגירות = 0 ולידים > 5 | **לבדוק קמפיין — אפס סגירות** |
| Lead→Meeting Rate < 20% | **לתקן משפך — המרה נמוכה** |
| Meeting→Closing Rate < 20% | **לבחון צוות מכירות** |
| ROI < 0 | **אזהרה — ROI שלילי** |
| ברירת מחדל | **להמשיך מעקב** |

---

## פורמט מפתח חודשי

המפתח `month_key` הוא מחרוזת בפורמט ISO: `YYYY-MM`

דוגמאות:
- `2026-01` — ינואר 2026
- `2026-12` — דצמבר 2026
- `2025-06` — יוני 2025

המפתח משמש כ-index עקבי בין כל הטבלאות לחיבור נתונים ממקורות שונים.

---

## מדיניות Row Level Security (RLS)

כל הטבלאות מוגנות ב-RLS:

- **authenticated_all**: כל משתמש מחובר יכול לקרוא, להוסיף, לעדכן, ולמחוק
- **authenticated_read**: קריאה בלבד למשתמשים מחוברים (לטבלאות reference)

משתמש לא מחובר לא יכול לגשת לאף נתון.

---

## ייבוא נתונים מ-Excel / Google Sheets

סדר שדות מומלץ לייבוא:

```
חודש | שנה | ערוץ | הוצאה | חשיפות | קליקים | לידים | לידים מוסמכים | פגישות | הצעות | סגירות | הכנסה | סטטוס חשבונית
```

- **חודש**: מספר (1–12) או שם עברי
- **ערוץ**: חייב להתאים לאחד מ-21 הערוצים הרשומים
- **ערכים כספיים**: ₪ — ניתן לכלול סימן מטבע, הוא יוסר אוטומטית
- **שדות חסרים**: יוזנו כ-0 או null בהתאם לסוג השדה
