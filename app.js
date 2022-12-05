const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const MONGODB_SERVER_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.pfnzbiy.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use((error, req, res, next) => {
    const { statusCode, message, data, validationErrors } = err;
    res.status(statusCode || 500).json({ message, data, validationErrors });
});

mongoose
    .connect(MONGODB_SERVER_URL)
    .then(result => {
        app.listen(process.env.PORT || 8080);
        console.log('connected');
    })
    .catch(err => {
        console.log(err);
    });