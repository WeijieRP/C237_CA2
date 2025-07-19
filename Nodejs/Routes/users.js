const express = require("express")
const routers = express.Router()

// routers.get("/users", (res , req)=>{
//     console.log(res.originalUrl)
//     console.log(req.destroyed)
// })

routers.get("/:id", (res , req)=>{
    req.send(`Get user Id by ${res.params.id}`)
})

module.exports={routers}
