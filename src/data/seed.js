const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'baza_kompania';

async function seed() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  console.log('Seed done');
  await client.close();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
