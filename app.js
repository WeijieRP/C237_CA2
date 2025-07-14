const express = require('express');
const multer = require("multer");
const mysql = require("mysql2");
const app = express();

const session = require("express-session");
const flash = require("connect-flash");

app.use(session({
    secret: 'Secret',
    resave:false,
    saveUninitialized: true,
    cookie:{maxAge:1000*24*60*7}
}))
app.use(flash());   
app.use(express.Router())
// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public')); // ✅ to serve Lottie and other assets

// MySQL connection (Uncomment and configure when ready)
/*
const sql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword',
    database: 'yourdbname'
});

sql.connect((err) => {
    if (err) {
        console.error('❌ Database connection error:', err);
        return;
    }
    console.log('✅ Connected to MySQL database');
});
*/


// === ROUTES ===

// Routes
app.get('/', (req, res) => {

    res.render('logins', {success:req.flash('success'), errors: req.flash('error')}); // views/logins.ejs
});
app.post("/login", (req , res)=>{

})
// app.get('/', (req, res) => {
//     res.render('home', { user: req.session.user, messages: req.flash('success')});
// });

app.get('/login', (req, res) => {
    res.render('login', { 
        messages: req.flash('success'), //retrieve success messages
        errors: req.flash('error'), //retrieve error messages
    }); // views/login.ejs
});

app.post('/login', (req, res) => {
//insert code here
});
// Show register page
app.get('/register', (req, res) => {
    res.render('register'); // views/register.ejs
});

// Handle register form
app.post('/register', (req, res) => {
    // You'll handle the form logic here
    console.log(req.body);
    res.send('Register POST received');
});

// Show dashboard (after login)
app.get('/dashboard', (req, res) => {
    res.render('dashboard'); // views/dashboard.ejs
});
app.get('/editCCA/:id',(req,res)=>{
    res.render('editCCA');
})
app.post('/editCCA/:id', (req, res) => {
    const ccaId = req.params.id;
    const { title, date, role, hours, description } = req.body;

    const sql = 'UPDATE cca_entries SET title = ?, date = ?, role = ?, hours = ?, description = ? WHERE id = ?';

    connection.query(sql, [title, date, role, hours, description, ccaId], (error, results) => {
        if (error) {
            console.error('Error updating CCA entry:', error.message);
            return res.status(500).send('Error updating CCA entry');
        }
        res.redirect('/dashboard'); // redirect to dashboard or main list
    });
});


// Start server
app.listen(3000, () => {
    console.log('🚀 Server is running on http://localhost:3000');
});
