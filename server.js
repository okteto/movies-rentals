const { json } = require('express');
const express = require('express');
const { MongoClient } = require('mongodb');
const http = require('http');

const app = express();
app.use(express.json());

const url = `mongodb://${process.env.MONGODB_USERNAME}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${process.env.MONGODB_HOST}:27017/${process.env.MONGODB_DATABASE}?authSource=admin`;

async function getCatalog() {
  return new Promise(done => {
    const req = http.request({
      hostname: 'catalog',
      path: '/catalog',
      port: '8080',
      method: 'GET'
    }, res => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        const response = JSON.parse(body);
        done(response);
      });
    });

    req.on('error', error => {
      console.error(`Failed to get movies catalog: ${error}`);
      done([]);
    });

    req.end();
  });
}

async function getRentals(db) {
  try {
    const rentals = await db.collection('rentals').find().toArray();
    return rentals;
  } catch (error) {
    console.error(`Failed to query rentals: ${error}`);
    return [];
  }
}

async function getExpandedRentals(db) {
  const rentals = await getRentals(db);
  const catalog = await getCatalog();
  const extended = rentals.map(rental => {
    const movie = catalog.find(m => m.id === rental.catalog_id);
    return movie ? {
      ...rental,
      price: 1 * movie.price,
      vote_average: movie.vote_average,
      original_title: movie.original_title,
      backdrop_path: movie.backdrop_path,
      overview: movie.overview
    } : null;
  }).filter(Boolean);
  return extended;
}

async function startWithRetry() {
  try {
    const client = new MongoClient(url, {
      connectTimeoutMS: 1000,
      socketTimeoutMS: 1000,
    });

    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(process.env.MONGODB_DATABASE);

    app.listen(8080, () => {
      app.get('/rentals/healthz', (_, res) => {
        res.sendStatus(200);
        return;
      });

      app.get('/rentals', async (_, res) => {
        console.log('GET /rentals');

        const rentals = await getExpandedRentals(db);
        res.json(rentals);
      });

      app.post('/rent', async (req, res) => {
        console.log(`POST /rent`);

        const rent = {
          _id: req.body?.catalog_id,
          id: req.body?.catalog_id,
          price: req.body?.price,
          catalog_id: req.body?.catalog_id
        };

        try {
          await db.collection('rentals').updateOne(
            { _id: rent._id },
            { $set: rent },
            { upsert: true }
          );
        } catch(err) {
          console.log(`Failed to rent: ${err}`);
        }
        res.json([]);
      });

      console.log('Server running on port 8080.');
    });
  } catch (err) {
    console.error(`Error connecting, retrying in 1 sec: ${err}`);
    setTimeout(startWithRetry, 1000);
  }
}

startWithRetry();