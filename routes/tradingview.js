const router = require('express').Router();
const { Logs, Sequelize } = require('../databases/bitkub');

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

module.exports = router;
