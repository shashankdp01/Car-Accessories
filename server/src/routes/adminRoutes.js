const express = require('express');
const {
  getAllUsers,
  deleteUser,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/adminController');

const router = express.Router();

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);
router.patch('/orders/:userId/:orderId', updateOrderStatus);

module.exports = router;
