require ('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local');
const db = require('./db');

const PORT = process.env.PORT || 4001;

secret = process.env.SECRET;
app.use(
    session({
        secret,
        cookie: { maxAge: 1000 * 60 *60 * 24, secure: false, sameSite: "none" },
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize(), passport.session());

// Add passport local strategy
passport.use(
    new localStrategy(function (username, password, done) {
      db.users.findByUsername(username, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false);
        if (user.password != password) return done(null, false);
        return done(null, user);
      });
    })
  );

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.get('/test', async(req, res) => {
    const dbRes = await db.query(`SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';`)
    res.send(dbRes.rows);
    dbRes.rows.forEach(row => {
        console.log(row)
    })
})

app.post('/register', (req, res) => {

})

app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}`);
})