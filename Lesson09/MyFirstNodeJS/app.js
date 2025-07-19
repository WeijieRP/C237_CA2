const http = require("http")
const server = http.createServer((req , res)=>{
    res.write("<h1>Welcome to my first Node.JS Page !</h1>")
    res.write("<p>Name:Weijie</p>")
    res.write("<p>School: Republic polytechnic</p>")
    res.write("<p>Diploma: Diploma in Digital Design and Development</p>")
    res.end()
})
const port = 3000;

server.listen(port , ()=>{
    console.log(`Server running at http://localhost:${port}/`)
})