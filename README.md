# bitkub-optimize
Node.JS trading bot for [Bitkub.com](https://bitkub.com) using [TradingView](https://tradingview.com) webhook

## Prerequisite
- TradingView [Pro plan](https://www.tradingview.com/gopro) or above for server-side webhook
- Setup trigger condition and webhook URL

Example TradingView payload
```
side = sell, tf = 4h, exchange = {{exchange}}, ticker = {{ticker}}, open = {{open}}, close = {{close}}, high = {{high}}, low = {{low}}, volume = {{volume}}, timestamp = {{time}}
```

## Clone this repository
`git clone https://github.com/nanmcpe/bitkub-optimize`

## Install dependencies
`npm install`

## Setup firewall (Recommended)
We allow incomming traffic from trusted source only
Here is a list of IP addresses that we need to receive POST requests
```
52.89.214.238
34.212.75.30
54.218.53.128
52.32.178.7
```
TradingView only accept URLs with port numbers 80 and 443.

## Edit database configuration and other parameters on .env OR docker-compose.yml
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

## Build docker image (Optionnal)
`docker build -t <YOUR-IMAGE-HOST>/bitkub-optimize:latest`

## Push docker image (Optionnal)
`docker push <YOUR-IMAGE-HOST>/bitkub-optimize:latest`

## Pull docker image (Optionnal)
`docker-compose pull`

## Run application
`node app.js` or `docker-compose up -d`
