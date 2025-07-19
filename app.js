const express = require('express');
const multer = require("multer");
const mysql = require("mysql2");
const session = require('express-session');
const flash = require("connect-flash");
const path = require('path');
const validator = require('validator');
const app = express();

// MySQL Setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Group5@123?',
  database: 'igconnect'
});
connection.connect(err => {
  if (err) return console.error('❌ MySQL error:', err);
  console.log('✅ MySQL connected');
});

// Multer Setup (for image uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'proof-' + unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Middleware Setup
app.use(session({
  secret: 'Secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));
app.use(flash());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Auth Middleware
const authUser = (req, res, next) => {
  if (req.session.user) return next();
  req.flash("errorMsg", "Please log in to access this page.");
  return res.redirect('/login');
};

// Home Redirect
app.get('/', (req, res) => res.redirect('/login'));

// ---------- Login ----------
app.get('/login', (req, res) => {
  res.render('login', {
    successMsg: req.flash('successMsg'),
    errorMsg: req.flash('errorMsg')
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('errorMsg', 'Please fill in all fields.');
    return res.redirect('/login');
  }

  if (!validator.isEmail(email)) {
    req.flash('errorMsg', 'Invalid email format.');
    return res.redirect('/login');
  }

  const sql = "SELECT * FROM users WHERE email = ? AND password = SHA1(?)";
  connection.query(sql, [email, password], (err, results) => {
    if (err) {
      req.flash('errorMsg', 'Database error');
      return res.redirect('/login');
    }
    if (results.length > 0) {
      req.session.user = results[0];
      req.flash('successMsg', 'Login successful!');
      return res.redirect(results[0].roles === 'admin' ? '/admindashboard' : '/studentdashboard');
    } else {
      req.flash('errorMsg', 'Invalid email or password');
      return res.redirect('/login');
    }
  });
});

// ---------- Register ----------
app.get('/register', (req, res) => {
  res.render('register', {
    successMsg: req.flash('successMsg'),
    errorMsg: req.flash('errorMsg')
  });
});

app.post('/register', (req, res) => {
  const { username, email, password, roles } = req.body;

  if (!username || !email || !password || !roles) {
    req.flash('errorMsg', 'Please fill in all fields.');
    return res.redirect('/register');
  }

  if (!validator.isEmail(email)) {
    req.flash('errorMsg', 'Invalid email format.');
    return res.redirect('/register');
  }

  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
  if (!strongPassword.test(password)) {
    req.flash('errorMsg', 'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.');
    return res.redirect('/register');
  }

  const checkSql = "SELECT * FROM users WHERE email = ?";
  connection.query(checkSql, [email], (err, results) => {
    if (results.length > 0) {
      req.flash('errorMsg', 'Email already exists.');
      return res.redirect('/register');
    }

    const insertSql = "INSERT INTO users (username, email, password, roles) VALUES (?, ?, SHA1(?), ?)";
    connection.query(insertSql, [username, email, password, roles], (error) => {
      if (error) {
        req.flash('errorMsg', 'Database error.');
        return res.redirect('/register');
      }
      req.flash('successMsg', 'Registration successful! Please log in.');
      return res.redirect('/login');
    });
  });
});

// ---------- Reset Password ----------
app.get('/reset-password', (req, res) => {
  res.render('reset-password', {
    successMsg: req.flash('successMsg'),
    errorMsg: req.flash('errorMsg')
  });
});

app.post('/reset-password', (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (!email || !newPassword || !confirmPassword) {
    req.flash('errorMsg', 'Please fill in all fields.');
    return res.redirect('/reset-password');
  }

  if (!validator.isEmail(email)) {
    req.flash('errorMsg', 'Invalid email format.');
    return res.redirect('/reset-password');
  }

  const checkUserSql = "SELECT * FROM users WHERE email = ?";
  connection.query(checkUserSql, [email], (err, results) => {
    if (err) {
      req.flash('errorMsg', 'Database error occurred.');
      return res.redirect('/reset-password');
    }

    if (results.length === 0) {
      req.flash('errorMsg', 'No account found with that email.');
      return res.redirect('/reset-password');
    }

    if (newPassword !== confirmPassword) {
      req.flash('errorMsg', 'Passwords do not match.');
      return res.redirect('/reset-password');
    }

    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    if (!strongPassword.test(newPassword)) {
      req.flash('errorMsg', 'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.');
      return res.redirect('/reset-password');
    }

    const updateSql = "UPDATE users SET password = SHA1(?) WHERE email = ?";
    connection.query(updateSql, [newPassword, email], (err) => {
      if (err) {
        req.flash('errorMsg', 'Failed to update password.');
        return res.redirect('/reset-password');
      }

      req.flash('successMsg', 'Password updated successfully! You may now log in.');
      return res.redirect('/login');
    });
  });
});

// ---------- Dashboards ----------
app.get("/admindashboard", authUser, (req, res) => {
  if (req.session.user.roles === "admin") {
    return res.render("admindashboard", {
      user: req.session.user.username,
      successMsg: req.flash('successMsg'),
      errorMsg: req.flash('errorMsg')
    });
  } else {
    req.flash('errorMsg', 'Access denied. Admins only.');
    return res.redirect('/studentdashboard');
  }
});

app.get("/studentdashboard", authUser, (req, res) => {
  if (req.session.user.roles === "student") {
    return res.render("studentdashboard", {
      user: req.session.user.username,
      successMsg: req.flash('successMsg'),
      errorMsg: req.flash('errorMsg')
    });
  } else {
    req.flash('errorMsg', 'Access denied. Students only.');
    return res.redirect('/admindashboard');
  }
});

// Start Server
app.listen(3001, () => {
  console.log('🚀 Server is running on http://localhost:3001');
});
