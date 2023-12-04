const Product = require('../models/product.schema');
const User = require('../models/user.schema');

// Cart controller
const cartController = {
  // Add product to cart
  addToCart: async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ msg: 'Product not found' });
      }
  
      const user = await User.findById(req.user.id);
  
      // Check if the product is already in the user's cart
      const existingCartItem = user.cart.find(
        (item) => item.product.toString() === productId
      );
  
      if (existingCartItem) {
        existingCartItem.quantity += quantity;
      } else {
        user.cart.push({ product: productId, quantity });
      }
  
      await user.save();
      res.json(user.cart);
    } catch (error) {
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  },

  // Remove product from cart
  removeFromCart: async (req, res) => {
    try {
      const { productId } = req.params;
  
      const user = await User.findById(req.user.id);
  
      // Remove the product from the cart
      user.cart = user.cart.filter((item) => item.product.toString() !== productId);
  
      await user.save();
      res.json(user.cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  },

  // Update quantity of product in cart
  updateQuantity: async (req, res) => {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;

      const user = await User.findById(req.user.id);
  
      // Update the quantity of the specified product in the cart
      user.cart.forEach((item) => {
        if (item.product.toString() === productId) {
          item.quantity = quantity;
        }
      });
  
      await user.save();
      res.json(user.cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  },

  // Get the current cart
  getCart: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate('cart.product');
      res.json(user.cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  },
};

module.exports = cartController;