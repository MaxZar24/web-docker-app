const express = require('express')
const bodyParser = require('body-parser')
const oracledb = require('oracledb')
const mongoose = require('mongoose');
const Order = require("./models");

const app = express()

const url = 'mongodb+srv://admin:1234@cluster0.smqleka.mongodb.net/orders?retryWrites=true&w=majority';

const dbConfig = {
    user: 'test',
    password: '1',
    connectString: 'localhost:1521',
};

mongoose
    .connect(url)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/signup', async (req, res) => {
    const {username, email, password} = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);
        const check_user = await connection.execute(
            `SELECT * FROM users WHERE email = :1 AND password = :2`,
            [email, password]
        );

        if (check_user.rows.length > 0) {
            res.status(400).json({error: 'Can`t create new user! Email already used.'});
        } else {
            await connection.execute(
                `INSERT INTO users (username, email, password) VALUES (:1, :2, :3)`,
                [username, email, password],
                {autoCommit: true}
            );
            await connection.close();
            res.status(200).json({message: 'Data received and stored successfully!'});
        }

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

app.post('/login', async (req, res) => {
        const {email, password} = req.body;

        try {
            const connection = await oracledb.getConnection(dbConfig);
            const result = await connection.execute(
                `SELECT * FROM users WHERE email = :email AND password = :password`,
                {email, password}
            );

            if (result.rows.length > 0) {
                const userData = {
                    username: result.rows[0][0],
                    email: result.rows[0][1],
                    password: result.rows[0][2],
                };
                res.status(200).json({message: 'Success logging', user: userData});
            } else {
                res.status(400).json({error: 'Incorrect login or password'});
            }

            await connection.close();
        } catch
            (error) {
            console.error('Error:', error.message);
            res.status(500).send('Internal Server Error');
        }
    }
);


app.post('/change-username', async (req, res) => {
    let {email, username} = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);
        const updateResult = await connection.execute(
            `UPDATE users SET username = :username WHERE email = :email`,
            {username, email},
            {autoCommit: true}
        );

        if (updateResult.rowsAffected > 0) {
            res.status(200).json({message: 'Username successfully updated'});
        } else {
            res.status(404).json({error: 'User not found'});
        }

        await connection.close();
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/change-password', async (req, res) => {
    let {email, password} = req.body;

    try {
        const connection = await oracledb.getConnection(dbConfig);
        const updateResult = await connection.execute(
            `UPDATE users SET password = :password WHERE email = :email`,
            {password, email},
            {autoCommit: true}
        );

        if (updateResult.rowsAffected > 0) {
            res.status(200).json({message: 'Password successfully updated'});
        } else {
            res.status(404).json({error: 'User not found'});
        }

        await connection.close();
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
        res.json(orders);
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
        res.status(500).json({message: error.message});
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
