const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoUri = process.env.MONGO_URI;
const appPort = process.env.APP_PORT;
const helmet = require('helmet')
const morgan = require('morgan')

const feedRoutes = require('./src/routes/feed');
const authRoutes = require('./src/routes/auth');

const app = express();

app.use(helmet());
app.use(morgan('combined'));

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data })
});

mongoose.connect(mongoUri, { useNewUrlParser: true }).then(result => {
    app.listen(appPort || 8080)
}).catch(err => console.log(err));
