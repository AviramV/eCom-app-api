require ('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4001;

const db = require('./db');

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

app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}`);
})