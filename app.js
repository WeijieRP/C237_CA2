const express = require('express');
const multer = require("multer");
const mysql = require("mysql2");
const app = express();

const session = require("express-session");
const flash = require("connect-flash");

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

// Show login page
app.get('/', (req, res) => {
    res.render('logins'); // views/logins.ejs
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

// Start server
app.listen(3000, () => {
    console.log('🚀 Server is running on http://localhost:3000');
});
