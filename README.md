# kop640server
Cooperative 6/40. Backend side.

### Start server
 `$ npm install`  
 `$ node server`  

### Configs

**Attention!** File `configs/server.json` contains private account info.  
This configuration file structure:
```
{
  "mongo": {
    "url": "URL",
    "port": "PORT",
    "dbname": "DB_NAME",
    "username": "USER_NAME",
    "password": "PASSWORD"
  },
  "token": {
    "secretkey": "SOME_SECRET_KEY_STRING"
  }
}
``` 

MEAN Stack:
- `MongoDB` &mdash; Storing data
- `Express` &mdash; REST APIs
- `Angular` &mdash; Frontend side
- `Node.js` &mdash; Execution environment
