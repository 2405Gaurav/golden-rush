# SSMS - Sweet Shop Management System

## Sweet Shop Management System (TDD Kata)

This repo contains:
- **Frontend**: Next.js (App Router) neobrutalist UI
- **Backend**: Java Spring Boot + JWT + Postgres (Neon)

### Security note (important)
If you pasted a Neon password into chat, **rotate it in Neon** and use a new password locally.

## Backend (Spring Boot)

### Requirements
- Java 21+ (you have Java installed)

### Configure environment variables
See `backend/ENV.example`. In PowerShell:

```powershell
$env:DATABASE_JDBC_URL="jdbc:postgresql://<YOUR-NEON-HOST>/neondb?sslmode=require&channelBinding=require"
$env:DATABASE_USERNAME="neondb_owner"
$env:DATABASE_PASSWORD="<YOUR_PASSWORD>"
$env:JWT_SECRET_BASE64="<BASE64_32_BYTES_OR_MORE>"
$env:CORS_ALLOWED_ORIGINS="http://localhost:3000"
```

### Run backend

```powershell
cd backend
.\mvnw.cmd test
.\mvnw.cmd spring-boot:run
```

Backend runs on `http://localhost:8080`.

Admin user is auto-created on first startup (configurable in env):
- email: `admin@sweetshop.local`
- password: `admin123!`

## Frontend (Next.js)

### Configure
See `ENV.example`. Create a local `.env.local` with:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### Run
Use your preferred package manager (this repo includes `pnpm-lock.yaml`).

```powershell
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Deployment

### Deploy to Railway (Recommended)

Deploy both frontend and backend to Railway using CLI:

**Quick Deploy:**
```powershell
# Windows
.\scripts\deploy-all-railway.ps1

# Linux/Mac
./scripts/deploy-all-railway.sh
```

**Or deploy separately:**
```powershell
# Backend
.\scripts\deploy-backend-railway.ps1

# Frontend
.\scripts\deploy-frontend-railway.ps1
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## API Checklist (Kata)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/sweets` (protected)
- `GET /api/sweets/search` (protected)
- `POST /api/sweets` (admin)
- `PUT /api/sweets/:id` (admin)
- `DELETE /api/sweets/:id` (admin)
- `POST /api/sweets/:id/purchase` (protected)
- `POST /api/sweets/:id/restock` (admin)
