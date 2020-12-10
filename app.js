require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const { sequelize } = require('./databases/bitkub');
const morgan = require('morgan');
const { LINE } = require('./utils/LINE');

require('console-stamp')(console, {
    pattern: 'dd/mm/yyyy HH:MM:ss.l',
    colors: {
        stamp: 'green',
        label: 'white',
    }
});

const isProduction = process.env.NODE_ENV === 'Production';

if (isProduction) {
    // Normal express config defaults
    morgan.token('remoteIP', (req) => req.headers['x-forwarded-for']);  // for display real host instead of container host, need to add more header in nginx
    app.use(morgan(':method :url :remoteIP :status :response-time ms - :res[content-length]'));
} else {
    app.use(cors({
        origin: ['http://localhost', 'http://localhost:3000'],
        optionsSuccessStatus: 200,
        credentials: true,
    }));
    app.use(morgan('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

app.use('/api', require('./routes/tradingview'));

app.listen(process.env.SERVER_PORT || 3000, async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        console.log(`Server has started at port ${process.env.SERVER_PORT}`);
        if (isProduction) LINE(`Server has started at port ${process.env.SERVER_PORT}`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
});
