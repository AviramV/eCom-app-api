const db = require('../db');
const { getCartByUserId, getCartItems } = require('./cartService');

module.exports = {
    async loadCart(userId) {
        const cart = await getCartByUserId(userId);
        if (!cart) return null;
        const items = await getCartItems(cart.id);
        cart.items = items;
        return cart;
    },

    async addToCart(cartId, itemId, qty = 1) {
        const statement = `INSERT INTO carts_products (cart_id, product_id, qty) 
                            VALUES ($1, $2, $3) 
                            RETURNING *`;
        const values = [cartId, itemId, qty];
        const addedItem = await db.query(statement, values);
        if (!addedItem.rows.length) throw Error('Failed to add item');
        return addedItem.rows[0];
    },

    async updateItem(cartId, itemId, qty) {
        const statement = `UPDATE carts_products
        SET qty = $1
        WHERE product_id = $2 AND cart_id = $3
        RETURNING *`
        const values = [qty, itemId, cartId];
        const updatedItem = await db.query(statement, values);
        if (!updatedItem.rows.length) throw Error('Failed to update item');
        return updatedItem.rows[0];
    },

    async removeItem(cartId, itemId) {
        const statement = `DELETE FROM carts_products WHERE cart_id = $1 AND product_id = $2 RETURNING *`;
        const values = [cartId, itemId];
        const deletedItem = await db.query(statement, values);
        if (!deletedItem.rows.length) throw Error('Failed to remove item');
        return deletedItem.rows[0];
    }
}