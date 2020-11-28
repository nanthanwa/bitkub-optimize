const moment = require('moment');

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

module.exports = {
    parseObject
};