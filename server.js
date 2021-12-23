const http = require('http');
const port = process.env.PORT ||4000
const app = require('./app')

const server = http.createServer(app);

server.listen(port)

console.log('some changes')
console.log('some more changes')
console.log('some more cha123123nges')
