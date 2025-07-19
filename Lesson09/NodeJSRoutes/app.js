const http = require("http");

const server = http.createServer((req , res)=>{
    if(req.url==="/"){
        res.writeHead(200 , {"Content-Type":"text/html"});
        res.write("Home page");
        res.end()
    }else if(req.url==="/about"){
        res.writeHead(200 , {"Content-Type":"text/html"});
        res.write("About Us page");
        res.end()
    } else if(req.url==="/contact"){
        res.writeHead(200 , {"Content-Type":"text/html"});
        res.write("Contact page ");
        res.end()
    }
    else {
        res.writeHead(404 , {"Content-Type":"text/html"});
        res.write("404 Not Found");
        res.end()
    }
})
const Port =3000;
server.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`);
})