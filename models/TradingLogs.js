module.exports = (sequelize, Sequelize) => {
    const TradingLogs = sequelize.define(
        'log_tradingview',
        {
            id: {
                type: Sequelize.INTEGER,
                field: 'ID',
                primaryKey: true,
            },
            hash: {
                type: Sequelize.STRING,
                field: 'Hash'
            },
            typ: {
                type: Sequelize.STRING,
                field: 'Type'
            },
            amt: {
                type: Sequelize.NUMBER,
                field: 'Amount'
            },
            rat: {
                type: Sequelize.NUMBER,
                field: 'Rate'
            },
            fee: {
                type: Sequelize.NUMBER,
                field: 'Fee'
            },
            cre: {
                type: Sequelize.NUMBER,
                field: 'Credit'
            },
            rec: {
                type: Sequelize.NUMBER,
                field: 'Receive'
            },
            ts: {
                type: Sequelize.DATE,
                field: 'Timestamp'
            },
        },
        {
            timestamps: false,
            freezeTableName: true
        }
    );
    return TradingLogs;
};