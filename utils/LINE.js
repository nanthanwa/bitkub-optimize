const axios = require('axios');
const qs = require('qs');

function LINE(message) {
    return new Promise(async (resolve, reject) => {
        console.log('Sent notification', message);
        try {
            const response = await axios({
                method: 'post',
                url: 'https://notify-api.line.me/api/notify',
                headers: {
                    'Authorization': 'Bearer ' + process.env.LINE_TOKEN,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: qs.stringify({ message })
            }).then(res => res.data);;
            resolve(response);
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    LINE
};
