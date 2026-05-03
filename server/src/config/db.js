const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing. Add it to server/.env before starting the backend.');
  }

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
};

module.exports = connectDB;
