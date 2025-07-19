const express = require("express")
const app = express()
const {products} = require("./data")
const product= require("./routing/products")

// app.use(express.static("./public"))
app.use(express.urlencoded({extended:true}))
app.use(express.json());
//content type for json 
//prar data as jason
//req -middlewarr-res
//cform req bodd
app.get("/", (req, res)=>{
    res.status(200).send("home page")
})
app.use(express.urlencoded({extended:true}))
app.use("/products",product)
//forwards slash pro//use dgloabsms
//express oruter coded , mini expres rsapap bug sms
app.get("/item", (req , res)=>{
    console.log(products)
    res.status(200).json(products)
})
// app.put("/product/items/:Id",(req, res)=>{
//     const {Id}= req.params
//     const {userId , id , title, body}= req.body
//     let sortedproducts = [...products]
//     sortedproducts= sortedproducts.filter((products)=>products.userId===Number(Id)).slice(0,1)
//     if(sortedproducts){
//         const newproducts = sortedproducts.map((products)=>{
//             products.userId=userId,
//             products.id=id,
//             products.title=title,
//             products.body=body
//         })//versjrbjr
//         console.log(newproducts)
//         return res.status(200).json(sortedproducts)
//     }
//     return res.status(404).json({
//         sucess:true,
//         data:[]
// })

// })
//express oruter can help to organize router code 
//midillware for logging and autthenication 
//movel view controller
//app.use(exoress.static("./"))//routes and put desig anas 
//app.use (expres.json()//pasrs dataa sa jason )
//dleet , post , put , get http verb (http method)
app.delete("/product/delete/:deleteid",(req , res)=>{
    const {deleteid}= req.params
    let sortedproducts = products.filter((products)=>products.userId===Number(deleteid))
    if(sortedproducts.length>1){
        let newproducts = products.filter((products)=>sortedproducts.userId!==products.userId);

        return res.status(200).json(newproducts)
    }
    //x--www.formurr
    return res.status(404).json({
        sucess:true,
        data:[]
    })
})
// app.post("/login", (req , res)=>{

//     //rs.reducre to aother page 
//   //  res.redirect(301,"./homepage.html")
//     //name drsae hrb 
//     //req.body = req.forms query url =-fndf
//     console.log(req.body)
//     const {firstname , lastname} = req.body
//     if(firstname && lastname){
//        return res.status(200).send(`welcome ${firstname+lastname}`)
//     }
//     return res.status(401).send("authoized access is given")//ewt
// })

app.listen(3003 , ()=>{
    console.log("port is running")
})