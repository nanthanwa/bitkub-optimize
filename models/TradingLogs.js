module.exports = (sequelize, Sequelize) => {
    const TradingLogs = sequelize.define(
        'log_trading',
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
            sym: {
                type: Sequelize.ENUM('THB_BTC', 'THB_ETH', 'THB_WAN', 'THB_ADA', 'THB_OMG', 'THB_BCH', 'THB_USDT', 'THB_LTC', 'THB_XRP', 'THB_BSV', 'THB_ZIL', 'THB_SNT', 'THB_CVC', 'THB_LINK', 'THB_GNT', 'THB_IOST', 'THB_ZRX', 'THB_KNC', 'THB_ENG', 'THB_RDN', 'THB_ABT', 'THB_MANA', 'THB_INF', 'THB_CTXC', 'THB_XLM', 'THB_SIX', 'THB_JFIN', 'THB_EVX', 'THB_BNB', 'THB_POW', 'THB_DOGE', 'THB_DAI', 'THB_USDC', 'THB_BAT', 'THB_BAND', 'THB_KSM', 'THB_DOT', 'THB_NEAR'),
                field: 'Symbol'
            },
            side: {
                type: Sequelize.ENUM('buy', 'sell'),
                field: 'Side'
            },
            typ: {
                type: Sequelize.ENUM('limit', 'market'),
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