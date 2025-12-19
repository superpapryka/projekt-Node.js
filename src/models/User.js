// src/models/User.js
const { ObjectId } = require('mongodb');
const { getDb } = require('../data/connection');

const COLLECTION = 'users';

async function znajdzPoNazwie(nazwa) {
    const db = getDb();
    if (!nazwa) return null;
    return db.collection(COLLECTION).findOne({ nazwa: String(nazwa).toLowerCase() });
}

async function findById(id) {
    const db = getDb();
    return db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
}

async function createUser({ nazwa, passwordHash }) {
    const db = getDb();
    const doc = {
        nazwa: String(nazwa).toLowerCase(),
        password: passwordHash,
        createdAt: new Date()
    };
    const result = await db.collection(COLLECTION).insertOne(doc);
    return result.insertedId;
}

module.exports = {
    znajdzPoNazwie,
    findById,
    createUser
};
