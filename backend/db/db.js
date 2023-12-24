const mysql = require('mysql2');
const mongoose = require('mongoose');
const waitPort = require('wait-port');


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
    password: '1234',
    database: 'users',
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

waitPort({host: 'localhost', port: 3306})
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
                    mimetype VARCHAR(255),
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

module.exports = connection;
