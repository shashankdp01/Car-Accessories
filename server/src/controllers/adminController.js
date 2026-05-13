const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // In a real app we'd check if user.role === 'admin'
    // but the schema doesn't have a role field currently
    // We'll just delete the user for now
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const users = await User.find({}, 'name email orders');
    let allOrders = [];
    
    users.forEach(user => {
      user.orders.forEach(order => {
        allOrders.push({
          ...order.toObject(),
          userId: user._id,
          userName: user.name,
          userEmail: user.email
        });
      });
    });

    // Sort by placedAt desc
    allOrders.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));

    return res.status(200).json({ orders: allOrders });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { userId, orderId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const order = user.orders.find(o => o.id === orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await user.save();

    return res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllOrders,
  updateOrderStatus
};
