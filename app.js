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
//authutications
const authuticationsUser=(req , res , next)=>{
    if(req.session.user){
        next();
    }else{
       req.flash('error', 'You must be logged in to access this page');
        res.redirect('/login');
    }
}


//checking Users Roles  isnt admin or normal users
const checkUserRoles=(req , res,next)=>{
    if(req.session.role === 'admin'){
        res.redirect("/dashboard");
    }
    else{
         next();
    }
   
}



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

app.get('/login', authuticationsUser , checkUserRoles, (req, res) => {
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
    const { username , password , roles} = req.body;
    if(!username || !password ||!roles){
        req.flash('error', 'Please fill in all fields');
        return res.redirect('/register');
    }
    sql = "INSERT INTO users (username , password , roles) VALUES(?, SHA1(?),?)";
    mysql.query(sql , [username , password , roles], (error , results)=>{
        if(error){
            throw error;
        }else{
            req.flash('success', 'Registration successful! You can now log in.');
            res.redirect('/login');
        }
    })

});

// Show dashboard (after login)
app.get('/dashboard', (req, res) => {
  const search = req.query.search || '';
  const sql = "SELECT * FROM cca_entries WHERE title LIKE ?";
  connection.query(sql, [`%${search}%`], (err, results) => {
    if (err) {
      console.error('Error retrieving CCA entries:', err.message);
      return res.status(500).send('Error loading dashboard');
    }
    res.render('dashboard', { entries: results, search: search });
  });
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
