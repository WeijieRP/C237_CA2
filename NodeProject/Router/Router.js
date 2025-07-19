const express = require("express")
const router = express.Router()
const path = require("path")


router.get("/newwebsite/create/login", (req , res)=>{
    res.sendFile(path.join(__dirname, "../Front-end", "logging.html"));

})
router.get("/", (req , res)=>{
    res.sendFile(path.join(__dirname, "../Front-end", "logging.html"));

})
router.get("*", (req , res)=>{
    res.status(404).send("not found page")
})
//veuhrjexpress royter
router.post("/newwebsite/create/signup",(req, res)=>{
    const { name , password}= req.body
    console.log(req.body)
    if(name && password){
          return  res.send(`welcome ${name}` )

    }
    return res.status(404).send("please provide details")

})

module.exports = router