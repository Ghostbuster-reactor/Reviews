const pool = require('../../database/db.js')

const reviews = {
  // ----------------------------------------- GET REQUEST -----------------------------------------
  get: async (req, res) => {

    // set sort parameter to be a column name if listed
    if (!req.query.sort) req.query.sort = 'review_id'
    if (req.query.sort === 'helpful') req.query.sort = 'helpfulness'
    if (req.query.sort === 'newest') req.query.sort = 'date'

    // create parameters
    const queryArgs = [req.query.product_id, req.query.page || 0, req.query.count || 5]

    // try query
    try {
      const result = await pool.query(`
      SELECT review_id, rating, summary, recommend, response, body, to_timestamp(date/1000) as date, reviewer_name, helpfulness,
        (SELECT json_agg(json_build_object('id', photos.id, 'url', photos.url)) FROM photos WHERE review_id = reviews.review_id
        ) as photos, reported FROM reviews
      WHERE product_id = $1 AND reported = FALSE
      ORDER BY ${req.query.sort} DESC
      OFFSET $2
      LIMIT $3`, queryArgs)

      // end response
      res.status(200)
      res.send(result.rows)
    } catch (e) { console.log(e) }
  },

  // ----------------------------------------- POST REQUEST -----------------------------------------
  post: async (req, res) => {
    let params1 = [req.body.product_id, req.body.rating, req.body.summary || null, req.body.body || null, req.body.recommend, req.body.name, req.body.email]
    try {
      pool.query(`INSERT INTO reviews (review_id, product_id, rating, summary, body, recommend, reviewer_name, reviewer_email)
    VALUES (nextval('reviews_review_id_seq'::regclass), $1,$2,$3,$4,$5,$6,$7)`, params1)
      const response = await pool.query(`SELECT MAX(review_id) FROM reviews`)
      for (let i = 0; i < req.body.photos.length; i++) {
        pool.query(`INSERT INTO photos (review_id, url) VALUES ($1,$2)`, [response.rows[0].max, req.body.photos[i]])
      }
      let meta_keys = Object.keys(req.body.characteristics)
      for (i of meta_keys) {
        pool.query(`INSERT INTO meta (characteristic_id, review_id, value) VALUES ($1,$2,$3)`, [Number(i), response.rows[0].max, req.body.characteristics[i]])
      }
      res.status(201)
      res.send('CREATED!')

    } catch (e) { console.log(e) }
  },

  // ----------------------------------------- META REQUEST -----------------------------------------
  meta: async (req, res) => {
    const result = await pool.query(`
      SELECT ${req.query.product_id} as product_id, json_build_object (
        '1', (SELECT COUNT (rating) FROM reviews WHERE rating = 1 AND product_id = ${req.query.product_id}),
        '2', (SELECT COUNT (rating) FROM reviews WHERE rating = 2 AND product_id = ${req.query.product_id}),
        '3', (SELECT COUNT (rating) FROM reviews WHERE rating = 3 AND product_id = ${req.query.product_id}),
        '4', (SELECT COUNT (rating) FROM reviews WHERE rating = 4 AND product_id = ${req.query.product_id}),
        '5', (SELECT COUNT (rating) FROM reviews WHERE rating = 5 AND product_id = ${req.query.product_id})
        ) as ratings,
        json_build_object (
          'false', (SELECT COUNT (recommend) FROM reviews WHERE recommend = false AND product_id = ${req.query.product_id}),
          'true', (SELECT COUNT (recommend) FROM reviews WHERE recommend = true AND product_id = ${req.query.product_id})
        ) as recommended,
        json_build_object (

        ) as characteristics`)
    res.status(200)
    res.send(result.rows[0])
  },


  // 'ratings', json_build_object(
  //   '1', (SELECT COUNT (rating) FROM reviews WHERE rating = 1))
  // ----------------------------------------- HELPFUL REQUEST -----------------------------------------
  helpful: (req, res) => {
    pool.query(`UPDATE reviews SET helpfulness = helpfulness + 1 WHERE review_id = $1`, [req.params.review_id])
    res.status(204).end()
  },

  // ----------------------------------------- REPORT REQUEST -----------------------------------------
  report: (req, res) => {
    pool.query(`UPDATE reviews SET reported = true WHERE review_id = $1`, [req.params.review_id])
      .then(() => res.status(204).send('lets make sure this works'))
  },

  // ----------------------------------------- TEST REQUEST -----------------------------------------
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