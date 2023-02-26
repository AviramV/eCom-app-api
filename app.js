require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcrypt');
const localStrategy = require('passport-local');
const db = require('./db');

const PORT = process.env.PORT || 4001;

const secret = process.env.SECRET;

// ****** MIDDLEWARE ****** //

app.use(express.json());

app.use(
    session({
        secret,
        cookie: { maxAge: 1000 * 60 * 60 * 24, secure: false, sameSite: "none" },
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize(), passport.session());

// Configure passport local strategy
passport.use(
    new localStrategy(async function (username, password, done) {
        const failMessage = { message: 'Incorrect username or password.' }
        try {
            const user = await getUser(username);
            if (!user) return done(null, false, failMessage);

            const matchedPassword = await bcrypt.compare(password, user.password);
            if (!matchedPassword) return done(null, false, failMessage);

            return done(null, user);
        } catch (error) {
            return done(error);
        }

    })
);

passport.serializeUser((user, done) => {
    done(null, {
        id: user.id,
        username: user.user_name
    });
});

passport.deserializeUser((user, done) => {
    done(null, user)
})

// ****** ROUTES ****** //

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/register', async (req, res) => {
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

app.get('/login', (req, res) => {
    if (!req.user) return res.send('not logged in')
    res.send(`Hello ${req.user.username}`)
})

app.post('/login', passport.authenticate('local', { failureMessage: true }), (req, res) => {
    res.send(`Logged in as ${req.body.username}`);
})

app.post('/logout', isLoggedIn, (req, res) => {
    console.log(req.path)
    req.logout(err => {
        if (err) return res.send(err)
        res.send(`Logged out successfully`)
    });
})

// Product

// get all products
app.get('/product', async (req, res) => {
    const productList = await getAllProducts();
    res.send(productList);
});

// get a product by id
app.get('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await getProductById(id);
        if (!product) return res.status(404).send('Product not found');
        res.send(product);
    } catch (error) {
        console.log(error)
        return res.status(500).send('Error getting product')
    }
});

// add product to database
app.post('/product', isLoggedIn, async (req, res) => {
    try {
        const { productName, price } = req.body;
        const newProduct = await addProduct(productName, price);
        res.status(201).send(newProduct);
    } catch (err) {
        console.log('Error insering product into database. ', err.stack);
        res.status(500).send('Failed to add product to database');
    }
});

app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}`);
});

// ****** UTILS ******* //

// Hash and salt a password
async function passwordHash(password, saltRounds) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (err) {
        console.log(err);
    }
    return null;
};

// Get user from database by username
async function getUser(username) {
    const user = await db.query(`SELECT * FROM users WHERE user_name = $1`, [username]);
    return user.rows[0];
}

// Add product to databse
async function addProduct(productName, price) {
    const response = await db.query(`insert into products(name, price) values ($1, $2) RETURNING *`,
        [productName, price]);
    const newProduct = response.rows[0];
    if (!newProduct) throw new Error("Product not inserted into database");
    return newProduct;
}

async function getAllProducts() {
    const response = await db.query(`SELECT * FROM products`)
    const productList = response.rows;
    return productList;
}

async function getProductById(id) {
    const response = await db.query(`SELECT * FROM products WHERE id = $1`, [id]);
    if (!response.rows.length) return null;
    const product = response.rows[0];
    return product;
}

function isLoggedIn(req, res, next) {
    const message = req.path === '/logout' ? 'Nothing to do here' : 'Please log in first';
    if (!req.isAuthenticated()) return res.status(401).send(message);
    next();
}