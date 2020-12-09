const router = require('express').Router();
const { signBody } = require('../utils');
const moment = require('moment');
const axios = require('axios');
const { TradingViewLogs, TradingLogs, Sequelize } = require('../databases/bitkub');
const { parseObject, getErrorDescription, getWallet, placeBid } = require('../utils');

router.post('/tradingview/btcusd', async (req, res, next) => {
    try {
        console.log('TradingView has hooked [BTCUSD]');
        console.log('body', req.body);
        const obj = parseObject(req.body);
        console.log('obj', obj);
        await TradingViewLogs.create({
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

router.post('/test/buy', async (req, res, next) => {
    try {
        const wallet = await getWallet();
        const thb = wallet.result.THB;
        const buyRatio = process.env.BUY_RATIO;
        const amountToBuy = parseFloat((thb * buyRatio).toFixed(2));
        console.log('amountToBuy', amountToBuy);
        const bid = await placeBid('THB_BTC', amountToBuy, 0, 'market'); // sym, amt, rat, type
        res.json(bid);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            err: err.message
        });
    }
});

router.get('/wallet', async (req, res, next) => {
    try {
        const response = await getWallet();
        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            err: err.message
        });
    }
});

router.post('/buy', async (req, res, next) => {
    try {
        const response = await placeBid('THB_BTC', 40, 2.5, 'limit'); // sym, amt, rat, type
        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            err: err.message
        });
    }
});

router.post('/sell', async (req, res, next) => {
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
            response.result.ts = response.result.ts * 1000; // emit millisecond
            await TradingLogs.create(response.result);
            res.json(response.result);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            err: err.message
        });
    }
});

router.post('/cancel', async (req, res, next) => {
    try {
        let body = {
            hash: 'fwQ6dnQYKnqB17qriRcuwRmhYVR',
            ts: moment().unix()
        };
        const signedBody = signBody(body);
        body.sig = signedBody;
        const response = await axios({
            method: 'post',
            url: `${process.env.BITKUB_ROOT_URL}/api/market/cancel-order`,
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
            res.json({ msg: success }); // no response payload from Bitkub's server
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
        const logs = await TradingViewLogs.findAll({
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
        const logs = await TradingViewLogs.create({ timestamp: new Date() });
        await logs.save();
        res.json(logs);
    } catch (err) {
        res.status(500).json({
            err: err.message
        });
    }
});

module.exports = router;
