const dotenv = require('dotenv');
dotenv.config();
const expreess = require('express');
const app = expreess();
const cors = require('cors');

app.use(cors());

app.get('/',(req, res)=>{
    res.send('hello world')
});

module.exports = app;