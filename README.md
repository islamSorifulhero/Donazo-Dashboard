# Donazo Dashboard

## Live Link: https://new-folder-flax-six.vercel.app


A React-based project management dashboard built for the Frontend Intern assignment.

## Features

- ✅ **Login Page** — Email/password authentication via REST API with token persistence
- ✅ **Private Route** — Dashboard only accessible after login
- ✅ **Dashboard Page** — Matches the Donazo design with:
  - Project stats (Total, Ended, Running, Pending)
  - Interactive bar chart (Project Analytics)
  - Reminders section
  - Team Collaboration list
  - Project Progress radial chart
  - Live Time Tracker
- ✅ **REST API Integration** — All data fetched from `https://task-api-eight-flax.vercel.app`
- ✅ **Persistent Auth** — Token stored in localStorage
- ✅ **Responsive Design** — Works on mobile, tablet, and desktop
- ✅ **Animations** — Smooth fade-in transitions on load

## Tech Stack

- **React 18** + **Vite**
- **React Router v6** — for navigation and private routes
- **Recharts** — for bar chart and radial progress chart
- **Lucide React** — for icons
- **Plain CSS** — for all styles (no external UI library)

## Getting Started

```bash
npm install
npm run dev
```

## Login Credentials

```
Email:    user1@example.com
Password: password123
```
(Pre-filled on the login page)

## API Endpoints Used

- `POST /api/login` — Authentication
- `GET /api/overview` — Dashboard stats
- `GET /api/analytics` — Chart data
- `GET /api/users` — Team members
- `GET /api/products` — Project list

## Deployment

```bash
npm run build
```
Then deploy the `dist/` folder to Vercel, Netlify, or any static host.
# Donazo-Dashboard
