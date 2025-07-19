const files = require("fs")

const readable = files.createReadStream("./helloworld.txt",{highWaterMark:40})

readable.on("data",(chunk)=>{
    console.log(chunk.toString())
})