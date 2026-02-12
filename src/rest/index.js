
const express = require('express');

const routes = express.Router();
const app = express();

app.get('/status', (req, res) => {
  res.status(200).send({ status: 'OK' });
});

// Add more routes as needed

app.use(routes);

module.exports = app;
