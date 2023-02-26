const db = require('../db')

module.exports = {
    // Get user from database by username
    async getUser(username) {
        const user = await db.query(`SELECT * FROM users WHERE user_name = $1`, [username]);
        return user.rows[0];
    }
}