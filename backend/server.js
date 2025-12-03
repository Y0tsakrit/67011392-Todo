// server.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;


app.use(cors()); 
app.use(express.json());


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL Database.');
});


app.post('/api/login', (req, res) => {
   
    const { username } = req.body;
    if (!username) {
        return res.status(400).send({ message: 'Username is required' });
    }

    res.send({ 
        success: true, 
        message: 'Login successful', 
        user: { username: username }
    });
});


app.get('/api/todos/:username', (req, res) => {
    const { username } = req.params;
    const sql = 'SELECT id, task, done, updated FROM todo WHERE username = ? ORDER BY id DESC';
    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/api/todos', (req, res) => {
    const { username, task } = req.body;
    if (!username || !task) {
        return res.status(400).send({ message: 'Username and task are required' });
    }

    const sql = 'INSERT INTO todo (username, task) VALUES (?, ?)';
    db.query(sql, [username, task], (err, result) => {
        if (err) return res.status(500).send(err);
       
        res.status(201).send({ id: result.insertId, username, task, done: 0, updated: new Date() });
    });
});

app.put('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const { done } = req.body; 
    
    const sql = 'UPDATE todo SET done = ? WHERE id = ?';
    db.query(sql, [done, id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Todo not found' });
        }
        res.send({ message: 'Todo updated successfully' });
    });
});

app.delete('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM todo WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Todo not found' });
        }
        res.send({ message: 'Todo deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});