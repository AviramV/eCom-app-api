require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local').Strategy;
const db = require('./db');

const PORT = process.env.PORT || 4001;

const secret = process.env.SECRET;
app.use(
    session({
        secret,
        cookie: { maxAge: 1000 * 60 * 60 * 24, secure: false, sameSite: "none" },
        resave: false,
        saveUninitialized: false
    })
);

const passwordHash = async (password, saltRounds) => {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (err) {
      console.log(err);
    }
    return null;
  };

app.use(passport.initialize(), passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    db.users.findById(id, function (err, user) {
      if (err) {
        return done(err);
      }
      done(null, user);
    });
  });

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

app.post('/register', express.json(), async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const hashedPassword = await passwordHash(password, 10);
        const dbRes = await db.query(`insert into users(email, user_name, password) values ($1, $2, $3) RETURNING user_name`,
            [email, username, hashedPassword]);
        res.status(201).send(`Successfully registered ${dbRes.rows[0].user_name}`)
    } catch (error) {
        res.status(409).send(error.detail)
    }
})

app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}`);
})