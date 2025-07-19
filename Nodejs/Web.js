const { copyFileSync } = require("fs");
const server = require("http");
const path = require("path");
const newpath = path.join("/content","hellowordl","hello.txt")
console.log(newpath)
console.log(path.basename)
const servers =server.createServer((req, res)=>{
    console.log(req)
    console.log(res)
    if (req.url==="/"){
        res.write("Home page")
    }
    if(req.url==="/contact"){
        res.write("contact me")
    }
    if(req.url=="*"){
        res.write("helloworld")
    }
})
console.log("herere")
servers.listen(3002, (err)=>{
  console.log("server is running")
})

console.clear()//event loops is a askysnc , the sysme mose in the ejnreq eocntienrb, micror (Proro , micnfr)



