const db = require('../db')

module.exports = {
    async addProduct(productName, price) {
    
        const response = await db.query(`insert into products(name, price) values ($1, $2) RETURNING *`,
            [productName, price]);
        const newProduct = response.rows[0];
        if (!newProduct) throw new Error("Product not inserted into database");
        return newProduct;
    }, 
    async getAllProducts() {
        const response = await db.query(`SELECT * FROM products`)
        const productList = response.rows;
        return productList;
    },

    async getProductById(id) {
        const response = await db.query(`SELECT * FROM products WHERE id = $1`, [id]);
        if (!response.rows.length) return null;
        const product = response.rows[0];
        return product;
    }
}

