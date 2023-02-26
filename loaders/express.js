require('dotenv').config();
const express = require('express');
const session = require('express-session');

const secret = process.env.SECRET;

module.exports = (app) => {
    app.use(express.json());

    app.use(
        session({
            secret,
            cookie: { maxAge: 1000 * 60 * 60 * 24, secure: false, sameSite: "none" },
            resave: false,
            saveUninitialized: false
        })
    );
}