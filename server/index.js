const express = require('express')
require('dotenv').config();
const router = require('./router.js')
const pool = require('../database/db.js')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/', router)
app.get('http://52.26.228.170:1128/loaderio-12f7a3c1f129dc82f35cb36acf434d3d.html')


app.listen(port, function () {
  console.log(`listening on port ${port}`);
});