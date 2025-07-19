const express = require("express")
const mysql  = require("mysql2")
const multer = require("multer");
const app = express()

const storage = multer.diskStorage({
    destination:(req , file , cb)=>{
        cb(null , 'public/images');
    },
    filename:(req , file , cb)=>{
        cb(null, file.originalname);
    }
})

const upload= multer({storage:storage})
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
app.post("/editStudents/:id",upload.single("image"), (req , res)=>{
    const studentId = req.params.id;
    const {name, dob, contact} = req.body;
    let image = req.body.currentImage;
    if(req.file){
        image = req.file.filename;
    }
    const sql = 'UPDATE student SET name =? , dob=? , contact=? , image=? WHERE studentId=?';
    connection.query(sql, [name,dob ,contact , image , studentId], (error , results)=>{
        if(error){
            console.error("Error updating students:", error);
            res.status(500).send("Error updating students")
        }else{
            res.redirect("/");
        }
    })

})
app.get("/deleteStudents/:id", (req , res)=>{
    const studentId = req.params.id;
    const sql = "DELETE FROM student WHERE studentId = ?";
    connection.query(sql, [studentId], (error , results)=>{
        if(error){
            console.error("Error deleting students:", error)
            res.status(500).send("Error deleting students");
        }else{
            res.redirect("/");
        }
    })
})
app.get("/editStudents/:id", (req , res)=>{
    const studentId = req.params.id;
    const sql = "SELECT * FROM student WHERE studentId=?";
    connection.query(sql , [studentId], (error , results)=>{
        if(error){
            console.error("Database query error:", error.message)
            return res.status(500).send("Error retrieving student by ID");
        }
        if(results.length>0){
            res.render('editStudent', {students:results[0]});
        }else{
            res.status(404).send("Student not found");
        }
    })
})

app.post("/addStudents",upload.single("image"), (req , res)=>{
    const {name, dob, contact} = req.body;
    let image;
    if(req.file){
        image = req.file.filename;
    }else{
        image=null;
    }
    const sql = "INSERT INTO student(name, dob,contact,image) VALUES(?,?,?,?)";
    connection.query(sql , [name , dob , contact , image], (error , results)=>{
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
