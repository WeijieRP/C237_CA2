const server = require("http")
const {readFileSync}=require("fs")
const homePage= readFileSync("./index.html")
const stylepgae = readFileSync("./stylesheet.css");
//stattic 
server.createServer((res, req)=>{
    if(res.url==="/"){
        //hevae to read ehjsddds
        req.writeHead(200, {"content-type":"text/html"})
        req.write(homePage)
        req.end("end program")
    }
    else if(res.url==="/stylesheet.css"){
        req.writeHead(200 , {"content-type":"text/css"});
        req.write(stylepgae)
        req.end()
    }
    // //res.url == property of the url 
    // else if(res.url==="/about"){
    //     req.writeHead(200 , {"content-type":"text/html"});
    //     req.write()
    //     req.end()

    //     //end espsns
    //     //anymore res.write(no more alr )
    else{
        req.writeHead(404, {"content-type":"text/html"})
        //201 is created , 

req.write("<h1>page not found</h1>")
req.end("<h1>bye</h1>")
    }
}).listen(3002, ()=>{
    console.log("is running")
})
