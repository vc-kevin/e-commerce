const express = require('express');
const mongoDbConnection = require('./config/db');
const router = require('./routes/index');
const cors = require('cors');

const app = express();

mongoDbConnection();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
const port = 3333;
app.listen(port, () => {
  console.log(`The server is listening on port ${port}`);
});