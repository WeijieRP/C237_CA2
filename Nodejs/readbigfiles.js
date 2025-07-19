const server = require("http")
const stream= require("fs")
//createserver , writeserver , big chnk one fihdsf one tbue dya d

server.createServer((req , res)=>{
   const filestream =stream.createReadStream("./helloworldbigfile.txt", {highWaterMark:30})
   filestream.on("open", (data)=>{
    filestream.pipe(res.end(data.toString()))
   })
   filestream.on("error", (error)=>{
    console.log(error)
   })
}).listen(3002, ()=>{
    console.log("server is running at host 3002")
})