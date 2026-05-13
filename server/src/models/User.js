const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true },
    name: { type: String, required: true },
    cat: { type: String, required: true },
    price: { type: Number, required: true },
    icon: { type: String, default: '' },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    items: {
      type: [orderItemSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['Delivered', 'In Transit', 'Processing'],
      default: 'Processing',
    },
    total: { type: String, required: true },
    address: { type: String, default: 'N/A' },
    paymentMethod: { type: String, default: 'N/A' },
    placedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true },
    name: { type: String, required: true },
    cat: { type: String, required: true },
    price: { type: Number, required: true },
    icon: { type: String, default: '' },
    badge: { type: String, default: '' },
    qty: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    cart: {
      type: [cartItemSchema],
      default: [],
    },
    orders: {
      type: [orderSchema],
      default: [],
    },
    role: { type: String, default: 'user' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
