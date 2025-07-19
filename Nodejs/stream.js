// const stream = require("fs")

// const streamingtext=(pathName)=>{
//     return new Promise((resolve , reject)=>{
//        const streams =stream.createReadStream(pathName, {highWaterMark:40})
//         streams.on("data",(chunk)=>{
//             resolve(chunk.toString())
//         })
//         streams.on("error", (error)=>{
//             reject(error)
//         })
//     })
// }
// const start=async()=>{
//     try{
// const firstname = await streamingtext("./helloworldbigfile.txt")
//     console.log(firstname)
//     }catch(error){
//         console.log(error)
//     }
    
// }
// //async and pormise 
// //prsmier
// start()
// //promise


const {readFile , writeFile}= require("fs");
 writeFile("./helloworld.txt","hellowordlhellowodl12121212", {flag:"a"}, (error,respond)=>{
    if(error){
        console.log(error)
    }else{
        console.log(respond)
    }
})
readFile("./helloworld.txt","utf8", (error,respond)=>{
    if(error){
        console.log(error)
    }else{
        console.log(respond)
    }
})//appendss
//easyb ehrjr