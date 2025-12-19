const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'baza_kompania';

let _db = null;
let _client = null;

async function connectDB() {
  if (_db) return _db;
  _client = new MongoClient(MONGO_URI);
  await _client.connect();
  _db = _client.db(DB_NAME);
  console.log('Connected to MongoDB');
  return _db;
}

function getDb() {
  if (!_db) throw new Error('Database not initialized. Call connectDB first.');
  return _db;
}

module.exports = { connectDB, getDb };
