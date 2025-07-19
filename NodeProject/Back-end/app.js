const express = require("express")
const app= express()
const path = require("path")
const {authorize} = require("../middleware/Auth")
const routes= require("../Router/Router")
let users=[]
app.use(express.urlencoded({extended:false}))
app.use("/", routes)
// app.use(express.static("./Front-end"))
// app.use(authorize)
// app.use(express.json())
// app.get("/homepage", (req , res)=>{
//     res.sendFile(path.join(__dirname, "../Front-end", "create.html"));

// })
// //veuhrjexpress royter
// app.post("/signup",(req, res)=>{
//     const { name , password}= req.body
//     console.log(req.body)
//     if(name && password){
//           return  res.send(`welcome ${name}` )

//     }
//     return res.status(404).send("please provide details")

// })
// app.get("/",(req , res)=>{
//     res.sendFile(path.join(__dirname, "../Front-end", "homepage.html"));
// })
// app.get("/login" ,(req, res)=>{
//     res.sendFile(path.join(__dirname, "../Front-end", "logging.html"));
// })
// app.post("/login",authorize,(req , res)=>{
//     res.sendFile(path.join(__dirname, "../Front-end", "homepage.html"));

// } )


// //next middleware
// app.get("/", (req , res)=>{
//     //home page
//     res.status(200).send("home page")
// })

app.listen(3004, ()=>{
    console.log("server is running")
})