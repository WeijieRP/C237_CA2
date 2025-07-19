const express = require("express");
const app = express();
const EventsEmiiter = require("events")
const event = new EventsEmiiter()
const router = express.Router()
//expres router 
//registering events
event.on("hello", (name)=>{
    console.log(`heloworld ${name}`)
})
//u can use the form requerst body property 
app.use(express.urlencoded({extended:true}))
//form procesing
app.get("/formsubmit", (req , res)=>{
    res.send(req.body)
})
//raise events
event.emit("hello", "john")
// Set EJS as the view engine
//css , js and html file 
// app.use(express.static({public:""}))
app.set("view engine", "ejs");

// Custom function to fetch data and return JSON
const promise = (fetchPath) => {
    return fetch(fetchPath)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Failed to fetch");
            }
            return res.json(); // parse and return JSON data
        });
};
//evenet driven 
//
// Route to fetch and render data
app.get("/", (req, res) => {
    promise("https://jsonplaceholder.typicode.com/todos")
        .then((data) => {
            //render ejs 
            res.render("todos", { todos: data }); // Pass data to EJS template
        })
        .catch((error) => {
            res.status(500).send("Error fetching data: " + error.message);
        });
});

// Start the server
app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});
