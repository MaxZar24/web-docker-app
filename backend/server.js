const express = require('express')
const bodyParser = require('body-parser')
const oracledb = require('oracledb')
const app = express()
const cors = require('cors');


app.use(cors());
app.use(express.json());

app.get('/api/checkConnection', (req, res) => {
    res.json({ connected: true });
});

app.listen(3001, () => {
    console.log("Server started success on port 3001")
})