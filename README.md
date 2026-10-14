# Mini CRM — Sales Leads

Single-user CRM for managing sales leads (no authentication).

## Stack

- **Frontend:** React, Vite, Tailwind CSS, Material UI, Axios, React Router
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB

## Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas connection string)

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env if needed (MONGODB_URI, PORT)
npm run dev
```

API: `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173` (proxies `/api` to the backend)

## Features

- Responsive leads table with pagination
- Create, read, update, delete leads
- Search by name, email, company
- Filter by status and priority
- Sort by name, created date, status, priority
- Lead detail page
- Kanban pipeline by status
- Loading, empty, error, and success states
- Client and server validation

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/leads` | List (query: `page`, `limit`, `search`, `status`, `priority`, `sortBy`, `sortOrder`) |
| GET | `/api/leads/all` | All leads (Kanban) |
| GET | `/api/leads/:id` | Single lead |
| POST | `/api/leads` | Create |
| PUT | `/api/leads/:id` | Update |
| PATCH | `/api/leads/:id/status` | Update status only |
| DELETE | `/api/leads/:id` | Delete |
