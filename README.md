# bitkub-optimize
![CodeQL](https://github.com/nanmcpe/bitkub-optimize/workflows/CodeQL/badge.svg)

Node.JS trading bot for [Bitkub.com](https://bitkub.com) using [TradingView](https://tradingview.com) webhook.

![](https://smartadvicefordumbmillennials.com/wp-content/uploads/2017/10/wolf_of_wall_street_money.gif)

## TODO (PR-Welcomed)
- Replace moment.js with [date-fns](https://github.com/date-fns/date-fns).
- Add stop-limit order feature (waiting for Bitkub releases this API, [see more](https://github.com/bitkub/bitkub-official-api-docs/issues/24)).
- Add trailing stop order feature (after stop-limit order API is released).

## Strategy
- Buying or selling signals will be triggered from TradingView, we should setup at TradingView side. 
#### This is some strategies that we can configurable
- Buy BTC using 90% of THB on your available balance when condition is met.
- Sell 100% BTC of your available balance when condition is met.

## Prerequisite
- TradingView [Pro plan](https://www.tradingview.com/gopro/?share_your_love=ThanwaJindarattana) or above for server-side webhook.
- Setup trigger condition and webhook URL.

Example TradingView payload
```
side = sell, tf = 4h, exchange = {{exchange}}, ticker = {{ticker}}, open = {{open}}, close = {{close}}, high = {{high}}, low = {{low}}, volume = {{volume}}, timestamp = {{time}}
```

## Clone this repository
`git clone https://github.com/nanmcpe/bitkub-optimize`

## Install dependencies
`npm install`

## Setup firewall (Recommended)
We allow incomming traffic from trusted source only.
Here is a list of IP addresses that we need to receive POST requests.
For more infomation, please see [About webhooks](https://www.tradingview.com/chart/?solution=43000529348).
```
52.89.214.238
34.212.75.30
54.218.53.128
52.32.178.7
```
TradingView only accept URLs with port numbers 80 and 443.

```
# ufw allow from 52.89.214.238 to any port 443
# ufw allow from 34.212.75.30 to any port 443
# ufw allow from 54.218.53.128 to any port 443
# ufw allow from 52.32.178.7 to any port 443
```

## Edit database configuration and other parameters on .env
```
NODE_ENV=Development
API_KEY=<YOUR-API-KEY>
API_SECRET=<YOUR-API-SECRET>
DB_SQL_HOST=<YOUR-DATABASE-HOST>
DB_SQL_PORT=3306
DB_SQL_DB=<YOUR-DATABASE-NAME>
DB_SQL_USER=<YOUR-DATABASE-USER>
DB_SQL_PASS=<YOUR-DATABASE-PASS>
SERVER_PORT=3000
BITKUB_ROOT_URL=https://api.bitkub.com
BUY_RATIO=0.01
SELL_RATIO=1
```

## Import database
`$ mysql -u <user> -p bitkub < database.sql`

## Dockerize (Optional)
#### Build docker image
`docker build -t <YOUR-IMAGE-HOST>/bitkub-optimize:<version>`

#### Push docker image
`docker push <YOUR-IMAGE-HOST>/bitkub-optimize:<version>`

#### Pull docker image
`docker-compose pull`

## Run application
`node app.js` or `docker-compose up -d`
