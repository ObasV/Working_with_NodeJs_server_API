const http = require('http')

const server = http.createServer((req, res) =>{
    console.log('server is working perfectly')
    res.end('Welcome')
})


const PORT = 5000

server.listen(PORT,'127.0.0.1',()=>{
    console.log('Server is responding')
})