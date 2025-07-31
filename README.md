# HRMS Backend API - Tomer & Shalev

מערכת ניהול משאבי אנוש (HRMS) – צד שרת

מטרת הפרויקט לספק מערכת לניהול משרות, התחברות, וניהול בסיסי של מידע – באמצעות RESTful API. המערכת מבוססת על Node.js עם Express ו־MongoDB.

---

## 📌 תיאור כללי (Overview)

פרויקט זה מהווה את צד השרת של מערכת לניהול משאבי אנוש (HRMS) עבור תהליך קליטה והגשת מועמדות לעובדים. המערכת תומכת בהתחברות, הוספה ועריכה של משרות. המידע מאוחסן במסד נתונים MongoDB Atlas.

---

## 🚀 טכנולוגיות בשימוש

-  Node.js
-  Express.js
-  MongoDB + Mongoose
-  RESTful API Design
-  Postman (לתיעוד ובדיקת נקודות קצה)

---

## 📁 קישורים חשובים

-  🌐 [שרת פעיל ב־Render (לדוגמה)](https://hrms-tomer-shalev-be.onrender.com)
-  🧪 Postman Collection (JSON)
-  🔗 [Frontend Repository](https://github.com/tomer-aminov/HRMS-Tomer-Shalev-FE)

---

## 📌 RESTful API Documentation

### 👤 Users API

#### 🔑 POST `/api/users/login`

-  התחברות משתמש קיים
-  Body:

```json
{
   "email": "yossi@example.com",
   "password": "123456"
}
```

---

### 📄 Jobs API

#### 📥 POST `/api/jobs`

-  יצירת משרה חדשה

#### 📃 GET `/api/jobs`

-  שליפת כל המשרות

#### ✏️ PUT `/api/jobs/:id`

-  עריכת משרה קיימת לפי מזהה

#### 🗑️ DELETE `/api/jobs/:id`

-  מחיקת משרה לפי מזהה

---

## 🛠️ איך להריץ מקומית

1. לשכפל את הריפוזיטורי:

```bash
git clone https://github.com/tomer-aminov/HRMS-Tomer-Shalev-BE.git
```

2. להתקין תלויות:

```bash
npm install
```

3. להגדיר קובץ `.env` עם משתנה:

```env
MONGO_URI=your_mongodb_atlas_connection_string
```

4. להריץ את השרת:

```bash
npm start
```

---

## 📘 הערות

-  הנתיבים הוקמו לפי עקרונות REST
-  לכל נתיב ניתן למצוא תיעוד מפורט ב־Postman

---

🎓 Tomer & Shalev
