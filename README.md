# FixKaput 🛠️

[![codecov](https://codecov.io/gh/ikrammirza/fixkaput/branch/main/graph/badge.svg)](https://codecov.io/gh/ikrammirza/fixkaput)
[![CI](https://github.com/ikrammirza/fixkaput/actions/workflows/ci.yml/badge.svg)](https://github.com/ikrammirza/fixkaput/actions/workflows/ci.yml)
![E2E Tested with Cypress](https://img.shields.io/badge/E2E_Tested-Cypress-9cf?logo=cypress&logoColor=white)
![Built with](https://img.shields.io/badge/Built_with-Next.js-blue)
![Last Commit](https://img.shields.io/github/last-commit/ikrammirza/fixkaput)

---

## 🧩 Overview

**FixKaput** is a full-stack service-oriented platform that allows users to book home services like:

- ✅ AC servicing
- ✅ Plumbing
- ✅ Electrical repair
- ✅ Carpentry
- ✅ CCTV installation

It's designed with performance, scalability, and security in mind — using Redis for session management and real-time socket communication.

---

## 🚀 Live Demo

🔗 [Visit the Live Site](https://fixkaput.vercel.app)

---

## 🛠️ Tech Stack

**Frontend**:
- React (Next.js)
- Tailwind CSS
- Client-side validation

**Backend**:
- Node.js + Next.js API routes
- MongoDB with Mongoose
- Redis (OTP/session storage)
- JWT Auth via HttpOnly cookies
- WebSockets with `socket.io`

**3rd Party Integrations**:
- 📩 Twilio (OTP via SMS)
- 🧪 Jest + Supertest (API Testing)
- 🔬 Cypress (End-to-End Testing)

---

## ✅ Features

- 📱 OTP-based Login System with Redis-backed sessions
- 🛒 Cart + Checkout flow for booking services
- 🛠 Technician & Admin Dashboards
- 💬 Real-time communication using WebSockets
- 🧪 100% Jest Test Coverage
- 🔐 Secure with HttpOnly cookies and rate limits
- 🌍 Fully responsive UI

---

## 🧪 Testing

### ✅ API Tests

- Jest + Supertest test core APIs like:
  - `/api/send-otp`
  - `/api/verify-otp`
  - `/api/bookService`

### ✅ E2E Tests

- Cypress tests simulate real user flows like:
  - Validating OTP flows
  - Booking services
  - Checkout logic

```bash
# Run E2E tests (app must be running on http://localhost:3000)
npm run test:e2e

# Or against staging: CYPRESS_BASE_URL=https://fixkaput.vercel.app npm run test:e2e
```

---

## 🐳 Docker

```bash
# Production (uses MONGO_URI, REDIS_URL from .env)
docker-compose up -d

# Local dev with MongoDB + Redis
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

---

## 🖥️ Run Locally

```bash
git clone https://github.com/ikrammirza/fixkaput.git
cd fixkaput

# Install dependencies
npm install

# Create .env.local and add:
# MONGODB_URI (or MONGO_URI), REDIS_URL, TWILIO_SID, JWT_SECRET, etc.
# Optional: TECHNICIAN_NOTIFY_PHONE (SMS notification target)
# Optional: SOCKET_CORS_ORIGINS (comma-separated, e.g. https://fixkaput.vercel.app,http://localhost:3000)

# Run dev server
npm run dev
