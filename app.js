const express = require('express');
const multer = require("multer");
const mysql = require("mysql2");
const passport = require('passport');
const session = require('express-session');
const flash = require("connect-flash");
const path = require('path');
const crypto = require('crypto');
const expressLayouts = require('express-ejs-layouts');
const app = express();

app.use(expressLayouts);

app.set('layout', 'layout'); // Default layout
require('./passport-config')(passport); // Google & GitHub setup
require('dotenv').config(); // Load environment variables
// Session & Flash
app.use(session({
  secret: 'Secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// View + Middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'proof-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// MySQL setup

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


// Auth middleware
const authUser = (req, res, next) => {
  if (req.isAuthenticated() || req.session.user) return next();
  req.flash('error', 'You must be logged in to access this page');
  res.redirect('/login');
};

// Routes
app.get('/', (req, res) => {
  res.render('register', {messages:req.flash('success'), errors:req.flash('error')  });
});
//home 

app.get('/home', (req, res) => {
  res.render('home');
});
// ======================
// Normal Registration
// ======================
// app.get('/register', (req, res) => {
//   res.render('register', {
//     messages: req.flash('success'),
//     errors: req.flash('error')
//   });
// });

app.post('/register', (req, res) => {
  const { username, email, password, roles } = req.body;
  if (!username || !email || !password || !roles) {
    req.flash('error', 'All fields are required!');
    return res.redirect('/');
  }

  const hashed = crypto.createHash('sha1').update(password).digest('hex');
  const sql = "INSERT INTO users (username, email, password, roles, oauth_provider, oauth_id) VALUES (?, ?, ?, ?, NULL, NULL)";
  connection.query(sql, [username, email, hashed, roles], (err) => {
    if (err) {
      req.flash('error', err.code === 'ER_DUP_ENTRY' ? 'Email already registered.' : 'Registration failed.');
      return res.redirect('/');
    }
    req.flash('success', 'Registration successful! You can now log in.');
    res.redirect('/login');
  });
});

// ======================
// Normal Login
// ======================
app.get('/login', (req, res) => {
  res.render('login', {
    messages: req.flash('success'),
    errors: req.flash('error')
  });
});
//login if sucessully then it will store thr session 
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Please enter email and password');
    return res.redirect('/login');
  }
  //hashing here 
  const hashed = crypto.createHash('sha1').update(password).digest('hex');
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  connection.query(sql, [email, hashed], (err, results) => {
    if (err || results.length === 0) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/login');
    }
//set session 
    const user = results[0];
    req.session.user = user;
    req.session.role = user.roles;
    req.flash('success', 'Logged in successfully!');
    res.redirect('/dashboard');
  });
});

// ======================
// Google OAuth
// ======================
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    if (!req.user.username || !req.user.roles) {
      req.session.oauthEmail = req.user.email;
      req.session.oauthProvider = 'google';
      return res.redirect('/complete-profile');
    }
    res.redirect('/dashboard');
  }
);

// ======================
// GitHub OAuth
// ======================
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    if (!req.user.username || !req.user.roles) {
      req.session.oauthEmail = req.user.email;
      req.session.oauthProvider = 'github';
      return res.redirect('/complete-profile');
    }
    res.redirect('/dashboard');
  }
);
app.get('/dashboard', (req , res)=>{
  console.log(req.session.user);
  if(!req.session.user){
    req.flash('error', 'You must be logged in to access this page');
    return res.redirect("/login")
  }
})

// ======================
// Complete Profile (for OAuth)
app.get('/complete-profile', (req, res) => {
  if (!req.session.oauthEmail) return res.redirect('/');
  res.render('complete-profile', { email: req.session.oauthEmail });
});

app.post('/complete-profile', (req, res) => {
  const { username, roles } = req.body;
  const email = req.session.oauthEmail;
  const provider = req.session.oauthProvider;

  if (!username || !roles) {
    req.flash('error', 'Please fill in all fields');
    return res.redirect('/complete-profile');
  }

  const sql = `UPDATE users SET username = ?, roles = ? WHERE email = ? AND oauth_provider = ?`;
  connection.query(sql, [username, roles, email, provider], (err) => {
    if (err) {
      req.flash('error', 'Database error');
      return res.redirect('/complete-profile');
    }

    delete req.session.oauthEmail;
    delete req.session.oauthProvider;

    req.flash('success', 'Profile completed!');
    res.redirect('/dashboard');
  });
});

// ======================
// Dashboard
// ======================
app.get('/dashboard', authUser, (req, res) => {
  const search = req.query.search || '';
  const sql = "SELECT * FROM cca_entries WHERE title LIKE ?";
  connection.query(sql, [`%${search}%`], (err, results) => {
    if (err) return res.status(500).send('Error loading dashboard');
    res.render('dashboard', { entries: results, search });
  });
});

// ======================
// Edit CCA Entry
// ======================
app.get('/editCCA/:id', authUser, (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM cca_entries WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).send("Error loading entry");
    res.render('editCCA', { entry: result[0] });
  });
});

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
