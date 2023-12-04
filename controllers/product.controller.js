const Product = require('../models/product.schema');

const productController = {

  addProduct: async (req, res) => {
    try {
      const product = new Product(req.body);
      const productDetail = await product.save();
      res.status(200).send({
        message: 'Product added successfully!',
        data: productDetail
      });
    } catch (error) {
      res.status(400).send({
        message: 'Bad request',
        error: error.message,
        stack: error.stack
      });
    }
  },

  updateProduct: async (req, res) => {
    try {
      await Product.updateOne({ _id: req.params.id }, req.body);
      res.status(200).send({
        message: 'Product updated successfully!'
      });
    } catch (error) {
      res.status(400).send({
        message: 'Bad request',
        error: error.message,
        stack: error.stack
      });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      await Product.findOneAndDelete({ _id: req.params.id });
      res.status(200).send({
        message: 'Product deleted successfully!'
      });
    } catch (error) {
      res.status(400).send({
        message: 'Bad request',
        error: error.message,
        stack: error.stack
      });
    }
  },

  getProducts: async (req, res) => {
    try {
      const sort  = {};
      const page = req.query.page;
      const limit = req.query.limit;
      const skip = limit * (page-1);
      const { name, price, sortBy, orderBy } = req.query;

    if (sortBy && orderBy) {
      sort[sortBy] = orderBy === 'asc' ? 1 : -1;
    }

    const query = {};
    name && (query.name = name);
    price && (query.price = price);
  
    const productList = await Product.find(query).sort(sort).limit(limit).skip(skip);
    res.status(200).send({
      message: 'Products list get successfully!',
      data: productList,
    });
    } catch (error) {
      res.status(400).send({
        message: 'Bad request',
        error: error.message,
        stack: error.stack
      });
    }
  }

}

module.exports = productController;