const express = require('express');
const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
let todos = []; // This will act as a simple in-memory database

// GET - Read all todos
app.get('/todos', (req, res) => {
    res.json(todos);
});

// POST - Create a new todo
app.post('/todos', (req, res) => {
    const todo = {
        id: Date.now(), // simple ID generation
        text: req.body.text,
    };
    todos.push(todo);
    res.status(201).json(todo);
});

