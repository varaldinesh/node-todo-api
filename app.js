require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;

const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });


async function main() {

    try {

        await client.connect();
        console.log('Connected to MongoDB Atlas');
        const db = client.db();

    } catch (error) {

        console.error(error);

    } finally {
        await client.close();
    }
}