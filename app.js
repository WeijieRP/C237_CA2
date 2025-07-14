const express = require('express');
const multer = require("multer");
const mysql = require("mysql2")
const app = express();

app.use(express.json());

const sql =mysql.createConnection({
    host: 'localhost',
    password:"123456789102345popA",
    user:"root",
    database:"testdb",
})
sql.connect((err) => { 
    if (err) {
        console.error('Error connecting to the databases1:', err);
        return;
    }
    console.log('Connected to the databases12');
})


app.get('/login',(req ,res)=>{

})


app.post("register", (req ,res)=>{

})

app.get("/dashboard", (req , res)=>{
    
})
app.get("/register")

// test
app.listen(3000, () => {  
    console.log('Server is running on port 3000');
});