# bitkub-optimize
![CodeQL](https://github.com/nanmcpe/bitkub-optimize/workflows/CodeQL/badge.svg)

Node.JS trading bot for [Bitkub.com](https://bitkub.com) using [TradingView](https://tradingview.com) webhook.

This application is based on [bitkub-official-api-docs](https://github.com/bitkub/bitkub-official-api-docs)

![](https://smartadvicefordumbmillennials.com/wp-content/uploads/2017/10/wolf_of_wall_street_money.gif)


## Features
- Buy or Sell Bitcoin when received webhook from TradingView.
- Records transactions to the self-managed database.
- Notify trading transactions with LINE (need to [register](https://notify-bot.line.me/)).

## TODOs (PR-Welcomed)
- ✅  Replace moment.js with [date-fns](https://github.com/date-fns/date-fns).
- ⏰  Add other instant messaging (e.g. Slack) for notify action.
- ⏰  Add stop-limit order feature (waiting for Bitkub to release this API, [see more](https://github.com/bitkub/bitkub-official-api-docs/issues/24)).
- ⏰  Add trailing stop order feature (after stop-limit order API is released).
- ⏰  Design a web dashboard to visualize profit and loss.

## Strategy
- Buying or selling signals will be triggered from TradingView, we should set up at TradingView side. 
#### These are some strategies that configurable
- Buy BTC using 90% off THB on your available balance at market price when the condition is met.
- Sell 100% BTC of your available balance at market price when the condition is met.

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
We allow incoming traffic from trusted sources only.
Here is a list of IP addresses that we need to receive POST requests.
For more information, please see [About webhooks](https://www.tradingview.com/chart/?solution=43000529348).
```
52.89.214.238
34.212.75.30
54.218.53.128
52.32.178.7
```
TradingView only accepts URLs with port numbers 80 and 443.

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
LINE_TOKEN=<YOUR-LINE-TOKEN>
BUY_RATIO=0.9
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

## Appendix
### nginx.conf
```
location / {
    proxy_pass              http://172.50.0.2:3000/; # IP of docker container
    proxy_http_version      1.1;
    proxy_set_header        Upgrade $http_upgrade;
    proxy_set_header        Connection 'upgrade';
    proxy_set_header        Host $host;
    proxy_set_header        X-Forwarded-Proto $scheme;
    proxy_set_header        X-Real-IP $remote_addr; # Add this header to get real remote IP
    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass      $http_upgrade;
}
```
### Certbot
If you use [Certbot](https://certbot.eff.org/) to renew the SSL certificate, you need to change from `HTTP challenge` to `DNS challenge` because we only whitelist from TradingView so the Certbot task will fail

#### If you guys like this project, feel free to give me some coffee ☕️
- BTC: 3NkbtCeykMvAX32rAd14h3pBstHZ47RaNb
- ETH: 0xc0430624d2e04a2d5e393554904ebefca39b48ca
