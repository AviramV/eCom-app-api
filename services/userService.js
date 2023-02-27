const db = require('../db');
const { passwordHash } = require('./authService');

module.exports = {
    // Get user from database by username
    async getUser(username) {
        const user = await db.query('SELECT * FROM users WHERE user_name = $1', [username]);
        return user.rows[0];
    },

    async getUserById(id) {
        const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        return user.rows[0];
    },

    async updateUser(id, data) {
        // if changing the password, it should be hashed and salted
        const isPassword = Object.keys(data).includes('password');
        if (isPassword) {
            const hashedPassword = await passwordHash(data.password.toString(), 10)
            data.password = hashedPassword;
        }

        const columns = Object.keys(data).map((key, index) => `${key} = $${index + 1}`);
        const values = Object.values(data);
        const user = await db.query(`UPDATE users SET ${columns} WHERE id = $${columns.length + 1} RETURNING *`, [...values, id]);
        
        return user.rows[0];
    },

    async deleteUser(id) {
        return db.query('DELETE FROM users WHERE id = $1', [id]);
    }
}