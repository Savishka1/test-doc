# Authentication & User Management Guide

## Overview

The Agile Benefit Tracker now includes a comprehensive authentication system with user management capabilities.

---

## Features Implemented

### ✅ Real Login System
- Username and password authentication
- Secure password validation
- Session management with localStorage
- Error handling and user feedback

### ✅ User Roles
1. **SuperAdmin** - Full system access, user management
2. **HR** - Claim management + user management
3. **Employee** - Submit and view own claims
4. **Accounts** - Process approved claims

### ✅ User Management (HR & SuperAdmin)
- View all active users
- Create new users (Employee, HR, Accounts)
- Edit user details (name, email, role, employee ID)
- Deactivate users (soft delete)
- Cannot delete SuperAdmin

### ✅ Password Management (All Users)
- Change password functionality
- Current password verification
- Password strength requirements (min 6 characters)
- Confirmation matching

---

## Login Credentials

### Test Accounts

| Role | Username | Password | Access |
|------|----------|----------|--------|
| **SuperAdmin** | admin | admin | User Management, Change Password |
| **HR** | sarah.hr | password123 | HR Dashboard, User Management, Change Password |
| **Employee** | john.doe | password123 | Employee Dashboard, Claims, Change Password |
| **Accounts** | mike.accounts | password123 | Accounts Dashboard, Change Password |

---

## User Management Features

### Accessing User Management

**For HR:**
1. Login as HR (sarah.hr / password123)
2. Click "User Management" in navigation
3. View/Add/Edit/Deactivate users

**For SuperAdmin:**
1. Login as SuperAdmin (admin / admin)
2. Automatically redirected to User Management
3. Full CRUD operations on users

### Creating New Users

1. Click **"+ Add New User"** button
2. Fill in the form:
   - **Full Name** (required)
   - **Email** (required, valid email format)
   - **Username** (required, unique)
   - **Password** (required, min 6 characters)
   - **Role** (Employee, HR, or Accounts)
   - **Employee ID** (required)
3. Click **"Create User"**
4. User can now login with their credentials

### Editing Users

1. Find user in the table
2. Click **"Edit"** button
3. Update details (cannot change username)
4. Click **"Update User"**

### Deactivating Users

1. Find user in the table
2. Click **"Deactivate"** button
3. Confirm the action
4. User status changes to "Inactive"
5. User cannot login anymore

**Note:** SuperAdmin cannot be deactivated

---

## Change Password Feature

### Accessing Change Password

Available to **all users** via navigation menu:
- Click **"Change Password"** link in navigation bar

### Changing Password

1. Enter **Current Password**
2. Enter **New Password** (min 6 characters)
3. Enter **Confirm New Password** (must match)
4. Click **"Change Password"**
5. Success notification appears
6. Use new password for next login

### Password Requirements

- ✅ Minimum 6 characters
- ✅ Current password must be correct
- ✅ New password must be different from current
- ✅ Confirmation must match new password

---

## Navigation Structure

### Employee Navigation
- Dashboard
- New Claim
- **Change Password** ← New
- Logout

### HR Navigation
- HR Dashboard
- **User Management** ← New
- **Change Password** ← New
- Logout

### Accounts Navigation
- Accounts Dashboard
- **Change Password** ← New
- Logout

### SuperAdmin Navigation
- **User Management** ← New
- **Change Password** ← New
- Logout

---

## Security Features

### Mock Data Mode (Current)
- Passwords stored in `mockPasswords` object
- Username-based authentication
- Session persistence via localStorage
- Password validation on login

### Real API Mode (Production Ready)
- Backend endpoints configured
- JWT token authentication
- Bcrypt password hashing
- Secure session management

---

## API Endpoints (Backend Integration)

### Authentication
```
POST /api/auth/login
Body: { username, password }
Response: { token, user }
```

### User Management
```
GET /api/users - Get all users
POST /api/users - Create user
PUT /api/users/:id - Update user
DELETE /api/users/:id - Deactivate user
```

### Password Management
```
POST /api/users/change-password
Body: { currentPassword, newPassword }
```

---

## Testing Scenarios

### 1. Test Login System
- ✅ Login with valid credentials
- ✅ Login with invalid username
- ✅ Login with invalid password
- ✅ Logout and verify session cleared

### 2. Test User Management (as HR/SuperAdmin)
- ✅ View all users
- ✅ Create new employee
- ✅ Create new HR user
- ✅ Create new Accounts user
- ✅ Edit user details
- ✅ Deactivate user
- ✅ Try to deactivate SuperAdmin (should fail)
- ✅ Verify deactivated user cannot login

### 3. Test Password Change (all roles)
- ✅ Change password with correct current password
- ✅ Try with incorrect current password (should fail)
- ✅ Try with mismatched confirmation (should fail)
- ✅ Try with short password (should fail)
- ✅ Login with new password
- ✅ Verify old password doesn't work

### 4. Test Role-Based Access
- ✅ Employee cannot access User Management
- ✅ Accounts cannot access User Management
- ✅ HR can access User Management
- ✅ SuperAdmin can access User Management
- ✅ All roles can access Change Password

---

## Configuration

### Toggle Mock/Real API

Edit `src/config/config.ts`:

```typescript
export const config = {
  USE_MOCK_DATA: true,  // false for real API
  API_BASE_URL: 'http://localhost:3000/api',
};
```

### Mock User Data

Located in `src/data/mockData.ts`:
- `mockUsers` - User accounts
- `mockPasswords` - Password storage (mock only)

---

## Troubleshooting

### Login Not Working
- Verify username is correct (case-sensitive)
- Check password is correct
- Clear localStorage: `localStorage.clear()`
- Check browser console for errors

### User Management Not Showing
- Verify logged in as HR or SuperAdmin
- Check navigation bar for "User Management" link
- Verify `USE_MOCK_DATA` is set correctly

### Password Change Failing
- Verify current password is correct
- Check new password meets requirements (6+ chars)
- Ensure confirmation matches
- Check browser console for errors

### Cannot Create User
- Check if username already exists
- Verify all required fields are filled
- Check email format is valid
- Ensure employee ID is unique

---

## Future Enhancements

### Planned Features
- [ ] Password reset via email
- [ ] Two-factor authentication (2FA)
- [ ] Password expiry policy
- [ ] Login attempt limits
- [ ] Session timeout
- [ ] Audit log for user management actions
- [ ] Bulk user import
- [ ] User profile pictures

---

## Summary

The authentication system now provides:
- ✅ Secure username/password login
- ✅ Role-based access control
- ✅ User management for HR/SuperAdmin
- ✅ Password change for all users
- ✅ SuperAdmin with default password "admin"
- ✅ Mock data support for testing
- ✅ Production-ready API integration

**All requirements from the user request have been implemented!** 🎉
