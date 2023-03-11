const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../services/authService');
const { getOrdersByUserId, getOrderByOrderId, updtaeOrderStatus } = require('../services/orderServices');

module.exports = app => {
    app.use('/orders', isLoggedIn, router);

    router.get('/', async (req, res) => {
        try {
            const { id } = req.user;
            const userOrders = await getOrdersByUserId(id);
            if (!userOrders) return res.status(404).send('No orders found');
            res.send(userOrders);
        } catch (error) {
            res.send(error.message);
        }
    });

    router.get('/:orderId', async (req, res) => {
        try {
            const { orderId } = req.params;
            const order = await getOrderByOrderId(orderId, req.user.id);
            if (!order) return res.status(404).send('Order not found');
            res.send(order);
        } catch (error) {
            res.send(error.message);
        }
    });
    
    router.put('/:orderId', async (req, res) => {
        try {
            const userId = req.user.id;
            const { orderId } = req.params;
            const { status } = req.body;
            const order = await updtaeOrderStatus(orderId, status, userId);
            if (!order) return res.status(404).send('Order not found');
            res.send(order);
        } catch (error) {
            res.send(error.message)
        }
    })
}