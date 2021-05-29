require("dotenv").config({ path: "./config/config.env" });
const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require("path");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const PORT = process.env.PORT || 3000;

//routes
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(routes);
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

connectDB();

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});


// app.use(express.static(path.join(__dirname, 'build')));


// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
