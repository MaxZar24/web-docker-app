const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2');
const mongoose = require('mongoose');
let Order = require("./models");
const waitPort = require('wait-port');

const app = express()
//
// const url = 'mongodb://adm:adm@mongo-db:27017/web-docker-app?authSource=admin';
//
// const mysqlConfig = {
//     host: 'mysql-db',
//     user: 'test',
//     password: '1234',
//     database: 'usersdb',
//     port: 3306,
// }

const url = 'mongodb+srv://admin:1234@cluster0.smqleka.mongodb.net/orders?retryWrites=true&w=majority';

const mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'signup',
};

mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB error', err));
// mongoose.connect(url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     usePromises: true,
// });
// Order = mongoose.model('Order', {
//     usePromises: true,
// });



const connection = mysql.createConnection(mysqlConfig);

waitPort({host: 'mysql-db', port: 3306})
    .then(() => {
        connection.connect((err) => {
            if (err) {
                console.error('Error connecting to database:', err);
                return;
            }
            console.log('Connected to the database');

            connection.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    photo LONGBLOB
                );
            `, (createTableErr) => {
                if (createTableErr) {
                    console.error('Error creating "users" table:', createTableErr);
                } else {
                    console.log('Table "users" created successfully');
                }
            });
        });
    })
    .catch((err) => {
        console.error('Error waiting for the database port:', err);
    });

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.post('/signup', (req, res) => {
    const {username, email, password} = req.body;
    connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (selectError, selectResults) => {
            if (selectError) {
                console.error('Error selecting from database:', selectError);
                res.status(500).json({error: 'Internal Server Error'});
                return;
            }

            if (selectResults.length > 0) {
                res.status(400).json({error: 'Cannot create a new user. Email already used.'});
            } else {
                connection.query(
                    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                    [username, email, password],
                    (insertError) => {
                        if (insertError) {
                            console.error('Error inserting into database:', insertError);
                            res.status(500).json({error: 'Internal Server Error'});
                            return;
                        }

                        res.status(200).json({message: 'User created successfully!'});
                    }
                );
            }
        }
    );
});

app.post('/login', (req, res) => {
    const {email, password} = req.body;

    connection.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (err, rows) => {
            if (err) {
                console.error('Error selecting from database:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (rows.length > 0) {
                const userData = {
                    username: rows[0].username,
                    email: rows[0].email,
                    password: rows[0].password,
                    photo: rows[0].photo,
                };
                res.status(200).json({message: 'Success logging', user: userData});
            } else {
                res.status(400).json({error: 'Incorrect login or password'});
            }
        }
    );
});

app.post('/change-username', (req, res) => {
    const {email, username} = req.body;

    connection.query(
        'UPDATE users SET username = ? WHERE email = ?',
        [username, email],
        (err, updateResult) => {
            if (err) {
                console.error('Error updating username:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (updateResult.affectedRows > 0) {
                res.status(200).json({message: 'Username successfully updated'});
            } else {
                res.status(404).json({error: 'User not found'});
            }
        }
    );
});

app.post('/change-password', (req, res) => {
    const {email, password} = req.body;

    connection.query(
        'UPDATE users SET password = ? WHERE email = ?',
        [password, email],
        (err, updateResult) => {
            if (err) {
                console.error('Error updating password:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (updateResult.affectedRows > 0) {
                res.status(200).json({message: 'Password successfully updated'});
            } else {
                res.status(404).json({error: 'User not found'});
            }
        }
    );
});

app.post('/change-photo', (req, res) => {
    const {email, photo} = req.body;

    connection.query(
        'UPDATE users SET photo = ? WHERE email = ?',
        [photo, email],
        (err, updateResult) => {
            if (err) {
                console.error('Error updating photo:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            if (updateResult.affectedRows > 0) {
                res.status(200).json({message: 'Photo successfully updated'});
            } else {
                res.status(404).json({error: 'User not found'});
            }
        }
    );
});


app.get("/get-orders", async (req, res) => {
    const userEmail = req.query.user;

    if (!userEmail) {
        return res.status(400).json({ message: "Email is not specified" });
    }

    try {
        const orders = await Order.find({ user: userEmail }).exec();
        res.json({ userEmail, orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.post('/create-order', async (req, res) => {
    const { name, date, category, price, amount, user } = req.body;

    try {
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
    const { name, date, category, price, amount, user } = req.body;

    try {
        const updatedOrder = await Order.updateOne(
            { _id: orderId },
            {
                name,
                date,
                category,
                price,
                amount,
                user
            }
        );
        res.status(201).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.delete("/remove-order/:id", async (req, res) => {
    const orderId = req.params.id;

    try {
        const deletedOrder = await Order.findOneAndDelete({ _id: orderId }).exec();

        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ message: "The order was successfully deleted", deletedOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


app.listen(3001, () => {
    console.log("Server started success on port 3001")
})
