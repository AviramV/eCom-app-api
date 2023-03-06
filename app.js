require('dotenv').config();
const express = require('express');
const app = express();
const expressLoader = require('./loaders/express');
const passportLoader = require('./loaders/passport');
const passport = require('passport');
const authRouter = require('./routes/auth')
const productsRouter = require('./routes/products');
const userRouter = require('./routes/user');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');

const PORT = process.env.PORT || 4001;

// load Express middlware
expressLoader(app);

// load passport middleware
passportLoader(app);

// ****** ROUTES ****** //

// registration, login and logout routes
authRouter(app, passport);

// products route
productsRouter(app);

// user route
userRouter(app);

// cart route
cartRouter(app);

// orders route
ordersRouter(app);

app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}`);
});