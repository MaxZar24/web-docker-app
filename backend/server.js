// server.js

const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const cors = require('cors');

const app = express();
const PORT = 3001;
let userEmail = '';

app.use(cors());
app.use(bodyParser.json());

// OracleDB connection configuration
const dbConfig = {
    user: 'test11',
    password: '11',
    connectString: 'localhost:1521/xe',
};

// Endpoint for user signup
app.post('/signup', async (req, res) => {
    const username = req.body.username[0];
    const email = req.body.email[0];
    const password = req.body.password[0];

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
            console.log(`Received data: Name - ${username}, Email - ${email}, Password - ${password}`);

            await connection.close();

            res.status(200).json({message: 'Data received and stored successfully!'});
        }
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({success: false, error: 'Internal Server Error'});
    }
});

app.post('/login', async (req, res) => {
        const email = req.body.email[0];
        const password = req.body.password[0];

        try {
            const connection = await oracledb.getConnection(dbConfig);
            const result = await connection.execute(
                `SELECT * FROM users WHERE email = :email AND password = :password`,
                {email, password}
            );

            if (result.rows.length > 0) {
                const userData = {
                    username: result.rows[0][1],
                    email: result.rows[0][2],
                    password: result.rows[0][3]
                };
                userEmail = email;
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

app.post('/', async (req, res) => {
    try {
        // Get a connection from the pool
        const connection = await oracledb.getConnection(dbConfig);

        // Query to get user information based on userId
        const query = `SELECT * FROM users WHERE email = :email`;
        const result = await connection.execute(query, [userEmail], { outFormat: oracledb.OUT_FORMAT_OBJECT });


        // Release the connection
        await connection.close();
        // console.log(result.rows[0])
        // Send the user information as JSON response
        res.status(200).json({message: 'Success logging', user: result.rows[0]});
    } catch (error) {
        console.error('Error retrieving user information:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
