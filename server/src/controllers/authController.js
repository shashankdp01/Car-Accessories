const bcrypt = require('bcryptjs');
const User = require('../models/User');

const LEGACY_ORDER_IDS = ['#ORD-1042', '#ORD-1031'];

const cleanupLegacyOrders = async (user) => {
  const hasOnlyLegacyOrders =
    Array.isArray(user.orders) &&
    user.orders.length > 0 &&
    user.orders.every((order) => LEGACY_ORDER_IDS.includes(order.id));

  if (hasOnlyLegacyOrders) {
    user.orders = [];
    await user.save();
  }
};

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  cart: user.cart,
  orders: user.orders,
});

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      cart: [],
      orders: [],
    });

    return res.status(201).json({
      message: 'Account created successfully.',
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to register user.', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign up first.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    await cleanupLegacyOrders(user);

    return res.status(200).json({
      message: 'Login successful.',
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to log in.', error: error.message });
  }
};

module.exports = {
  loginUser,
  registerUser,
};
