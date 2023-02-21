require ('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
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