module.exports = (sequelize, Sequelize) => {
    const Logs = sequelize.define(
        'Logs',
        {
            triggerID: {
                type: Sequelize.INTEGER,
                field: 'TriggerID',
                autoIncrement: true,
                primaryKey: true,
            },
            timestamp: {
                type: Sequelize.DATE,
                field: 'Timestamp'
            },
            exchange: {
                type: Sequelize.STRING,
                field: 'Exchange'
            },
            ticker: {
                type: Sequelize.STRING,
                field: 'Ticker'
            },
            open: {
                type: Sequelize.NUMBER,
                field: 'Open'
            },
            close: {
                type: Sequelize.NUMBER,
                field: 'Close'
            },
            high: {
                type: Sequelize.NUMBER,
                field: 'High'
            },
            low: {
                type: Sequelize.NUMBER,
                field: 'Low'
            },
            volume: {
                type: Sequelize.NUMBER,
                field: 'Volume'
            },
        },
        {
            timestamps: false,
            freezeTableName: true
        }
    );
    return Logs;
};