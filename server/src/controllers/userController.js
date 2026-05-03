const User = require('../models/User');

const LEGACY_ORDER_IDS = ['#ORD-1042', '#ORD-1031'];

const normalizeUserData = async (user) => {
  const hasOnlyLegacyOrders =
    Array.isArray(user.orders) &&
    user.orders.length > 0 &&
    user.orders.every((order) => LEGACY_ORDER_IDS.includes(order.id));

  if (hasOnlyLegacyOrders) {
    user.orders = [];
    await user.save();
  }

  return user;
};

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  cart: user.cart,
  orders: user.orders,
});

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await normalizeUserData(user);
    return res.status(200).json({ user: formatUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load user profile.', error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { product } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!product || typeof product.id !== 'number') {
      return res.status(400).json({ message: 'A valid product is required.' });
    }

    const existingItem = user.cart.find((item) => item.productId === product.id);

    if (existingItem) {
      existingItem.qty += 1;
    } else {
      user.cart.push({
        productId: product.id,
        name: product.name,
        cat: product.cat,
        price: product.price,
        icon: product.icon || '',
        badge: product.badge || '',
        qty: 1,
      });
    }

    await user.save();
    return res.status(200).json({ message: 'Item added to cart.', user: formatUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to add item to cart.', error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = Number(req.params.productId);
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const item = user.cart.find((cartItem) => cartItem.productId === productId);

    if (!item) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1.' });
    }

    item.qty = quantity;
    await user.save();

    return res.status(200).json({ message: 'Cart updated.', user: formatUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update cart item.', error: error.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.cart = user.cart.filter((item) => item.productId !== productId);
    await user.save();

    return res.status(200).json({ message: 'Item removed from cart.', user: formatUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to remove cart item.', error: error.message });
  }
};

const checkout = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.cart.length) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }

    const totalAmount = user.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const order = {
      id: `#ORD-${Date.now().toString().slice(-6)}`,
      items: user.cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        cat: item.cat,
        price: item.price,
        icon: item.icon,
        qty: item.qty,
      })),
      status: 'Processing',
      total: `Rs. ${totalAmount.toLocaleString('en-IN')}`,
      placedAt: new Date(),
    };

    user.orders.unshift(order);
    user.cart = [];
    await user.save();

    return res.status(200).json({
      message: 'Order placed successfully.',
      order,
      user: formatUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to complete checkout.', error: error.message });
  }
};

module.exports = {
  addToCart,
  checkout,
  getUserById,
  removeCartItem,
  updateCartItem,
};
