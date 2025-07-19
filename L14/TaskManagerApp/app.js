// Import required modules
const express = require('express');

// Create an Express application
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));

//Define a route to render the index page
const taskdetails = [];
//in memory task array 
app.get('/', (req, res) => {
   res.render("index", {
    title:"Task Manager",
    description:"This app helps users organize their tasks efficiently , set deadlines , and prioritize their activities."
   })
});
app.post("/submit", (req , res)=>{
    const {name ,email ,contactNo , comment } = req.body
    res.render("submitted", {name , email , contactNo , comment})
})
app.get("/task", (req ,res)=>{
    res.render("taskDetails")
})
//Define a route to render the contact us page
app.get('/contact', (req, res) => {
    res.render('contact');
});

app.post('/addtask', (req, res) => {
    const{title , description , deadline , priority}= req.body
    const newId = taskdetails.length+1
    taskdetails.push({
        id:newId , 
        title:title  , 
        description : description , 
        deadline : deadline , 
        priority:priority,
        priorityColor:function(){
            if(priority==="low" || priority==="Low"){
                return "success"
            }else if(priority==="Medium" || priority==="medium"){
                return "warning"
            }else{
                return "danger"
            }
        }
    })
    res.render("confirm", {taskdetails})
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});