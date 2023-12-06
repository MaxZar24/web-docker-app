const express = require('express')
const bodyParser = require('body-parser')
const oracledb = require('oracledb')
const app = express()

const dbConfig = {
    user: 'mkr',
    password: '2404',
    connectString: 'localhost:1521',
};

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



app.listen(3001, () => {
    console.log("Server started success on port 3001")
})