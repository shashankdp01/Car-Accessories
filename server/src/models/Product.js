const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    cat: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    icon: { type: String, default: '' },
    image: { type: String, default: '' },
    brand: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    badge: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
