const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, addProduct } = require('../services/productService')
const { isLoggedIn } = require('../services/authService')


module.exports = (app) => {
    app.use('/products', router);
    // get all products
    router.get('/', async (req, res) => {
        const productList = await getAllProducts();
        res.send(productList);
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


// async function addProduct(productName, price) {
//     const response = await db.query(`insert into products(name, price) values ($1, $2) RETURNING *`,
//         [productName, price]);
//     const newProduct = response.rows[0];
//     if (!newProduct) throw new Error("Product not inserted into database");
//     return newProduct;
// }

// async function getAllProducts() {
//     const response = await db.query(`SELECT * FROM products`)
//     const productList = response.rows;
//     return productList;
// }

// async function getProductById(id) {
//     const response = await db.query(`SELECT * FROM products WHERE id = $1`, [id]);
//     if (!response.rows.length) return null;
//     const product = response.rows[0];
//     return product;
// }