# Pastebin Lite

<<<<<<< HEAD
Pastebin Lite is a small Pastebin-like web application that allows users to create, share, and view text pastes using a unique URL. Pastes can optionally expire based on time (TTL) or number of views.

## Features
- Create a paste with arbitrary text
- Generate a shareable URL
- View pastes via API or HTML page
- Optional expiration using TTL and/or max view count
- Deterministic expiry support for automated testing

## Tech Stack
- Next.js (App Router)
- Node.js
- PostgreSQL (Neon)
- Prisma ORM
- Deployed on Vercel
<<<<<<< HEAD

## Persistence Layer
The application uses **PostgreSQL (Neon)** as the persistence layer.  
Prisma ORM is used to manage database access.  
This ensures data persists across requests in a serverless environment.

## Running the App Locally

### 1. Clone the repository
```bash
git clone https://github.com/meghareddy16/Pastebin-Lite
cd Pastebin-Lite
```

### 2. Install dependencies
```bash
npm install
```

### 3.Set environment variables
```bash
Create a .env file and add:
DATABASE_URL=your_neon_postgres_url
```

### 4. Push database schema
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the development server
```bash
npm run dev
```


Open http://localhost:3000 in your browser.

### API Endpoints

GET /api/healthz – Health check

POST /api/pastes – Create a paste

GET /api/pastes/:id – Fetch a paste (JSON)

GET /p/:id – View a paste (HTML)

### Design Decisions

Supports deterministic expiry using TEST_MODE=1 and the x-test-now-ms request header.

View counts are incremented atomically to avoid negative remaining views.

No in-memory or global mutable state is used, making the app serverless-safe.

Paste content is rendered safely without executing scripts.

