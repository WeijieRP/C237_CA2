const express = require("express");
const app = express();
const path = require("path");
//use is th middleware , reutes m amdidel rest abej ehetev 
//use above rehfen fe/ use ee//all the statteic files it can be rednered..//staa
app.all("*", (req , res)=>{
    res.status(404).send("<h1>error</h1>")
    res.end()
})
app.use(express.static("./public"));

// // Serve index.html on root route
// app.get("/", (req, res) => {
//     const filePath = path.join(__dirname, "index.html");

//     res.sendFile(filePath, (error) => {
//         if (error) {
//             console.error("Error sending file:", error);
//             res.status(500).send("<h1>Error loading the page</h1>");
//         }
//     });
// });
//static al use sexpre
//nth of the matches , all is inlcude out , dleete , update , post , get 
// app.all("*", (req , res)=>{
//     res.status(404).send("<h1>page not found</h1>")
//     res.end()
// })
//shoerter version http node mod
// Start the server
app.listen(3002, () => {
    console.log("Server is running on port 3002");
});
