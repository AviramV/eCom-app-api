const express = require('express');
const { createCart, getCartByUserId, deleteCart } = require('../services/cartService');
const { loadCart, addToCart, updateItem, removeItem } = require('../services/cartItemsService');
const { getProductById } = require('../services/productService');
const { createOrder, addToOrdersProducts } = require('../services/orderServices');
const router = express.Router();

module.exports = app => {
    app.use('/cart', router);
    // Allow only logged-in users to access carts
    router.use((req, res, next) => {
        if (!req.user) return res.status(401).send('Please log in first');
        next();
    })
    // Create a new cart
    router.post('/', async (req, res) => {
        try {
            const { id } = req.user;

            const hasCart = await getCartByUserId(id);
            if (hasCart) return res.send('Already has an active cart')

            const cart = await createCart(id);
            res.send(cart);
        } catch (error) {
            res.send(error.message)
        }
    });
    // Get cart contents
    router.get('/', isCartEmpty, async (req, res) => {
        try {
            const { cart } = req;
            res.send(cart.items);
        } catch (error) {
            res.send(error.message);
        }
    });

    // Checkout
    router.post('/checkout', isCartEmpty, async (req, res) => {
        try {
            console.log('checkout: ', req.cart.items);
            const { id } = req.user;
            // Process payment

            // Use cart items to create an order
            const newOrder = await createOrder(id, req.cart);

            // Insert cart items into orders_products
            addToOrdersProducts(newOrder.id, req.cart.items);

            // Delete cart
            deleteCart(req.cart.id);

            res.send(newOrder);
        } catch (error) {
            res.send(error.message);
        }
    });

    // Add a product to cart
    router.post('/:itemId', isValidProduct, async (req, res) => {
        try {
            const { itemId } = req.params;

            // If item already exists in cart, 
            // update qty instead of adding it again
            const cart = await loadCart(req.user.id);
            const hasItem = cart?.items?.find(item => item.id == itemId);
            if (hasItem) {
                console.log(cart.items)
                return updateItem(req.cart.id, itemId, hasItem.qty + 1)
            }


            const addedItem = await addToCart(req.cart.id, itemId);
            res.send(addedItem);
        } catch (error) {
            res.send(error.message);
        }
    });
    // Update product quantity in cart
    router.put('/:itemId', isValidProduct, async (req, res) => {
        try {
            const { itemId } = req.params;
            const { qty } = req.body;
            const updatedItem = await updateItem(req.cart.id, itemId, qty);
            res.send(updatedItem);
        } catch (error) {
            res.send(error.message)
        }
    });
    // Remove item from cart
    router.delete('/:itemId', isValidProduct, async (req, res) => {
        try {
            const { itemId } = req.params;
            const removedItem = await removeItem(req.cart.id, itemId);
            res.send('Successfully removed item');
        } catch (error) {
            res.send(error.message);
        }
    });
}

// Check if product exists in DB
async function isValidProduct(req, res, next) {
    try {
        const { itemId } = req.params;
        const { id } = req.user;
        if (!await getProductById(itemId)) throw Error("Item doesn't exist");
        req.cart = await getCartByUserId(id);
        next();
    } catch (error) {
        res.send(error.message);
    }
}

async function isCartEmpty(req, res, next) {
    const { id } = req.user;
    const cart = await loadCart(id);
    if (!cart) return res.send("Cart doesn't exist");
    if (!cart.items) return res.send('Cart is empty');
    req.cart = cart;
    next();
}