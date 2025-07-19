// Import required modules
const express = require('express');

// Create an Express application
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));

//Define a route to render the index page
app.get('/', (req, res) => {
    res.render('index', 
    {
        // Activity 1: Add code to include another variable “age” to be passed to the index.ejs page
        name : 'Peter',
        age:15
    });
});

//Define a route to render the contact us page
app.get('/contact', (req, res) => {
    res.render('contact');
});

app.post('/submit', (req, res) => {
    // Activity 3: Edit the lines below include the additional form fields sent by the form
    const { name, email,  contactNo,comment} = req.body;
    
    res.render('submitted', {name, email, contactNo ,comment })
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});