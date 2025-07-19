const express = require("express");
const app = express();
const PORT = 3001;

app.use(express.urlencoded({extended:true}))
// const routers = require("./Routes/users")
// // // Set EJS as the view engine
// routers.set("view engine", "ejs");
// app.get("/", (req , res)=>{
//     res.render("index", {text:"helloworld123"})
// })
// app.patch("/", (res , req)=>{

// })
const routers = express.Router()

routers.get("/", (req, res)=>{
    res.json({text:"testing "})
    res.download("app.js")
    
    
})
// routers.get("/users", (res , req)=>{
//     console.log(res.originalUrl)
//     console.log(req.destroyed)
// })

// routers.get("/:id", (res , req)=>{
//     req.send(`Get user Id by ${res.params.id}`)
// })

// //HTTP Verbs (put , delete, post, patches)
// // Define route for /users/:id dynmaic routes
// app.get("/users/:id", (req, res) => {
//     const userId = req.params.id;
//     res.render("user", { id: userId }); // This expects a 'views/user.ejs' file
// });
// // app.get("/", (res , req)=>{
// //     res.statusMessage("error")
// //     res.status(200)
// // })
// // Start the server
// app.listen(PORT, ()=> {
//     //console.log("Server is running on port", PORT);
// });
