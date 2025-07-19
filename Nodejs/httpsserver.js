const server = require("http")
const express = require("express")
const app = express()
const jaosn = {
    name :"helloworld",
    age:20
}

server.createServer((req , res)=>{
    //express of  w w,wr ,
    //node wrgbuyhrriijs
    console.log(req)
    // console.log(req.body)
    res.writeHead(200 , {"content-type":"text/plain"})
    res.write("<h1>helloworld</h1>")
    res.end("the end")
    if(req.url==="/"){
        res.writeHead(200 , {"content-type":"text/plain"})
        res.end("home page")
    }
    //return the content type
    if(req.url==="/about"){
        res.end("about us ")
    }
    if(req.url==="/contact"){
        res.end("contact us ")
    }
    // console.log(req.url)
    // res.setHeaders({'content-type':"text/html"})
    // res.end("helloworld")
    // console.log(req.httpVersion)
    // //url 
    // console.log(req.headers)
}).listen(5000, ()=>{
    console.log("port running at 5000")
})
//global varlia enege
console.log(__dirname)
console.log(__filename)
//easy 