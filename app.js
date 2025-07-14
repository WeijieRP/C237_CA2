const express = require('express');
const multer = require("multer");
const mysql = require("mysql2")
const app = express();

app.use(express.json());

const sql =mysql.createConnection({
    host: 'localhost',
    password:"",
    user:"root",
    database:"testdb",
})
sql.connect((err) => { 
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
})


app.get('/login',(req ,res)=>{

})


app.post("register", (req ,res)=>{

})


app.get("/register")


app.listen(3000, () => {  
    console.log('Server is running on port 3000');
});