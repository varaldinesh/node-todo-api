require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);

async function main() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        const db = client.db();
        const todosCollection = db.collection('todos');

        app.post('/todos', async (req, res) => {
            try {
                const todo = { text: req.body.text, completed: false };
                const result = await todosCollection.insertOne(todo);
                const insertedTodo = await todosCollection.findOne({ _id: result.insertedId });
                res.status(201).json(insertedTodo);
            } catch (error) {
                console.error("Error in POST route:", error);
                res.status(500).json({ error: error.message });
            }
        });

        app.get('/todos', async (req, res) => {
            try {
                const todos = await todosCollection.find({}).toArray();
                res.status(200).json(todos);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        app.put('/todos/:id', async (req, res) => {
            try {
                const id = new ObjectId(req.params.id);
                const updatedTodo = { $set: { text: req.body.text, completed: req.body.completed } };
                const result = await todosCollection.updateOne({ _id: id }, updatedTodo);

                if (result.matchedCount === 0) {
                    return res.status(404).json({ error: 'No todo found with that ID' });
                }

                const updatedItem = await todosCollection.findOne({ _id: id });
                res.json(updatedItem);
            } catch (error) {
                console.error("Error in PUT route:", error);
                res.status(500).json({ error: error.message });
            }
        });



        app.delete('/todos/:id', async (req, res) => {
            try {
                const id = new ObjectId(req.params.id);
                const result = await todosCollection.deleteOne({ _id: id });

                if (result.deletedCount === 0) {

                    return res.status(404).json({ error: 'No Todo Found with that ID' })
                }

                res.status(204).send();
            } catch (error) {

                console.error("Error in DELETE rout:", error);
                res.status(500).json({ error: error.message });

            }
        });

    } catch (error) {
        console.error(error);
    }
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    main().catch(console.error);
});
