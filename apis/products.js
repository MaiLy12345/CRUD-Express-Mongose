const productValidation = require('../validations/products.js');
const productController = require('../controllers/products.js');
const validate = require('express-validation');
const mongoose = require('mongoose');


exports.load = function(app) {
    app.post('/api/v1/products', validate(productValidation.createProduct()), productController.createProduct);
    app.delete('/api/v1/products/:id', validate(productValidation.deleteProduct()), productController.deleteProduct);
    app.get('/api/v1/products/:id', validate(productValidation.getProduct()), productController.getProduct);
    app.get('/api/v1/products', productController.getListProduct);
    app.put('/api/v1/products/:id', validate(productValidation.updateProduct()), productController.updateProduct);
};


const model = ['name', 'price'];