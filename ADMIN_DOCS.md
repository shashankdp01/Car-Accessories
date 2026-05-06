# Admin Panel Documentation

## Overview
The Admin Panel allows authenticated users to manage products in the AutoGearPro store. Admins can Create, Read, Update, and Delete (CRUD) products stored in MongoDB.

## Features

### 1. **View All Products**
   - Displays a table of all products in the database
   - Shows: ID, Name, Category, Price, Rating, and Badge
   - Real-time updates after any CRUD operation

### 2. **Add New Product**
   - Click "Add New Product" button to open the form
   - Required fields:
     - **Product ID**: Unique numeric identifier
     - **Product Name**: Name of the product
     - **Category**: Select from 8 predefined categories
     - **Price**: Cost in rupees
   - Optional fields:
     - **Icon/Code**: Text code/abbreviation (e.g., "Car", "Guard")
     - **Rating**: 0-5 (decimal allowed)
     - **Badge**: "New", "Hot", "Sale", etc.

### 3. **Edit Product**
   - Click "Edit" button on any product row
   - Update any field except Product ID (which is locked)
   - Changes are saved immediately to MongoDB

### 4. **Delete Product**
   - Click "Delete" button on any product row
   - Confirmation dialog appears before deletion
   - Product is removed from database permanently

## Categories
The system supports 8 product categories:
- Exterior
- Interior
- Lighting
- Audio & Electronics
- Wheels & Tyres
- Performance
- Car Care
- Safety & Security

## Database Setup

### Initial Setup (Seed Database)
To populate the database with sample products, run:

```bash
cd server
node src/seed.js
```

This will:
1. Clear any existing products
2. Insert 28 sample products from the original hardcoded data
3. Confirm successful seeding

### Product Schema
Products are stored in MongoDB with the following structure:

```javascript
{
  id: Number,        // Unique identifier
  name: String,      // Product name
  cat: String,       // Category
  price: Number,     // Price in Rs.
  icon: String,      // Icon/Code reference
  rating: Number,    // Rating (0-5)
  badge: String,     // Optional badge (New, Hot, Sale, etc.)
  createdAt: Date,   // Auto-generated
  updatedAt: Date    // Auto-generated
}
```

## API Endpoints

### Get All Products
```
GET /api/products
Response: { products: [...] }
```

### Get Single Product
```
GET /api/products/:productId
Response: { product: {...} }
```

### Create Product
```
POST /api/products
Body: {
  id: number,
  name: string,
  cat: string,
  price: number,
  icon: string (optional),
  rating: number (optional),
  badge: string (optional)
}
Response: { message: string, product: {...} }
```

### Update Product
```
PATCH /api/products/:productId
Body: {
  name: string,
  cat: string,
  price: number,
  icon: string (optional),
  rating: number (optional),
  badge: string (optional)
}
Response: { message: string, product: {...} }
```

### Delete Product
```
DELETE /api/products/:productId
Response: { message: string, product: {...} }
```

## Access Control
- The admin page is accessible at `/admin`
- Currently accessible to any authenticated user
- **Note**: For production, implement role-based access control to restrict admin access to admin users only

## Frontend Integration

### Navbar Changes
- Admin button appears in the navbar for logged-in users
- Clicking "Admin" navigates to `/admin`

### Products Page
- Products are now fetched from the backend API instead of hardcoded data
- Changes made in the Admin Panel appear immediately in the Products page

## Error Handling
The admin panel includes error handling for:
- Network failures
- Duplicate product IDs
- Invalid input (missing required fields)
- Database errors

## Usage Tips
1. **Product IDs**: Should be unique and sequential for easy management
2. **Pricing**: Enter prices as numbers (system formats to Indian currency)
3. **Ratings**: Can be decimal values (e.g., 4.5)
4. **Badges**: Leave empty for no badge, or use: "New", "Hot", "Sale"
5. **Icons**: Use short codes that correspond to your product type

## Future Enhancements
- [ ] Role-based access control (admin/user roles)
- [ ] Product images upload
- [ ] Bulk import/export (CSV)
- [ ] Product search and filtering in admin panel
- [ ] Inventory tracking
- [ ] Product analytics/statistics
