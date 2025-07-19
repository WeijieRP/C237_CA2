const express= require("express")



const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set('view engine', 'ejs');

const toiletriesList= ["Toothbrush", "Shampoo","Sunscreen"];
const clothesList=["T-shirts", "Jacket","Jeans"];

//render a homepage for html engine
app.get("/", (req , res)=>{
    res.render("travel", {clothesList, toiletriesList})
})

//create new items
app.post("/Additems", (req , res)=>{
    const {items , options} = req.body
    if(options==="Clothes" || options==="clothes"){
        clothesList.push(items)
    }else{
        toiletriesList.push(items)
    }
    res.redirect("/")

})
const PORT = process.env.PORT ||3000;
app.listen(PORT, ()=>{
    console.log("port 3004 is running")
})
