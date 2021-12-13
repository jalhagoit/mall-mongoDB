"use strict";

const express = require('express'),
    app = express(),
    dotenv = require('dotenv'),
    mongoose = require('mongoose'),
    morgan = require('morgan');

dotenv.config();

const authRoute = require('./routes/auth'),
    productRoute = require('./routes/product');

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("몽고DB 연결 성공!"))
    .catch((err) => {
        console.log(err);
    });

// 미들웨어
app.use(express.json());
app.use(morgan('common'));

app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);


const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`${port}포트에서 백엔드 서버 실행`);
});