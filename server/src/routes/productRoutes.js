const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:productId', getProductById);
router.post('/', createProduct);
router.patch('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);

module.exports = router;
