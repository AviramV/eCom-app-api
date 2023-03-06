const db = require('../db');

module.exports = {
    async createCart(userId) {
        const created = new Date;
        const statement = `INSERT INTO carts (user_id, created) VALUES ($1, $2) RETURNING *`;
        const values = [userId, created];

        const response = await db.query(statement, values);
        if (!response.rows.length) throw Error("Couldn't create cart");
        return response.rows[0];
    },

    async getCartByUserId(userId) {
        const response = await db.query(`SELECT * FROM carts WHERE user_id = $1`, [userId]);
        if (!response.rows.length) return null; //throw Error("Couldn't get cart");
        return response.rows[0];
    },

    async getCartItems(cartId) {
        const statement = `SELECT products.*, carts_products.qty
                            FROM products
                            INNER JOIN carts_products ON products.id = carts_products.product_id
                            WHERE carts_products.cart_id = $1`;
        const values = [cartId];
        const items = await db.query(statement, values);
        if (!items.rows.length) return null; //throw Error('Cart is empty')
        return items.rows;
    },

    async deleteCart(cartId) {
        const values = [cartId];
        db.query(`DELETE FROM carts WHERE id = $1`, values);
        db.query(`DELETE FROM carts_products WHERE cart_id = $1`, values);
    }
}