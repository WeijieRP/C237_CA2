const {readFile, writeFile} = require("fs")

console.log("start")
const reading=readFile("./hi.txt", "utf-8", (err , res)=>{
    if(err){
        console.log(err)
    }
    console.log(res)
})

writeFile("./helloworld.txt", `helloworld continue here ${reading}`, (err, res)=>{
    if(err){
        console.log(err)
    }
    console.log(res)
    console.log("task ended")
})
console.log("end")
//asycnc readig fiels e
//radwrs s= sysnc a a waiting blofck which is not efficent 