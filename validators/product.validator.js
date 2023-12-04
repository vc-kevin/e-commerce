const joi = require('joi');
 
function validateProduct(req, res, next) {
  const schema = joi.object({
    name: joi.string().required(),
    brand: joi.string().required(),
    price: joi.number().required(),
    category: joi.string().required(),
    description: joi.string(),
    quantity: joi.number().required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    console.error(error);
    res.send(error);
  } else {
    next();
  }
}

module.exports = validateProduct;