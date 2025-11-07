# Frontend-Backend Integration Guide

## Overview

The Agile Benefit Tracker application supports both **mock data mode** (for frontend testing) and **real API mode** (for production).

---

## Configuration

### Toggle Between Mock and Real API

Edit `src/config/config.ts`:

```typescript
export const config = {
  // Set to false to use real backend API
  USE_MOCK_DATA: false,  // Change this!
  
  API_BASE_URL: 'http://localhost:3000/api',
};
```

- **`USE_MOCK_DATA: true`** - Uses mock data (no backend required)
- **`USE_MOCK_DATA: false`** - Uses real backend API

---

## Backend Setup (Required for Real API Mode)

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb agile_benefit_tracker

# Run schema
cd server
psql -U postgres -d agile_benefit_tracker -f src/config/schema.sql
```

### 2. Environment Configuration

```bash
cd server
cp .env.example .env
```

Edit `.env` with your settings:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agile_benefit_tracker
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

### 3. Start Backend Server

```bash
cd server
npm install
npm run dev
```

Server runs on **http://localhost:3000**

---

## Frontend Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API URL (Optional)

Create `.env` in the root:
```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Start Frontend

```bash
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## Testing the Integration

### Step 1: Create Test Users

With backend running, register users via API or insert directly into database:

```sql
-- Insert test users (passwords are hashed with bcrypt)
INSERT INTO users (name, email, password, role, employee_id) VALUES
('John Employee', 'john@zone24x7.com', '$2a$10$...', 'Employee', 'EMP001'),
('Sarah HR', 'sarah@zone24x7.com', '$2a$10$...', 'HR', 'HR001'),
('Mike Accounts', 'mike@zone24x7.com', '$2a$10$...', 'Accounts', 'ACC001');
```

Or use the registration endpoint:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Employee",
    "email": "john@zone24x7.com",
    "password": "password123",
    "role": "Employee",
    "employeeId": "EMP001"
  }'
```

### Step 2: Test Authentication

1. Open http://localhost:5173
2. Login with created credentials
3. Verify JWT token is stored in localStorage
4. Check that user data is displayed correctly

### Step 3: Test Complete Workflow

**As Employee:**
1. Submit a new claim with file upload
2. View claim in dashboard
3. Check balance updates

**As HR:**
1. View pending claims
2. Approve or reject claims
3. Add comments

**As Accounts:**
1. View approved claims
2. Mark claims as paid
3. Export payment reports

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Claims (Employee)
- `POST /api/claims` - Submit claim (with file upload)
- `GET /api/claims` - Get all user claims
- `GET /api/claims/:id` - Get specific claim
- `PUT /api/claims/:id` - Update claim
- `GET /api/claims/balance` - Get balance

### HR
- `GET /api/hr/claims/pending` - Get pending claims
- `PATCH /api/hr/claims/:id/approve` - Approve claim
- `PATCH /api/hr/claims/:id/reject` - Reject claim with comment
- `PATCH /api/hr/settings/quarterly-cap` - Update quarterly cap

### Accounts
- `GET /api/accounts/claims/approved` - Get approved claims
- `PATCH /api/accounts/claims/:id/pay` - Mark as paid
- `GET /api/accounts/export/:format` - Export payments

---

## Troubleshooting

### Backend Connection Issues

**Problem:** Frontend can't connect to backend

**Solution:**
1. Check backend is running: `curl http://localhost:3000/health`
2. Verify CORS is enabled in backend
3. Check `API_BASE_URL` in `src/config/config.ts`

### Authentication Errors

**Problem:** "Invalid or expired token"

**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Login again
3. Check JWT_SECRET matches in backend `.env`

### File Upload Errors

**Problem:** "File upload failed"

**Solution:**
1. Check `uploads/` directory exists in backend
2. Verify file size < 10MB
3. Check file type is PDF/JPG/PNG
4. Ensure Multer middleware is configured

### Database Connection Errors

**Problem:** "Database connection failed"

**Solution:**
1. Verify PostgreSQL is running
2. Check database credentials in `.env`
3. Ensure database exists: `psql -l | grep agile_benefit_tracker`
4. Run schema if tables missing

---

## Development vs Production

### Development Mode
- `USE_MOCK_DATA: true` - Test frontend without backend
- Hot reload enabled
- Detailed error messages

### Production Mode
- `USE_MOCK_DATA: false` - Use real API
- Build optimized bundles
- Error logging to server
- HTTPS required
- Environment variables for secrets

---

## Next Steps

1. ✅ Test all user roles (Employee, HR, Accounts)
2. ✅ Verify file uploads work
3. ✅ Test email notifications
4. ✅ Check audit logs are created
5. ✅ Test complete workflow end-to-end
6. 🔄 Add unit tests (QA phase)
7. 🔄 Add integration tests (QA phase)
8. 🔄 Deploy to production

---

## Support

For issues or questions:
- Check console logs (browser & server)
- Review API responses in Network tab
- Check database logs
- Verify environment variables are set correctly
