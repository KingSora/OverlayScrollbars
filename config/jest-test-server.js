const express = require('express');
const deploymentConfig = require('./jest-puppeteer.rollup.config.js');

const app = express();

app.use(express.static(deploymentConfig.root));
app.listen(deploymentConfig.port);
