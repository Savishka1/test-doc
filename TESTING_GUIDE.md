# Testing Guide - Agile Benefit Tracker

## Quick Start Testing (Mock Data Mode)

The application is currently running in **Mock Data Mode** - no backend required!

**Access:** http://localhost:5173

---

## Test Scenarios

### 1. Test as Employee

**Login:**
- Username: **john.doe**
- Password: **password123**
- Click: **Login**

**What to Test:**
✅ **View Dashboard**
- See balance cards (Annual: LKR 52,000 remaining, Quarter: LKR 5,000 remaining)
- View existing claims with different statuses
- Use status filters (All, Submitted, Approved, Rejected, Paid)

✅ **Submit New Claim**
- Click "New Claim" button
- Fill in form:
  - Claim Type: OPD or Wellness
  - Date: Any date
  - Amount: e.g., 5000
  - Description: e.g., "Doctor consultation"
  - Bill: Click "Choose File" (mock upload)
- Click "Submit Claim"
- See success notification
- Verify claim appears in dashboard as "Submitted"

✅ **View Claim Details**
- Click "View Details" on any claim
- See all claim information
- Check status badge
- View HR comments (if rejected)

✅ **Edit Rejected Claim**
- Find a rejected claim (CLM004 in mock data)
- Click "View Details"
- Click "Edit Claim" button
- Modify details
- Resubmit

✅ **Logout**
- Click "Logout" in navigation bar

---

### 2. Test as HR

**Login:**
- Username: **sarah.hr**
- Password: **password123**
- Click: **Login**

**What to Test:**
✅ **View Pending Claims**
- See list of submitted claims
- View claim details in cards

✅ **Approve Claim**
- Click "Approve" button on a pending claim
- See success notification
- Claim disappears from pending list
- Status changes to "Approved"

✅ **Reject Claim**
- Click "Reject" button on a pending claim
- Modal opens for comment
- Enter rejection reason: e.g., "Please provide itemized bill"
- Click "Submit"
- See success notification
- Claim disappears from pending list

✅ **Request Update**
- Click "Request Update" button
- Add comment: e.g., "Please clarify the treatment date"
- Submit
- Comment is saved

✅ **Logout**

---

### 3. Test as Accounts

**Login:**
- Username: **mike.accounts**
- Password: **password123**
- Click: **Login**

### 4. Test as SuperAdmin

**Login:**
- Username: **admin**
- Password: **admin**
- Click: **Login**

**What to Test:**
✅ **User Management**
- View all users in the system
- Add new users (Employee, HR, Accounts)
- Edit existing users
- Deactivate users (cannot deactivate SuperAdmin)
- All user CRUD operations

✅ **Change Password**
- Access password change page
- Update SuperAdmin password

**What to Test:**
✅ **View Approved Claims**
- See list of HR-approved claims
- View claim details

✅ **Mark as Paid**
- Click "Mark as Paid" button
- See success notification
- Claim disappears from approved list
- Status changes to "Paid"

✅ **Export Payments**
- Click "Export CSV" button
- Mock download triggers
- Try "Export Excel" and "Export PDF"

✅ **Logout**

---

## Complete Workflow Test

**Test the full Employee → HR → Accounts flow:**

1. **Login as Employee**
   - Submit a new claim
   - Note the claim details
   - Logout

2. **Login as HR**
   - Find the newly submitted claim
   - Approve it
   - Logout

3. **Login as Accounts**
   - Find the approved claim
   - Mark it as paid
   - Logout

4. **Login as Employee again**
   - View the claim
   - Verify status is "Paid"
   - Check balance has been updated

---

## Features to Test

### Navigation
- ✅ Role-based navigation links
- ✅ Active page highlighting
- ✅ User name and role display
- ✅ Logout functionality

### Notifications
- ✅ Success notifications (green)
- ✅ Error notifications (red)
- ✅ Auto-dismiss after 5 seconds
- ✅ Manual close button

### Filters & Search
- ✅ Status filters on Employee Dashboard
- ✅ Filter persistence during session
- ✅ Claim count updates

### Responsive Design
- ✅ Desktop view (full width)
- ✅ Tablet view (medium width)
- ✅ Mobile view (narrow width)
- ✅ Navigation menu adapts
- ✅ Cards stack properly

### Forms
- ✅ Input validation
- ✅ Required field indicators
- ✅ Error messages
- ✅ File upload preview
- ✅ Form submission
- ✅ Loading states

### UI/UX
- ✅ Zone24x7 branding (red #ED1C24)
- ✅ Consistent styling
- ✅ Hover effects
- ✅ Button states
- ✅ Card shadows
- ✅ Smooth transitions

---

## Mock Data Reference

### Users (Username / Password)
1. **Super Admin** - SuperAdmin (admin / admin)
2. **John Doe** - Employee (john.doe / password123)
3. **Sarah HR** - HR (sarah.hr / password123)
4. **Mike Accounts** - Accounts (mike.accounts / password123)

### Sample Claims
- **CLM001** - OPD, Paid, LKR 5,000
- **CLM002** - Wellness, Approved, LKR 15,000
- **CLM003** - OPD, Submitted, LKR 8,000
- **CLM004** - Wellness, Rejected, LKR 12,000
- **CLM005** - OPD, Submitted, LKR 3,500

### Balance
- **Annual Cap:** LKR 80,000
- **Annual Used:** LKR 28,000
- **Annual Remaining:** LKR 52,000
- **Quarter Cap:** LKR 20,000
- **Quarter Used:** LKR 15,000
- **Quarter Remaining:** LKR 5,000

---

## Known Behaviors (Mock Mode)

✅ **Expected:**
- File uploads are simulated (no actual files stored)
- Claims persist only during browser session
- Email notifications are not sent (console log only)
- All actions have simulated delays (500ms - 1000ms)
- Data resets on page refresh

✅ **Mock Data Updates:**
- New claims are added to the list
- Status changes are reflected immediately
- Balance calculations are static (not recalculated)
- Comments are saved with claims

---

## Troubleshooting

### Application Not Loading
- Check dev server is running: http://localhost:5173
- Check browser console for errors
- Try hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Login Not Working
- Ensure you selected a user from the radio buttons
- Check browser console for errors
- Try clearing localStorage: `localStorage.clear()`

### Claims Not Appearing
- Check you're logged in as the correct role
- Verify filters are not hiding claims
- Check browser console for errors

### Notifications Not Showing
- Check top-right corner of screen
- Notifications auto-dismiss after 5 seconds
- Try triggering another action

---

## Next Steps After Testing

Once you've tested all features:

1. **Report any bugs or issues found**
2. **Suggest UI/UX improvements**
3. **Test on different browsers** (Chrome, Firefox, Edge)
4. **Test on mobile devices**
5. **Ready to connect to real backend?** Follow INTEGRATION_GUIDE.md

---

## Feedback

After testing, consider:
- Is the workflow intuitive?
- Are error messages clear?
- Is the UI visually appealing?
- Are there any missing features?
- Does it meet the business requirements?

**Happy Testing! 🚀**
