const express = require('express');
const multer = require("multer");
const mysql = require("mysql2");
const passport = require('passport');
const session = require('express-session');
const flash = require("connect-flash");
const path = require('path');
const app = express();

// ======================
// Multer Config
// ======================
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

// ======================
// Express Config
// ======================
app.use(session({
    secret: 'Secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 1 week
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ======================
// MySQL Setup
// ======================
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'webuser',
    password: 'Group5@123?',
    database: 'igconnect'
});

connection.connect((err) => {
    if (err) {
        console.error('❌ MySQL connection error:', err);
        return;
    }
    console.log('✅ Connected to MySQL database');
});

// ======================
// Auth Middlewares
// ======================
const authUser = (req, res, next) => {
    if (req.isAuthenticated() || req.session.user) return next();
    req.flash('error', 'You must be logged in to access this page');
    res.redirect('/login');
};

const checkUserRoles = (req, res, next) => {
    if (req.user && req.user.roles === 'admin') {
        return next();
    }
    next(); // Allow all users if role check not strict
};

// ======================
// Routes
// ======================
app.get('/', (req, res) => {
    res.render('login', {
        success: req.flash('success'),
        errors: req.flash('error')
    });
});

// Show login page
app.get('/login', authUser, checkUserRoles, (req, res) => {
    res.render('login', {
        messages: req.flash('success'),
        errors: req.flash('error'),
    });
});

// Handle login (dummy for now)
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ? AND password = SHA1(?)";
    connection.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).send("Database error");

        if (results.length > 0) {
            req.session.user = results[0];
            req.flash('success', 'Login successful!');
            res.redirect('/dashboard');
        } else {
            req.flash('error', 'Invalid credentials');
            res.redirect('/login');
        }
    });
});

// Show register form
app.get('/register', (req, res) => {
    res.render('register');
});

// Handle register form
app.post('/register', (req, res) => {
    const { username, email, password, roles } = req.body;

    if (!username || !email || !password || !roles) {
        req.flash('error', 'Please fill in all fields');
        return res.redirect('/register');
    }

    const sql = "INSERT INTO users (username, email, password, roles) VALUES (?, ?, SHA1(?), ?)";
    connection.query(sql, [username, email, password, roles], (error, results) => {
        if (error) {
            console.error(error);
            req.flash('error', 'Error creating account');
            return res.redirect('/register');
        }

        req.flash('success', 'Registration successful! You can now log in.');
        res.redirect('/login');
    });
});

// Dashboard
app.get('/dashboard', authUser, (req, res) => {
    const search = req.query.search || '';
    const sql = "SELECT * FROM cca_entries WHERE title LIKE ?";
    connection.query(sql, [`%${search}%`], (err, results) => {
        if (err) return res.status(500).send('Error loading dashboard');
        res.render('dashboard', { entries: results, search });
    });
});

// Edit CCA Entry (GET)
app.get('/editCCA/:id', authUser, (req, res) => {
    const id = req.params.id;
    connection.query('SELECT * FROM cca_entries WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).send("Error loading entry");
        res.render('editCCA', { entry: result[0] });
    });
});

// Edit CCA Entry (POST)
app.post('/editCCA/:id', authUser, upload.single('file'), (req, res) => {
    const id = req.params.id;
    const { title, date, role, hours, description, category, feedback } = req.body;
    const file = req.file ? req.file.filename : null;

    let sql = `UPDATE cca_entries SET title = ?, date = ?, role = ?, hours = ?, category = ?, description = ?, feedback = ?`;
    const values = [title, date, role, hours, category, description, feedback];

    if (file) {
        sql += `, proof_file = ?`;
        values.push(file);
    }

    sql += ` WHERE id = ?`;
    values.push(id);

    connection.query(sql, values, err => {
        if (err) return res.status(500).send('Error updating CCA entry');
        res.redirect('/dashboard');
    });
});

// ======================
// Start Server
// ======================
app.listen(3000, () => {
    console.log('🚀 Server running at http://localhost:3000');
});
