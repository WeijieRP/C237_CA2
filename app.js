const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const app = express();

const session = require('express-session');
const flash = require('connect-flash');

const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    }, 
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'proof-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use(session({
    secret: 'Secret',
    resave:false,
    saveUninitialized: true,
    cookie:{maxAge:1000*60*60*24*7}
}))
app.use(flash());   
app.use(express.Router())
// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public'))); 

// MySQL connection (Uncomment and configure when ready)
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Group5@123?',
    database: 'igconnect',

});

connection.connect((err) => {
    if (err) {
        console.error('❌ Database connection error1:', err);
        return;
    }
    console.log('✅ Connected to MySQL database1');
});


//authentications
const authenticationsUser=(req , res , next)=>{
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

app.get('/login', authenticationsUser , checkUserRoles, (req, res) => {
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
    const { username ,email ,  password , roles} = req.body;
    if(!username ||!email|| !password ||!roles){
        req.flash('error', 'Please fill in all fields');
        return res.redirect('/register');
    }
    sql = "INSERT INTO users (username, email , password , roles) VALUES(?,? , SHA1(?),?)";
    mysql.query(sql , [username , email , password , roles], (error , results)=>{
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

app.get('/editCCA/:id', (req, res) => {
    const ccaId = req.params.id;
    connection.query('SELECT * FROM cca_entries WHERE id = ?', [ccaId], (err, result) => {
        if (err) {
            return res.status(500).send("Error loading entry");
        }
        res.render('editCCA', { entry: result[0] });
    });
});

app.post('/editCCA/:id', upload.single('file'), (req, res) => {
    const ccaId = req.params.id;
    const { title, date, role, hours, description, category, feedback } = req.body;
    const file = req.file ? req.file.filename : null;

    // Build SQL dynamically
    let sql = `UPDATE cca_entries SET title = ?, date = ?, role = ?, hours = ?, category = ?, description = ?, feedback = ?`;
    const values = [title, date, role, hours, category, description, feedback];

    if (file) {
        sql += `, proof_file = ?`;
        values.push(file);
    }

    sql += ` WHERE id = ?`;
    values.push(ccaId);

    connection.query(sql, values, (error, results) => {
        if (error) {
            console.error('❌ Error updating CCA entry:', error.message);
            return res.status(500).send('Error updating CCA entry');
        }
        res.redirect('/dashboard');
    });
});


// ======================
// Start Server
// ======================
app.listen(3000, () => {
console.log('🚀 Server running at http://localhost:3000');
});
