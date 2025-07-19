const express = require("express")
const routers= express.Router()
const {products , getproduct}= require("../controller/products")

routers.post("/create",products );
routers.get("/items/:Id",getproduct)
module.exports = routers
