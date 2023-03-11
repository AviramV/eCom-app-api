const db = require("../db")

module.exports = {
    // Create a new order form cart items
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
    // Add order items to orders_items table
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
      },

      async getOrdersByUserId(userId) {
        const userOrders = await db.query(`SELECT * from orders WHERE user_id = $1 ORDER BY id`, [userId]);
        if (!userOrders.rows.length) return null;
        return userOrders.rows;
      },

      async getOrderByOrderId(orderId, userId) {
        const order = await db.query(`SELECT * FROM orders WHERE id = $1 AND user_id = $2`, [orderId, userId]);
        if (!order.rows.length) return null;
        return order.rows[0];
      },

      async updtaeOrderStatus(orderId, status, userId) {
        const updatedOrder = await db.query(`UPDATE orders
         SET status = $1, modified = $2 
         WHERE id = $3 AND user_id = $4
         RETURNING *`, 
         [status, new Date(), orderId, userId]);
        if (!updatedOrder.rows.length) return null;
        return updatedOrder.rows[0];
      }
      
}

const cartTotal = cartItems => {
    const itemSubtotal = cartItems.map(item => item.price * item.qty);
    const cartTotal = itemSubtotal.reduce((accumulator, currentValue) => accumulator + currentValue).toFixed(2);
    return cartTotal;
}