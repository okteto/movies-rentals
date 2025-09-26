const { MongoClient } = require("mongodb");

const url = `mongodb://${process.env.MONGODB_USERNAME}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@${process.env.MONGODB_HOST}:27017/${process.env.MONGODB_DATABASE}`;

async function insert(collection, data) {
  const d = require(data);
  d.results.forEach((doc) => {
    doc._id = doc.id;
  });
  try {
    await collection.insertMany(d.results);
  } catch (err) {
    if (err.code !== 11000) {
      throw err;
    }
    // Ignore duplicate key errors (11000)
  }
}

async function loadWithRetry() {
  try {
    const client = new MongoClient(url, {
      connectTimeoutMS: 300,
      socketTimeoutMS: 300,
    });

    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(process.env.MONGODB_DATABASE);

    await insert(db.collection('rentals'), "./data/rentals.json");

    console.log('all loaded');
    await client.close();
    process.exit(0);
  } catch (err) {
    console.error(`Error connecting, retrying in 300 msec: ${err}`);
    setTimeout(loadWithRetry, 300);
  }
}

loadWithRetry();
