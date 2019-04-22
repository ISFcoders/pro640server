# kop640server API doсumentation

[Главная](../README.md) / Документация по API 

### /api/auth
| name  | http | url | description | 
| --- | --- | --- | --- |
| **register** | POST | /api/auth/register |
| **login** | POST | /api/auth/login |

### /api/blockchain
| name  | http | url | description | 
| --- | --- | --- | --- |
| **/** | GET | /api/blockchain/ | Пустой (диагностический) запрос
| **get-offers-to-sell** | GET | /api/blockchain/get-offers-to-sell | Актуальные предложения на продажу |
| **get-offers-to-buy** | GET | /api/blockchain/get-offers-to-buy | Актуальные предлоджения на покупку |
| **info-contract** | GET | /api/blockchain/info-contract | Инфо по всем транзакциям и предложениям |
| **info-offers-to-sell** | GET | /api/blockchain/info-offers-to-sell | Инфо по предложениям (токенам) на продажу |
| **info-offers-to-buy** | GET | /api/blockchain/info-offers-to-buy | Инфо по предложениям (токенам) на покупку |

### /api/ethereum-rates
| name  | http | url | description | 
| --- | --- | --- | --- |
| **/** | GET | /api/ethereum-rates/ |
| **/eth-rub** | GET | /api/ethereum-rates/eth-rub |
