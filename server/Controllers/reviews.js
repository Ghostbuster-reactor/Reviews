const pool = require('../../database/db.js')

const reviews = {
  get: (req, res) => {
    let sort = ''
    if (!req.query.sort) sort = 'review_id'
    if (req.query.sort === 'helpful') sort = 'helpfulness'
    if (req.query.sort === 'newest') sort = 'date'
    console.log(sort)
    const queryArgs = [req.query.product_id, req.query.page || 0, req.query.count || 5, sort]
    pool.query(`SELECT * FROM reviews
    WHERE product_id = $1
    ORDER BY $4
    OFFSET $2
    LIMIT $3
    `,
      queryArgs, (err, results) => {
        if (err) throw err
        res.status(200)
        for (i in results.rows) {
          results.rows[i].date = Date(results.rows[i].date)
        }
        res.send(results.rows)
      })
  },
  post: () => {

  }
}

module.exports = reviews