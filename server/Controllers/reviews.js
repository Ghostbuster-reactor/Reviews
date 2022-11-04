const pool = require('../../database/db.js')

const reviews = {
  get: async (req, res) => {
    if (!req.query.sort) req.query.sort = 'review_id'
    if (req.query.sort === 'helpful') req.query.sort = 'helpfulness'
    if (req.query.sort === 'newest') req.query.sort = 'date'
    const queryArgs = [req.query.product_id, req.query.page || 0, req.query.count || 5]
    try {
      result = await pool.query(`SELECT review_id, rating, summary, recommend, response, body, to_timestamp(date/1000) as date, reviewer_name, helpfulness FROM reviews
      WHERE product_id = $1
      ORDER BY ${req.query.sort} DESC
      OFFSET $2
      LIMIT $3`, queryArgs)
      for (let i = 0; i < result.rows.length; i++) {
        result.rows[i].photos = pool.query(`SELECT id, url FROM photos WHERE review_id = ${result.rows[i].review_id}`)
      }
      res.status(200)
      res.send(result.rows)
    } catch (e) { console.log(e) }
  },
  post: async (req, res) => {
    let params1 = [req.body.product_id, req.body.rating, req.body.summary || null, req.body.body || null, req.body.recommend, req.body.name, req.body.email]
    try {
      pool.query(`INSERT INTO reviews (review_id, product_id, rating, summary, body, recommend, reviewer_name, reviewer_email)
    VALUES (nextval('reviews_review_id_seq'::regclass), $1,$2,$3,$4,$5,$6,$7)`, params1)
      const response = await pool.query(`SELECT MAX(review_id) FROM reviews`)
      pool.query(`INSERT INTO photos (review_id, url) VALUES ($1,$2)`, [response.rows[0].review_id, req.body.photos])
      res.status(201)
      res.send('CREATED!')
      // pool.query(`INSERT INTO meta (characteristic_id, review_id, value) VALUES ($1,$2,$3)`, [response.rows[0].review_id, req.body.photos] )
    } catch (e) { console.log(e) }
  },
  meta: (req, res) => {
    pool.query(`SELECT SOMETHING FROM SOMETHING WHERE product_id = $1`[req.query.product_id])
  },
  helpful: (req, res) => {
    pool.query(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id=$1`, [req.params.review_id])
    res.status(204)
    res.send('NO CONTENT')
  },
  report: (req, res) => {
    pool.query(`UPDATE reviews SET reported = true WHERE review_id=$1`, [req.params.review_id])
    res.status(204)
    res.send('NO CONTENT')
  },
  test: async (req, res) => {
    let response
    try {
      response = await pool.query(`SELECT * FROM reviews LIMIT 5`)
      res.status(200)
      res.send(response.rows)
    } catch (e) { console.log(e) }
  }
}

module.exports = reviews