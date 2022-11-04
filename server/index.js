const express = require('express')
require('dotenv').config();
const router = require('./router.js')
const pool = require('../database/db.js')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/', router)


app.listen(port, function () {
  console.log(`listening on port ${port}`);
});