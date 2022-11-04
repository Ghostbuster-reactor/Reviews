const Pool = require('pg').Pool
const pool = new Pool({
  // user: 'me',
  host: 'localhost',
  database: 'reviewsdb',
  // password: 'password',
  port: 5432,
})

// set up, set to false to turn off, comment things out if you only need specifics
if (true) {
  // pool.query(`CREATE TABLE IF NOT EXISTS reviews (
  // review_id SERIAL PRIMARY KEY NOT NULL, product_id INT, rating INT, date BIGINT, summary VARCHAR(500), body VARCHAR(1000), recommend BOOLEAN, reported BOOLEAN DEFAULT false, reviewer_name VARCHAR(500), reviewer_email VARCHAR(500), response VARCHAR(1000), helpfulness INT DEFAULT 0
  // );`, (err) => { if (err) throw err })

  // COPY reviews(review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '/Users/randy/hackreactor/SDC/CSV/reviews.csv' DELIMITER ',' CSV HEADER;

  // pool.query(`CREATE TABLE IF NOT EXISTS meta (
  // id SERIAL PRIMARY KEY NOT NULL, characteristic_id INT, review_id INT REFERENCES reviews (review_id), value INT
  // )`, (err) => { if (err) throw err })

  //COPY meta(id, characteristic_id, review_id, value)
  //FROM '/Users/randy/hackreactor/SDC/CSV/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

  // pool.query(`CREATE TABLE IF NOT EXISTS photos(
  //   id SERIAL PRIMARY KEY NOT NULL, review_id INT REFERENCES reviews (review_id), url VARCHAR(200)
  // )`, (err) => { if (err) throw err })

  // COPY photos (id, review_id, url)
  // FROM '/Users/randy/hackreactor/SDC/CSV/reviews_photos.csv' DELIMITER ',' CSV HEADER;

  // pool.query(`SELECT review_id FROM reviews`, (err, result1) => {
  //   if (err) throw err
  //   for (i of result1.rows) {
  //     pool.query(`SELECT id, url FROM photos WHERE review_id = ${i.review_id}`, (err, result2) => {
  //       if (err) throw err
  //       if (result2.rows.length > 0) {
  //         let test = `ARRAY['{"id":${result2.rows[0].id}, "url": "${result2.rows[0].url}"}']`
  //         console.log(test)
  //         pool.query(`UPDATE reviews SET photos = array_append(photos,${test}) WHERE review_id = ${i.review_id}`)
  //       }
  //     })
  //   }
  //   console.log('photos updated successfully')
  // })
}
module.exports = pool
