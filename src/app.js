import express from 'express';
import mongoose from 'mongoose';
import db from './configs/database.js';
import dotenv from 'dotenv';
import indexRoutes from './api/routes/index.js';
import cors from 'cors';

dotenv.config();


const app = express();

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: false }));

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(indexRoutes);

app.use((error, req, res, next) => {
    const { statusCode, message, data, validationErrors } = error;
    res.status(statusCode || 500).json({ message, data, validationErrors });
});

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => { console.log('DB connected');})