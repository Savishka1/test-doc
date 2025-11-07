# Agile Benefit Tracker - Backend API

Backend server for the Zone24x7 Reimbursement System.

## Tech Stack

- **Node.js** + **Express** - Server framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **Nodemailer** - Email notifications

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### 3. Setup Database

Create a PostgreSQL database and run the schema:

```bash
psql -U postgres -d agile_benefit_tracker -f src/config/schema.sql
```

### 4. Run Development Server

```bash
npm run dev
```

Server will run on `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Claims (Employee)
- `POST /api/claims` - Submit new claim
- `GET /api/claims` - Get all user claims
- `GET /api/claims/:id` - Get specific claim
- `PUT /api/claims/:id` - Update claim
- `GET /api/claims/balance` - Get claim balance

### HR
- `GET /api/hr/claims/pending` - Get pending claims
- `PATCH /api/hr/claims/:id/approve` - Approve claim
- `PATCH /api/hr/claims/:id/reject` - Reject claim
- `PATCH /api/hr/claims/:id/request-update` - Request update
- `PATCH /api/hr/settings/quarterly-cap` - Update quarterly cap

### Accounts
- `GET /api/accounts/claims/approved` - Get approved claims
- `PATCH /api/accounts/claims/:id/pay` - Mark as paid
- `GET /api/accounts/export/:format` - Export payments

## Environment Variables

See `.env.example` for required configuration.

## Database Schema

Tables:
- `users` - User accounts
- `claims` - Reimbursement claims
- `audit_logs` - Action audit trail
- `settings` - System settings

## File Uploads

Uploaded files are stored in `./uploads` directory.
Allowed formats: PDF, JPG, JPEG, PNG
Max size: 10MB
