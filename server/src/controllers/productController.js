const Product = require('../models/Product');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ id: 1 });
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch products.', error: error.message });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.productId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch product.', error: error.message });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const { id, name, cat, price, icon, rating, badge } = req.body;

    if (!id || !name || !cat || price === undefined) {
      return res.status(400).json({ message: 'ID, name, category, and price are required.' });
    }

    const existingProduct = await Product.findOne({ id });
    if (existingProduct) {
      return res.status(409).json({ message: 'Product with this ID already exists.' });
    }

    const product = await Product.create({
      id,
      name,
      cat,
      price,
      icon: icon || '',
      rating: rating || 0,
      badge: badge || null,
    });

    return res.status(201).json({
      message: 'Product created successfully.',
      product,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create product.', error: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { name, cat, price, icon, rating, badge } = req.body;
    const productId = req.params.productId;

    if (!name || !cat || price === undefined) {
      return res.status(400).json({ message: 'Name, category, and price are required.' });
    }

    const product = await Product.findOne({ id: productId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    product.name = name;
    product.cat = cat;
    product.price = price;
    product.icon = icon || product.icon;
    product.rating = rating !== undefined ? rating : product.rating;
    product.badge = badge || null;

    await product.save();

    return res.status(200).json({
      message: 'Product updated successfully.',
      product,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update product.', error: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.productId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.status(200).json({
      message: 'Product deleted successfully.',
      product,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete product.', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
