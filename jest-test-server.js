const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, '.')));

app.listen(process.env.TEST_SERVER_PORT);
