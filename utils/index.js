const axios = require('axios');
const crypto = require("crypto");
const { TradingLogs } = require('../databases/bitkub');
const { getTime } = require('date-fns');

function parseObject(text) {
    let obj = {};
    text.split(',').forEach(item => {
        const key = item.trim().split('=')[0].trim();
        const value = item.trim().split('=')[1].trim();
        if (key === 'volume' || key === 'open' || key === 'high' || key === 'low' || key === 'close') {
            obj[key] = parseFloat(value);
        } else if (key === 'timestamp') {
            obj[key] = new Date(value);
        } else {
            obj[key] = value;
        }
    });
    return obj;
}

function signBody(body) {
    const digest = crypto.createHmac('sha256', process.env.API_SECRET)
        .update(JSON.stringify(body))
        .digest('hex');
    return digest;
}

function getErrorDescription(errCode) {
    switch (errCode) {
        case 0: return 'No error';
        case 1: return 'Invalid JSON payload';
        case 2: return 'Missing X-BTK-APIKEY';
        case 3: return 'Invalid API key';
        case 4: return 'API pending for activation';
        case 5: return 'IP not allowed';
        case 6: return 'Missing / invalid signature';
        case 7: return 'Missing timestamp';
        case 8: return 'Invalid timestamp';
        case 9: return 'Invalid user';
        case 10: return 'Invalid parameter';
        case 11: return 'Invalid symbol';
        case 12: return 'Invalid amount';
        case 13: return 'Invalid rate';
        case 14: return 'Improper rate';
        case 15: return 'Amount too low';
        case 16: return 'Failed to get balance';
        case 17: return 'Wallet is empty';
        case 18: return 'Insufficient balance';
        case 19: return 'Failed to insert order into db';
        case 20: return 'Failed to deduct balance';
        case 21: return 'Invalid order for cancellation';
        case 22: return 'Invalid side';
        case 23: return 'Failed to update order status';
        case 24: return 'Invalid order for lookup (or cancelled)';
        case 25: return 'KYC level 1 is required to proceed';
        case 30: return 'Limit exceeds';
        case 40: return 'Pending withdrawal exists';
        case 41: return 'Invalid currency for withdrawal';
        case 42: return 'Address is not in whitelist';
        case 43: return 'Failed to deduct crypto';
        case 44: return 'Failed to create withdrawal record';
        case 45: return 'Nonce has to be numeric';
        case 46: return 'Invalid nonce';
        case 47: return 'Withdrawal limit exceeds';
        case 48: return 'Invalid bank account';
        case 49: return 'Bank limit exceeds';
        case 50: return 'Pending withdrawal exists';
        case 51: return 'Withdrawal is under maintenance';
        case 90: return 'Server error (please contact support)';
    }
}

function getWallet() {
    return new Promise(async (resolve, reject) => {
        try {
            let body = {
                ts: Math.floor(getTime(new Date()) / 1000)
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
            resolve(response);
        } catch (err) {
            reject(err);
        }
    });
}

function placeBid(symbol, amount, rate, type) {
    return new Promise(async (resolve, reject) => {
        try {
            let body = {
                sym: symbol,
                amt: amount, // THB no trailing zero 
                rat: rate, // for market order use 0
                typ: type,
                ts: Math.floor(getTime(new Date()) / 1000)
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
                reject({
                    error: response.error,
                    message: errMessage
                });
            } else {
                response.result.ts = response.result.ts * 1000; // emit millisecond
                response.result.side = 'buy';
                response.result.sym = symbol;
                await TradingLogs.create(response.result);
                resolve(response.result);
            }
        } catch (err) {
            reject(err);
        }
    });
}

function placeAsk(symbol, amount, rate, type) {
    return new Promise(async (resolve, reject) => {
        try {
            let body = {
                sym: symbol,
                amt: amount, // BTC no trailing zero 
                rat: rate, // for market order use 0
                typ: type,
                ts: Math.floor(getTime(new Date()) / 1000)
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
                reject({
                    error: response.error,
                    message: errMessage
                });
            } else {
                response.result.ts = response.result.ts * 1000; // emit millisecond
                response.result.side = 'sell';
                response.result.sym = symbol;
                await TradingLogs.create(response.result);
                resolve(response.result);
            }
        } catch (err) {
            reject(err);
        }
    });
}

function cancelOrder(hash) {
    return new Promise(async (resolve, reject) => {
        try {
            let body = {
                hash: hash,
                ts: Math.floor(getTime(new Date()) / 1000),
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
            }).then(res => res.data);
            console.log('response', response);
            if (response.error !== 0) {
                const errMessage = getErrorDescription(response.error);
                console.log('message', errMessage);
                reject({
                    error: response.error,
                    message: errMessage
                });
            } else {
                resolve({ msg: 'success' }); // no response payload from Bitkub's server
            }
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    parseObject,
    getErrorDescription,
    signBody,
    getWallet,
    placeBid,
    placeAsk,
    cancelOrder,
};