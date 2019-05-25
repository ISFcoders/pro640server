# Документация по API
[Главная](../README.md) / Документация по API 

### auth
| name  | http | url | description | 
| --- | --- | --- | --- |
| **register** | POST | /api/auth/register | Регистрация новой учетной записи |
| **login** | POST | /api/auth/login | Вход в систему под существующей учетной записью |

### blockchain
| name  | http | url | description | 
| --- | --- | --- | --- |
| **/** | GET | /api/blockchain/ | Пустой (диагностический) запрос
| **get-offers-to-sell** | GET | /api/blockchain/get-offers-to-sell | Актуальные предложения на продажу |
| **get-offers-to-buy** | GET | /api/blockchain/get-offers-to-buy | Актуальные предлоджения на покупку |
| **info-contract** | GET | /api/blockchain/info-contract | Информация по всем транзакциям и предложениям |
| **info-offers-to-sell** | GET | /api/blockchain/info-offers-to-sell | Информация по предложениям (токенам) на продажу |
| **info-offers-to-buy** | GET | /api/blockchain/info-offers-to-buy | Информация по предложениям (токенам) на покупку |

### ethereum-rates
| name  | http | url | description | 
| --- | --- | --- | --- |
| **/** | GET | /api/ethereum-rates/ | Пустой (диагностический) запрос |
| **/eth-rub** | GET | /api/ethereum-rates/eth-rub | Курс ETH-RUR (ethereum-рубль) |
