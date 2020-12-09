const router = require('express').Router();
const { signBody } = require('../utils');
const moment = require('moment');
const axios = require('axios');
const { Logs, Sequelize } = require('../databases/bitkub');
const { parseObject, getErrorDescription } = require('../utils');

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

router.get('/wallet', async (req, res, next) => {
    try {
        let body = {
            ts: moment().unix()
        };
        const signedBody = signBody(body);
        body.sig = signedBody;
        const response = await axios({
            method: 'post',
            url: `${process.env.BITKUB_ROOT_URL}/api/market/wallet`,
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'X-BTK-APIKEY': `${process.env.API_KEY}`
            },
            data: body,
        }).then(res => res.data);;
        console.log('response', response);
        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            err: err.message
        });
    }
});

router.get('/buy', async (req, res, next) => {
    try {
        let body = {
            sym: 'THB_BTC',
            amt: 40, // THB no trailing zero 
            rat: 2.5, // for market order use 0
            typ: 'limit',
            ts: moment().unix()
        };
        const signedBody = signBody(body);
        body.sig = signedBody;
        const response = await axios({
            method: 'post',
            url: `${process.env.BITKUB_ROOT_URL}/api/market/place-bid`,
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'X-BTK-APIKEY': `${process.env.API_KEY}`
            },
            data: body,
        }).then(res => res.data);;
        console.log('response', response);
        if (response.error !== 0) {
            const errMessage = getErrorDescription(response.error);
            console.log('message', errMessage);
            res.status(500).json({
                error: response.error,
                message: errMessage
            });
        } else {
            res.json(response.result);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            err: err.message
        });
    }
});

router.get('/sell', async (req, res, next) => {
    try {
        let body = {
            sym: 'THB_BTC',
            amt: 0.0001, // BTC no trailing zero 
            rat: 600000, // for market order use 0
            typ: 'limit',
            ts: moment().unix()
        };
        const signedBody = signBody(body);
        body.sig = signedBody;
        const response = await axios({
            method: 'post',
            url: `${process.env.BITKUB_ROOT_URL}/api/market/place-ask`,
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'X-BTK-APIKEY': `${process.env.API_KEY}`
            },
            data: body,
        }).then(res => res.data);;
        console.log('response', response);
        if (response.error !== 0) {
            const errMessage = getErrorDescription(response.error);
            console.log('message', errMessage);
            res.status(500).json({
                error: response.error,
                message: errMessage
            });
        } else {
            res.json(response.result);
        }
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
        console.error(err);
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
