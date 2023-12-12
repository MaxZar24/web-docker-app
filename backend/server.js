const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
const Order = require("./models");

const app = express()

const url = 'mongodb://172.17.0.5:27017/orders?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.1';

const mysqlConfig = {
    host: 'localhost:3036',
    user: 'test',
    password: '1234',
    database: 'usersdb',
};

mongoose
    .connect(url)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


const pool = mysql.createPool(mysqlConfig);

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password]
        );

        if (rows.length > 0) {
            res.status(400).json({ error: 'Can`t create new user! Email already used.' });
        } else {
            await connection.execute(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, password]
            );
            await connection.release();
            res.status(200).json({ message: 'Data received and stored successfully!' });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password]
        );

        if (rows.length > 0) {
            const userData = {
                username: rows[0].username,
                email: rows[0].email,
                password: rows[0].password,
            };
            res.status(200).json({ message: 'Success logging', user: userData });
        } else {
            res.status(400).json({ error: 'Incorrect login or password' });
        }

        await connection.release();
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/change-username', async (req, res) => {
    let { email, username } = req.body;

    try {
        const connection = await pool.getConnection();
        const [updateResult] = await connection.execute(
            'UPDATE users SET username = ? WHERE email = ?',
            [username, email]
        );

        if (updateResult.affectedRows > 0) {
            res.status(200).json({ message: 'Username successfully updated' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }

        await connection.release();
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/change-password', async (req, res) => {
    let { email, password } = req.body;

    try {
        const connection = await pool.getConnection();
        const [updateResult] = await connection.execute(
            'UPDATE users SET password = ? WHERE email = ?',
            [password, email]
        );

        if (updateResult.affectedRows > 0) {
            res.status(200).json({ message: 'Password successfully updated' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }

        await connection.release();
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


app.get("/get-orders", async (req, res) => {
    try {
        const userEmail = req.query.user;

        if (!userEmail) {
            return res.status(400).json({message: "Email is not specified"});
        }

        const orders = await Order.find({user: userEmail});
        res.json({userEmail, orders});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

app.post('/create-order', async (req, res) => {
    try {
        const {name, date, category, price, amount, user} = req.body;

        const newOrder = await Order.create({
            name,
            date,
            category,
            price,
            amount,
            user
        });

        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.patch('/update-order/:id', async (req, res) => {
    const orderId = req.params.id;

    try {
        const {name, date, category, price, amount, user} = req.body;

        const newOrder = await Order.updateOne({
            _id: orderId,
        }, {
            name,
            date,
            category,
            price,
            amount,
            user
        });

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


app.delete("/remove-order/:id", async (req, res) => {
    const orderId = req.params.id;

    try {
        const deletedOrder = await Order.findOneAndDelete({_id: orderId});

        if (!deletedOrder) {
            return res.status(404).json({message: "Order not found"});
        }

        res.json({message: "The order was successfully deleted", deletedOrder});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
});


app.listen(3001, () => {
    console.log("Server started success on port 3001")
})
