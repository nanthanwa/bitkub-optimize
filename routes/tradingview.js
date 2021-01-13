const router = require('express').Router();
const { LINE } = require('../utils/LINE');
const { TradingViewLogs } = require('../databases/bitkub');
const { parseObject, getWallet, placeBid, placeAsk, cancelOrder } = require('../utils');

router.post('/tradingview/btcusd', async (req, res, next) => {
    try {
        console.log('TradingView has hooked');
        console.log('body', req.body);
        const obj = parseObject(req.body);
        console.log('obj', obj);
        await TradingViewLogs.create(obj);
        if (obj.side === 'buy') {
            const wallet = await getWallet();
            const thb = wallet.result.THB;
            const buyRatio = parseFloat(process.env.BUY_RATIO);
            const amountToBuy = parseFloat((thb * buyRatio).toFixed(2));
            console.log('amountToBuy', amountToBuy);
            const bid = await placeBid('THB_BTC', amountToBuy, 0, 'market'); // sym, amt, rat, type
            console.log('bid', bid);
            LINE(`Buy ${amountToBuy} BTC @ ${obj.close}`);
        }
        if (obj.side === 'sell') {
            const wallet = await getWallet();
            const btc = wallet.result.BTC;
            const buyRatio = parseFloat(process.env.SELL_RATIO);
            const amountToSell = btc * buyRatio;
            console.log('amountToSell', amountToSell);
            const ask = await placeAsk('THB_BTC', amountToSell, 0, 'market'); // sym, amt, rat, type => minimum is 0.0001 BTC
            console.log('ask', ask);
            LINE(`Sell ${amountToSell} BTC @ ${obj.close}`);
        }
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        LINE(err.message);
        res.sendStatus(200);
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
        const symbol = 'THB_BTC';
        const amount = 40;
        const rate = 2.5;
        const type = 'limit';
        const response = await placeBid(symbol, amount, rate, type);
        LINE(`Buy ${amount} BTC @ ${rate}`);
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
        const symbol = 'THB_BTC';
        const amount = 0001;
        const rate = 600000;
        const type = 'limit';
        const response = await placeAsk(symbol, amount, rate, type);
        LINE(`Sell ${amount} BTC @ ${rate}`);
        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            err: err.message
        });
    }
});

router.post('/cancel', async (req, res, next) => {
    try {
        const hash = 'fwQ6dnQYKnqB17qriRcuwRmhYVR';
        await cancelOrder(hash);
        LINE(`Cancel order: ${hash}`);
        res.json(response);
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

module.exports = router;
