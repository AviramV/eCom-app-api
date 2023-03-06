const db = require("../db")

module.exports = {
    async createOrder(userId, cart) {
        
        const statement = `INSERT INTO orders 
        (status, user_id, total, created) 
        VALUES ($1, $2, $3, $4)
        RETURNING *`;
        const total = cartTotal(cart.items)
        const values = ["open", userId, total, new Date()];
        const newOrder = await db.query(statement, values);
        if (!newOrder.rows.length) return null;
        return newOrder.rows[0];
    },

    async addToOrdersProducts(orderId, items) {
        for (const item of items) {
          const { id, qty } = item;
          const statement = `
            INSERT INTO orders_products (order_id, product_id, qty)
            VALUES ($1, $2, $3)
          `;
          const values = [orderId, id, qty];
          await db.query(statement, values);
        }
      }
      
}

const cartTotal = cartItems => {
    const itemSubtotal = cartItems.map(item => item.price * item.qty);
    const cartTotal = itemSubtotal.reduce((accumulator, currentValue) => accumulator + currentValue).toFixed(2);
    return cartTotal;
}