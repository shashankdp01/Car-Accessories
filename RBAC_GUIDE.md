# Role-Based Access Control (RBAC) Implementation

## Overview
The system now implements role-based access control with two user roles:
- **User**: Regular customer who can browse, add items to cart, and checkout
- **Admin**: Shop owner who can perform all user functions PLUS manage products via the admin panel

## User Roles

### Regular User
- Browse products
- Search and filter products
- Add items to cart
- Update cart quantities
- Remove items from cart
- Place orders
- View order history
- **Cannot**: Access admin panel

### Admin User
- All user privileges PLUS:
- Access admin dashboard at `/admin`
- Create new products
- Edit existing products
- Delete products
- View all products in admin table
- Make real-time updates to product database

## Setup Instructions

### 1. Set Admin Key
The admin key is stored in the `.env` file. The current key is:
```
ADMIN_KEY=AutoGearPro_Admin_Secret_2024
```

**To change this:**
1. Open `server/.env`
2. Replace the `ADMIN_KEY` value with your desired secret key
3. Keep this key secure - don't share it publicly

### 2. Create an Admin Account
**During Sign Up:**
1. Go to the Sign Up page
2. Fill in Name, Email, Password, and Phone
3. Check the checkbox "Register as Shop Administrator"
4. Enter the admin key in the revealed field
5. Click "Create Account"

If the admin key is correct, the account will be created with admin role.
If the key is wrong, the account will be created as a regular user.

**Example:**
- Name: John Doe
- Email: admin@autogearpro.com
- Password: SecurePassword123
- Phone: +91 9876543210
- Admin Key: AutoGearPro_Admin_Secret_2024

### 3. Access Admin Panel
Once logged in as an admin:
1. An "Admin" button will appear in the navbar next to the Cart button
2. Click the "Admin" button to access the admin dashboard
3. You'll see the product management interface

## Database Schema Updates

### User Model Changes
The User model now includes a `role` field:

```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  phone: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  cart: [...],
  orders: [...]
}
```

### Default Role
- All new users are created with `role: 'user'`
- Only users who provide the correct admin key during signup get `role: 'admin'`

## Frontend Changes

### Login Component
The Sign Up form now includes:
- **"Register as Shop Administrator"** checkbox
- **Admin Key field** (appears when checkbox is checked)

### Navbar Component
- Admin button only appears for users with `role === 'admin'`
- Regular users won't see the Admin button

### Admin Component
- Checks if user has `role === 'admin'`
- If not admin, displays "Access Denied" message
- Only admins can access the full admin dashboard

## API Changes

### Authentication Endpoints

#### Register (with optional admin)
```
POST /api/auth/register
Body: {
  name: string,
  email: string,
  password: string,
  phone: string (optional),
  adminKey: string (optional - required to register as admin)
}

Response: {
  message: string,
  user: {
    id: string,
    name: string,
    email: string,
    phone: string,
    role: 'user' | 'admin',
    cart: [...],
    orders: [...]
  }
}
```

#### Login (same as before)
```
POST /api/auth/login
Body: {
  email: string,
  password: string
}

Response: {
  message: string,
  user: {
    id: string,
    name: string,
    email: string,
    phone: string,
    role: 'user' | 'admin',
    cart: [...],
    orders: [...]
  }
}
```

### Product Management Endpoints
⚠️ **Note**: Currently, these endpoints are accessible to all authenticated users. For production, add middleware to verify admin role before allowing POST, PATCH, DELETE operations.

To implement endpoint protection (future enhancement):
```javascript
// In server/src/routes/productRoutes.js
const { checkAdminRole } = require('../middleware/auth');

router.post('/', checkAdminRole, createProduct);  // Admin only
router.patch('/:productId', checkAdminRole, updateProduct);  // Admin only
router.delete('/:productId', checkAdminRole, deleteProduct);  // Admin only
router.get('/', getAllProducts);  // Public
router.get('/:productId', getProductById);  // Public
```

## Security Considerations

### Current Implementation
- Admin key is validated during registration
- Role is stored in the database
- Frontend checks role before showing admin UI
- Admin panel shows access denied if user is not admin

### Production Recommendations
1. **Use JWT Tokens**: Implement JWT-based authentication with role claims
2. **Server-side Authorization**: Protect admin endpoints with middleware that verifies JWT tokens
3. **Environment Variables**: Keep admin key in environment variables, never hardcode
4. **Audit Logging**: Log all admin operations for security
5. **HTTPS Only**: Enforce HTTPS in production
6. **Rate Limiting**: Add rate limiting on auth endpoints

### Never Do This
- ❌ Don't expose admin key in frontend code
- ❌ Don't rely only on frontend role checks
- ❌ Don't send passwords in responses
- ❌ Don't use weak admin keys

## Testing

### Test as Regular User
1. Sign up without checking admin checkbox
2. Login
3. Verify no "Admin" button appears
4. Try accessing `/admin` directly → See access denied page

### Test as Admin
1. Sign up with admin checkbox and correct admin key
2. Login
3. Verify "Admin" button appears in navbar
4. Click Admin button → Access dashboard
5. Test CRUD operations

### Test Invalid Admin Key
1. Sign up with admin checkbox but wrong key
2. Account should be created with `role: 'user'`
3. Verify no Admin button appears

## Future Enhancements
- [ ] JWT token-based authentication
- [ ] Server-side endpoint protection middleware
- [ ] Multiple admin roles (super-admin, manager, viewer)
- [ ] Admin activity audit logging
- [ ] Two-factor authentication for admin accounts
- [ ] Session management and token refresh
- [ ] Admin password reset flow
- [ ] User management interface for admins
