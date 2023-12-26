const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const routes = require('./routes/routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes);



app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server started successfully on port ${PORT}`);
});
