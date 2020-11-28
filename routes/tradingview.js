const router = require('express').Router();

const { Logs, Sequelize } = require('../databases/bitkub');
const { parseObject } = require('../utils');

router.post('/tradingview/btcusd', async (req, res, next) => {
    try {
        console.log('TradingView has hooked [BTCUSD]');
        console.log('body', req.body);
        const obj = parseObject(req.body);
        console.log('obj', obj);
        await Logs.create({
            timestamp: new Date().toISOString(),
            exchange: obj.Exchange,
            ticker: obj.Ticker,
            open: obj.Open,
            close: obj.Close,
            high: obj.High,
            low: obj.Low,
            volume: obj.Volume,
        });
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            err: err.message
        });
    }
});

router.get('/hello', async (req, res, next) => {
    try {
        res.json({
            msg: 'Hello!'
        });
    } catch (err) {
        res.status(500).json({
            err: err.message
        });
    }
});

router.get('/logs', async (req, res, next) => {
    try {
        const offset = req.query.offset ? parseInt(req.query.offset) : 0;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const logs = await Logs.findAll({
            offset: offset,
            limit: limit
        });
        res.json(logs);
    } catch (err) {
        res.status(500).json({
            err: err.message
        });
    }
});

router.post('/logs', async (req, res, next) => {
    try {
        const logs = await Logs.create({ timestamp: new Date() });
        await logs.save();
        res.json(logs);
    } catch (err) {
        res.status(500).json({
            err: err.message
        });
    }
});

module.exports = router;
