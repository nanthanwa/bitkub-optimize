require('dotenv').config();
const cors = require('cors');
const { Logs, Sequelize } = require('./databases/bitkub');
const express = require('express');
const app = express();

require('console-stamp')(console, {
    pattern: 'dd/mm/yyyy HH:MM:ss.l',
    colors: {
        stamp: 'green',
        label: 'white',
    }
});

const isProduction = process.env.NODE_ENV === 'Production';

app.use(cors({
    origin: ['https://nanmcpe.aileensoft.com', 'http://localhost', 'http://localhost:3000'],
    optionsSuccessStatus: 200,
    credentials: true,
}));

app.use(require('morgan')('dev'));

app.use('/api', require('./routes/tradingview'));

app.listen(process.env.SERVER_PORT || 3000, () => {
    console.log(`Server has started at port ${process.env.SERVER_PORT}`);
});
