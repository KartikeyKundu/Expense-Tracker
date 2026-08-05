# 📊 Expense Tracker

A full-stack **Expense Tracker** built with **Next.js**, **NextAuth (Google & GitHub OAuth)**, **MongoDB**, and **React Hook Form**.  
Users can securely sign in, manage expenses, apply filters, and track total spending.

---

## ⭐ Features

- 🔐 Authentication with **NextAuth** (Google & GitHub)
- ➕ Add expenses
- ✏️ Edit expenses
- ❌ Delete expenses
- 📅 Filter by category & date range
- 💰 Total spending calculation
- 🛡️ Protected API routes
- 🧠 Clean backend architecture (controllers, middleware)
- 🧪 Easy API testing via cookies

---

## 🗂️ Tech Stack

| Layer | Tech |
|-----|------|
| Frontend | Next.js (App Router), React |
| Styling | Tailwind CSS |
| Auth | NextAuth |
| Database | MongoDB + Mongoose |
| Forms | React Hook Form |
| Language | TypeScript |

---

## 🚀 Live Demo

🔗 _https://expense-tracker-ten-tau-54.vercel.app/_

---

## 🧱 Getting Started (Local Setup)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/KartikeyKundu/Expense-Tracker.git
cd Expense-Tracker
```

---

### 2️⃣ Install dependencies

```bash
npm install
```

or

```bash
yarn
```

---

### 3️⃣ Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXTAUTH_SECRET=your_nextauth_secret
CONN_STRING=your_mongodb_connection_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

Generate `NEXTAUTH_SECRET` using:

```bash
openssl rand -base64 32
```

---

### 4️⃣ Run the app

```bash
npm run dev
```

Open:
```
http://localhost:3000
```

---

## 🔐 Authentication Setup

This project uses **OAuth authentication** with:

- Google
- GitHub

Set redirect URLs in provider dashboards:

```
http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/callback/github
```

(Replace `localhost` with your deployed domain in production.)

---

## 🔗 API Endpoints (Protected)

| Method | Route | Description |
|------|-------|-------------|
| GET | `/api/expenses` | Fetch expenses (filters supported) |
| POST | `/api/expenses` | Create new expense |
| PUT | `/api/expenses/[id]` | Update expense |
| DELETE | `/api/expenses/[id]` | Delete expense |

All routes are protected via **NextAuth session**.

---

## 🧪 API Testing (Postman / Thunder Client)

1. Login via browser
2. Copy cookie:
   ```
   next-auth.session-token
   ```
3. Attach cookie in request header:

```http
Cookie: next-auth.session-token=YOUR_TOKEN
```

---

## 🗂️ Project Structure

```txt
├── app/
|   ├── components/          # UI components  
│   ├── api/
│   │   ├── auth/            # NextAuth routes
│   │   └── expenses/        # Expense APIs
│   ├── login/               # Login page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Dashboard
├── controllers/             # Business logic
├── lib/                     # Auth & DB helpers
├── models/                  # Mongoose schemas
├── types/                   # TypeScript types
└── proxy.ts            # Auth redirects
```

---

## 🧠 Core Logic

- Each expense belongs to a user (`userId`)
- Ownership enforced in backend
- Backend filtering for scalability
- Frontend computes derived data (total spending)

---

## 💡 Future Improvements

- Pagination
- Expense analytics (charts)
- Monthly summaries
- Export expenses (CSV / PDF)
- Recurring expenses

---

Made with ❤️ using Next.js
