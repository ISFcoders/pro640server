const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('./routes/api');
const apiAuth = require('./routes/api-auth');

const PORT = 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', api);
app.use('/api/auth', apiAuth);

app.get('/', (req, res) => {
    res.send('ISF640 backend server');
});

app.listen(PORT, () => {
    console.log('Server running on localhost: ' + PORT);
});