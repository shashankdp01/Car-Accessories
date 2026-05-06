const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const SAMPLE_PRODUCTS = [
  { id: 1, icon: 'Car', name: 'Universal Car Body Cover', cat: 'Exterior', price: 1299, rating: 4.3, badge: 'New' },
  { id: 2, icon: 'Guard', name: 'Front & Rear Bumper Guard', cat: 'Exterior', price: 799, rating: 4.1, badge: null },
  { id: 3, icon: 'Trim', name: 'Door Edge Guard Strip', cat: 'Exterior', price: 299, rating: 4.0, badge: 'Hot' },
  { id: 4, icon: 'Mirror', name: 'Chrome Side Mirror Covers', cat: 'Exterior', price: 499, rating: 3.9, badge: null },
  { id: 5, icon: 'Seat', name: 'Universal Seat Covers (Set)', cat: 'Interior', price: 1899, rating: 4.6, badge: 'Hot' },
  { id: 6, icon: 'Mat', name: 'Premium Floor Mats (Set of 4)', cat: 'Interior', price: 799, rating: 4.4, badge: null },
  { id: 7, icon: 'Wheel', name: 'Steering Wheel Cover', cat: 'Interior', price: 299, rating: 4.2, badge: null },
  { id: 8, icon: 'Dash', name: 'Dashboard Cover Mat', cat: 'Interior', price: 499, rating: 4.0, badge: 'Sale' },
  { id: 9, icon: 'LED', name: 'LED Headlight Bulbs (Pair)', cat: 'Lighting', price: 1499, rating: 4.5, badge: 'New' },
  { id: 10, icon: 'Fog', name: 'Fog Lamp Set with Switch', cat: 'Lighting', price: 999, rating: 4.3, badge: null },
  { id: 11, icon: 'Strip', name: 'Interior LED Strip Lights', cat: 'Lighting', price: 399, rating: 4.1, badge: null },
  { id: 12, icon: 'Reverse', name: 'Reverse Parking LED Lights', cat: 'Lighting', price: 599, rating: 4.0, badge: null },
  { id: 13, icon: 'Audio', name: 'Bluetooth Car Speaker', cat: 'Audio & Electronics', price: 1199, rating: 4.4, badge: 'Hot' },
  { id: 14, icon: 'Cam', name: 'Full HD Dash Camera', cat: 'Audio & Electronics', price: 2999, rating: 4.7, badge: 'New' },
  { id: 15, icon: 'FM', name: 'FM Transmitter Bluetooth', cat: 'Audio & Electronics', price: 399, rating: 4.0, badge: null },
  { id: 16, icon: 'Camera', name: 'Reversing Backup Camera', cat: 'Audio & Electronics', price: 1599, rating: 4.3, badge: null },
  { id: 17, icon: 'Wheel', name: 'Alloy Wheel Set (Set of 4)', cat: 'Wheels & Tyres', price: 8999, rating: 4.6, badge: null },
  { id: 18, icon: 'Pump', name: 'Tyre Inflator / Air Pump', cat: 'Wheels & Tyres', price: 999, rating: 4.3, badge: null },
  { id: 19, icon: 'Rim', name: 'Wheel Rim Covers (Set of 4)', cat: 'Wheels & Tyres', price: 599, rating: 3.8, badge: 'Sale' },
  { id: 20, icon: 'Tune', name: 'High-Flow Air Filter', cat: 'Performance', price: 799, rating: 4.2, badge: null },
  { id: 21, icon: 'Exhaust', name: 'Sports Exhaust Tip', cat: 'Performance', price: 1499, rating: 4.0, badge: null },
  { id: 22, icon: 'Bar', name: 'Strut Bar (Front)', cat: 'Performance', price: 2499, rating: 4.1, badge: 'New' },
  { id: 23, icon: 'Care', name: 'Car Wax & Polish Kit', cat: 'Car Care', price: 599, rating: 4.3, badge: null },
  { id: 24, icon: 'Wash', name: 'Pressure Washer Gun Set', cat: 'Car Care', price: 899, rating: 4.4, badge: null },
  { id: 25, icon: 'Cloth', name: 'Microfiber Cloth Pack (10pc)', cat: 'Car Care', price: 299, rating: 4.5, badge: 'Hot' },
  { id: 26, icon: 'GPS', name: 'GPS Tracker (Realtime)', cat: 'Safety & Security', price: 1499, rating: 4.5, badge: 'New' },
  { id: 27, icon: 'Alarm', name: 'Car Alarm System', cat: 'Safety & Security', price: 1999, rating: 4.2, badge: null },
  { id: 28, icon: 'Belt', name: 'Retractable Seat Belt Cutter', cat: 'Safety & Security', price: 299, rating: 4.6, badge: null },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/autogearpro');
    console.log('✓ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('✓ Cleared existing products');

    // Insert sample products
    await Product.insertMany(SAMPLE_PRODUCTS);
    console.log(`✓ Inserted ${SAMPLE_PRODUCTS.length} sample products`);

    console.log('\n✓ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
