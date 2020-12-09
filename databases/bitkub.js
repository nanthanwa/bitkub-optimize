const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_SQL_DB, process.env.DB_SQL_USER, process.env.DB_SQL_PASS, {
    host: process.env.DB_SQL_HOST,
    port: process.env.DB_SQL_PORT,
    dialect: 'mariadb',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        collate: 'utf8_general_ci',
        useUTC: false,
        timezone: 'Etc/GMT+7'
    },
    timezone: 'Etc/GMT+7',
    logging: false,
    query: { raw: true },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//import model
db.TradingViewLogs = require('../models/TradingViewLogs')(sequelize, Sequelize);
db.TradingLogs = require('../models/TradingLogs')(sequelize, Sequelize);
module.exports = db;