const moment = require('moment');
const axios = require('axios');
const crypto = require("crypto");

function parseObject(text) {
    let obj = {};
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
    return obj;
}

function signBody(body) {
    const digest = crypto.createHmac('sha256', process.env.API_SECRET)
        .update(JSON.stringify(body))
        .digest('hex');
    return digest;
}

module.exports = {
    parseObject,
    signBody
};