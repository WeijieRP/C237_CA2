// console.log("first task")
// setTimeout(() => {
//     console.log("timer ")
// }, 1000);

// console.log("end task")
// //async progrmaming
const express = require("express")
const usings = express()
//render stattic html , css and javscript 
usings.use(express.static("/", "public"))
const {readFile , writeFile}= require("fs")
const path = require("path")
//asa

const joinss = path.join("./content", "helloworld", "text.txt")
console.log(joinss)
console.log(path.win32)

console.log("start reading files")
console.log(joinss.basename)
//asyncad fucntions 
const newfile=readFile("./hello.js",(error , result)=>{
    if(error){
        console.log(error)
    }
    console.log("reading file is done")
    return result
})
console.log(newfile)
console.log("reading done ")
