const express = require("express")
const mysql = require("mysql2")
const app = express();

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"123456789102345popA",
    database:"c237_supermarketapp"
})

connection.connect((error)=>{
    if(error){
        console.log("Error connecting to MYSQL", error)
    }
    console.log("Connected to MYSQL database")
})

app.set("view engine", "ejs")

app.use(express.static("public"))

//Define routes 


app.get("/", (req , res)=>{
    connection.query("SELECT * FROM products ", (error, results)=>{
        if(error) {
            console.log("Database query error :", error.message)
            return res.status(500).send("Erorr Retrieving products.")
        }
        res.render("index", {products:results});
    })
})


const PORT = process.env.PORT ||3000;
app.listen(PORT , ()=>{
    console.log(`Server running on PORT ${PORT}`)
})


