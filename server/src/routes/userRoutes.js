const express = require('express');
const {
  addToCart,
  checkout,
  getUserById,
  removeCartItem,
  updateCartItem,
} = require('../controllers/userController');

const router = express.Router();

router.get('/:userId', getUserById);
router.post('/:userId/cart', addToCart);
router.patch('/:userId/cart/:productId', updateCartItem);
router.delete('/:userId/cart/:productId', removeCartItem);
router.post('/:userId/checkout', checkout);

module.exports = router;
