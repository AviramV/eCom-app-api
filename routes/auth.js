const express = require('express');
const router = express.Router();
const { isLoggedIn, passwordHash } = require('../services/authService');
const db = require('../db')

module.exports = (app, passport) => {
    app.use(router);

    router.post('/register', async (req, res) => {
        const { email, username, password } = req.body;
        try {
            const hashedPassword = await passwordHash(password, 10);
            const dbRes = await db.query(`insert into users(email, user_name, password) values ($1, $2, $3) RETURNING user_name`,
                [email, username, hashedPassword]);
            res.status(201).send(`Successfully registered ${dbRes.rows[0].user_name}`)
        } catch (error) {
            res.status(409).send(error.detail)
        }
    });
    
    router.get('/login', (req, res) => {
        if (!req.user) return res.send('not logged in')
        res.send(`Hello ${req.user.username}`)
    })
    
    router.post('/login', passport.authenticate('local', { failureMessage: true }), (req, res) => {
        res.send(`Logged in as ${req.body.username}`);
    })
    
    router.post('/logout', isLoggedIn, (req, res) => {
        console.log(req.path)
        req.logout(err => {
            if (err) return res.send(err)
            res.send(`Logged out successfully`)
        });
    })
}