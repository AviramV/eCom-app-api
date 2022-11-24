require ('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4001;

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}`);
})