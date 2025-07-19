const express = require("express")
const mysql  = require("mysql2")
const app = express()

app.use(express.urlencoded({extended:false}))
app.set("view engine", "ejs");
app.use(express.json())
app.use(express.static("public"))

const connection = mysql.createConnection({
    host:"localhost", 
    user:"root",
    password:"123456789102345popA",
    database:"c237_studentlistapp"

})

connection.connect((error)=>{
    if(error){
        console.log("Error connecting to MYSQL", error)
    }
    console.log("Connected to MYSQL database")
})

const PORT = process.env.PORT ||3000;

app.get("/", (req ,res)=>{
    const sql = "SELECT * FROM student";
    connection.query(sql , (error ,results)=>{
       if(error) {
            console.log("Database query error :", error.message)
            return res.status(500).send("Erorr Retrieving products.")
        }
        res.render("index", {students:results});
        console.log(results)
    })
})
app.get("/addStudents", (req ,res)=>{
    res.render('addStudent')
})
app.post("/addStudents", (req , res)=>{
    const {studentname, dob, contact, image} = req.body;
    const sql = "INSERT INTO student(name, dob,contact,image) VALUES(?,?,?,?)";
    connection.query(sql , [studentname , dob , contact , image], (error , results)=>{
        if(error){
            console.log("Error adding students:", error)
            return res.status(500).send("Erorr adding students");
        }else{
            res.redirect("/")
        }
    })
})
app.get("/student/:id", (req , res)=>{
    const id = req.params.id;
    const sql = "SELECT * FROM student WHERE studentId=?";
    connection.query(sql , [id], (error , results)=>{
        if(error){
            console.log("Database query error:", error.message)
            return res.status(500).send("Erorr Retrieving students by ID");
        }
        if(results.length>0){
            res.render("student", {students:results[0]});
        }else{
            res.status(404).send("student not found ")
        }
    })
})
app.listen(PORT , ()=>{
    console.log(`Server running on PORT ${PORT}`)
})
