const router = require('express').Router();
const { Logs, Sequelize } = require('../databases/bitkub');

router.post('/tradingview/btcusd', async (req, res, next) => {
    try {
        console.log('TradingView has hooked [BTCUSD]');
        console.log('body', req.body);
        const text = req.body;
        text.split(',').forEach(item => {
            const key = item.trim().split('=')[0].trim();
            const value = item.trim().split('=')[1].trim();
            if (key === 'Volume' || key === 'Open' || key === 'High' || key === 'Low' || key === 'Close') {
                obj[key] = parseFloat(value);
            } else if (key === 'Time' || key === 'TimeNow') {
                obj[key] = moment(value);
            } else {
                obj[key] = value;
            }
        });
        console.log('obj', obj);
        // const logs = await Logs.create({ timestamp: new Date() });
        // await logs.save();
        // res.json(logs);
        res.sendStatus(200);
    } catch (err) {
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
