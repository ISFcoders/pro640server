# kop640server
Cooperative 6/40 backend side

### Start server
 `$ npm install`  
 `$ node server`  

### Configs
**Attention!** File `configs/server.json` contains private account info.  
This configuration file structure:
```
{
  "server": {
    "protocol": "http",
    "baseurl": "localhost",
    "port": "3000",
    "emitterintervals": {
      "short": "10000",
      "medium": "55000",
      "large": "125000"
    }
  },
  "system" : {
    "random" : {
      "min": "MIN_VALUE",
      "max": "MAX_VALUE"
    }
  },
  "mongo": {
    "url": "",
    "port": "",
    "dbname": "",
    "username": "",
    "password": ""
  },
  "token": {
    "secretkey": "SECRET_KEY"
  },
  "blockchain": {
    "provider": {
      "websocket": {
        "address": "wss://ropsten.infura.io/ws"
      },
      "http": {
        "address": "https://ropsten.infura.io/v3/e4c80087f04c4a51ba9a4bf1d43897b5"
      }
    },
    "contract": {
      "address": "0xb924E90E21c7cf9B2bc6279e81C280A8126DA881",
      "abi": "./configs/blockchain/abi/contractAbi06.json"
    },
    "output": {
      "base": "./var-data/blockchain",
      "offerstosell": "offers-to-sell.json",
      "offerstobuy": "offers-to-buy.json"
    }
  },
  "ethereum": {
    "ratesurl": "https://api.cryptonator.com/api/ticker/eth-rub",
    "output": {
      "base": "./var-data/ethereum",
      "rates": "rates.json"
    }
  },
  "mailer": {
    "qlfund_yndx": {
      "service": "yandex",
      "host": "smtp.yandex.ru",
      "user": "example@yandex.ru",
      "password": "password"
    }
  }
}
``` 

MEAN Stack:
- `MongoDB` &mdash; Storing data
- `Express` &mdash; REST APIs
- `Angular` &mdash; Frontend side
- `Node.js` &mdash; Execution environment
