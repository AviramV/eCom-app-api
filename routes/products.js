const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, addProduct } = require('../services/productService')
const { isLoggedIn } = require('../services/authService')


module.exports = (app) => {
    app.use('/products', router);
    // get all products
    router.get('/', async (req, res) => {
        try {
            const productList = await getAllProducts();
            res.send(productList);
        } catch (error) {
            console.log(error)
            res.status(500).send('Something went wrong')
        }
    });
    
    // get a product by id
    router.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const product = await getProductById(id);
            if (!product) return res.status(404).send('Product not found');
            res.send(product);
        } catch (error) {
            console.log(error)
            return res.status(500).send('Error getting product')
        }
    });
    
    // add product to database
    router.post('/', isLoggedIn, async (req, res) => {
        try {
            const { productName, price } = req.body;
            const newProduct = await addProduct(productName, price);
            res.status(201).send(newProduct);
        } catch (err) {
            console.log('Error insering product into database. ', err.stack);
            res.status(500).send('Failed to add product to database');
        }
    });
}