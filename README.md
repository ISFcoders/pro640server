# kop640server
Cooperative 6/40. Backend side.

 Start server:   
`$ cd server`  
`$ node server`

Configuration file `configs/server.json` structure:

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
