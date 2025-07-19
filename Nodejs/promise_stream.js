const stream = require("fs")
const server = require("http")
const getText=()=>{
    return new Promise((resolve , reject)=>{
       const result= stream.createReadStream("./helloworld.txt", {highWaterMark:40})
       result.on("data", (data)=>{
        resolve(data)
       })
        result.on("error", (error)=>{
            reject(error)
        })
    })
}

//promises with stream with improvesasa s
getText().then((data)=>{console.log(data.toString())}).catch((error)=>console.log(error))