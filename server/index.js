const express = require('express')
require('dotenv').config();
const router = require('./router.js')
const pool = require('../database/db.js')

const app = express()
const port = process.env.PORT || 3000

console.log(process.env.PORT)
app.use(express.json())
app.use('/', router)

// app.get('/', (req, res) => {
//   pool.query('SELECT * FROM test', (err, result) => {
//     if (err) throw err
//     res.status(200)
//     res.send(result.rows)
//   })
// })

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});