const express = require("express")
const mysql = require("mysql2")
const app = express();

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"123456789102345popA",
    database:"c237_supermarketapp"
})
app.set("view engine", "ejs")

app.use(express.static("public"))
app.use(express.urlencoded({extended:false}))

connection.connect((error)=>{
    if(error){
        console.log("Error connecting to MYSQL", error)
    }
    console.log("Connected to MYSQL database")
})



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
app.post("/editProduct/:id", (req , res)=>{
    const productId = req.params.id;
    const {name , quantity , price} = req.body;
    const sql = "UPDATE products SET productName =? , quantity=? , price=? WHERE productId =?";
    connection.query(sql, [name , quantity ,price, productId], (error , results)=>{
        if(error){
            console.error("Error updating product:", error);
            res.status(500).send("Error updating product");
        }else{
            res.redirect("/");
        }
    })
})
app.get("/deleteProduct/:id", (req , res)=>{
        const productId = req.params.id;
        const sql = "DELETE FROM products WHERE productId=?";
        connection.query(sql , [productId], (error , results)=>{
            if(error){
                console.error("Error deleting product:", error);
                res.status(500).send("Error deleting product");
            }else{
                res.redirect("/");
            }
        })
})
app.get("/editProduct/:id", (req , res)=>{
    const productId = req.params.id;
    const sql = "SELECT * FROM products WHERE productId=?";
    connection.query(sql , [productId], (error, results)=>{
        if(error){
            console.log("Database query error:", error.message);
            return res.status(500).send("Error retrieving product by ID");
        }
        if(results.length>0){
            res.render('editProduct', {product:results[0]});
        }else{
            res.status(404).send("Product not found");
        }
    })
})
app.get("/product/:id", (req , res)=>{
    const productId = req.params.id;
    const sql = "SELECT * FROM products WHERE productId=?";
    connection.query(sql , [productId], (error , results)=>{
        if(error){
            console.log("Database query error:", error.message)
            return res.status(500).send("Erorr Retrieving product by ID");
        }
        if(results.length>0){
            res.render("product", {product:results[0]});
        }else{
            res.status(404).send("product not found ")
        }
    })
})
app.get("/addProduct", (req , res)=>{
    res.render('addProduct')
})
app.post("/addProduct", (req , res)=>{
    const {name , quantity , price , image}= req.body;
    const sql ="INSERT INTO products (productName , quantity , price , image) VALUES(?,?,?,?)";
    connection.query(sql , [name, quantity , price ,image], (error , results)=>{
        if(error){
            console.log("Error adding product:", error)
            return res.status(500).send("Erorr adding product");
        }else{
            res.redirect("/")
        }
    })
})
const PORT = process.env.PORT ||3000;
app.listen(PORT , ()=>{
    console.log(`Server running on PORT ${PORT}`)
})


