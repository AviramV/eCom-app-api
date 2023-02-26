const bcrypt = require('bcrypt');

module.exports = {
    isLoggedIn(req, res, next) {
        const message = req.path === '/logout' ? 'Nothing to do here' : 'Please log in first';
        if (!req.isAuthenticated()) return res.status(401).send(message);
        next();
    },
    // Hash and salt a password
    async passwordHash(password, saltRounds) {
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(password, salt);
            return hash;
        } catch (err) {
            console.log(err);
        }
        return null;
    }
}
