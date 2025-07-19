const express = require("express")
const app = express()
const {products} = require("./data")
const logger= require("./logger")
const authroized = require("./authorize")
//mdille end tj preoess send , if not next () ->next middleware code to run
//global
//middle req .-miidlewae - res 
//midee 
app.use([authroized, logger])
//midlee//usee
//get next ()
//: dynamic routes 
//:id routes para rrreq .queapraer
app.post("/", (req , res)=>{
    
})
//query ?par.qeurr ?name &natev a& abhsabsaqueuhr sgrufiojeinj
app.get("/", (req , res)=>{
    console.log(req.method)
    console.log(req.user)
   
    res.status(200).send("home page")
    // const filterproducts =products.map((products)=>{
    //     const {userId , id }= products
    //     return {userId , id} 
    // })
    // //retrdjnd
    // res.json(filterproducts)
})
app.get("/about", (req , res)=>{
    console.log(req.user)
    res.send("about page")
})
// //can//exampe of query string , browsortin, eas
// //rmes queyr:id 

// app.get("/posts/version1/query", (req, res) => {
//     const { title, limit } = req.query;
//     let sortedproducts = [...products];

//     if (title) {
//         sortedproducts = sortedproducts.filter((product) => {
//             return product.title.startsWith(title);
//         });
//     }
// //is tnot string 
//     if (limit) {
//         return sortedproducts = sortedproducts.slice(0, Number(limit));
//     }

//     if (sortedproducts.length < 1) {
//         return res.status(200).json({
//             success: true,
//             data: [],
//             length: 0
//         });
//     }
// //ecmoemc 
//     // res.status(200).json({
//     //     success: true,
//     //     data: sortedproducts,
//     //     length: sortedproducts.length
//     // });
// });
// // //? query filtering , sorting ,//each rouyes geetring resouces //SEARCH BAR , ILFTER //FECTH THTR 
// // app.get("/posts/v1/query", (req , res)=>{
// //     const {search , limit}= req.query
// //     let sortedproduct= [...products]
// //     if(search){
// //         sortedproduct = sortedproduct.filter((products)=>{
// //             return products.title.startsWith(search)
// //         })
// //     }
// //     if(limit){
// //        sortedproduct= sortedproduct.slice(0 , Number(limit))

// //     }
// //     //if the array is empty
// //     if(sortedproduct.length<1){
// //         res.status(200).json({
// //             sucess:true,
// //             data:[]
// //         })

// //     }
// //     //if ehts e e
// //     //if does match if rnor
// //     res.status(200).json(sortedproduct)
// //     // const {search , limit}=req.query
// //     // let sortedproduct = [...products]
// //     // if(search){
// //     //     sortedproduct= sortedproduct.filter((products)=>{
// //     //         return products.body.startsWith(search)
// //     //     })
// //     // }
// //     // if(limit){
// //     //     sortedproduct= sortedproduct.filter((products)=>{
// //     //         return products.userId === limitn
// //     //     })
    
// //     // console.log(req.query.name)//querr
// //     // console.log(req.query.age)
// //     // //vern
// //     // res.send("heloworld")
// // })
// //routes paramer when u egter//first node s ee// ecommer e
// app.get("/post/:ids",(req , res)=>{
//     const filters = products.filter((products)=>products.userId===Number(req.params.ids))
//     res.json(filters)
// })//veihur
// // app.get("/posts/:productid/?query=shsss&tag=ahshss", (req, res)=>{
// //     console.log(req.query.tag)
// // })
// //":" is dynamic routes  // routes prarmetr 
// app.get("/posts/:productid/reviews/:reviewid", (req , res)=>{
//     console.log(req.params)
//     console.log(req.url)
//     //objects
//     console.log(req.params)
// })//rotes app ..er soserbjnwefkjede
// //paramer rquess /dynmaic prid d
// app.get("/posts/:products1",(req , res)=>{
//     const { products1} = req.params.products1
//     const filterreesult = products.find((products)=>products.userId===products1)
//     res.json(filterreesult)
// })
app.listen(3002, ()=>{
    console.log("app is listening at port 3002")
})