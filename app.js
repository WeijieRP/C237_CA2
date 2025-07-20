const express = require('express');
const multer = require("multer");
const mysql = require("mysql2");
const session = require('express-session');
const flash = require("connect-flash");
const path = require('path');
const validator = require('validator');
const app = express();
const moment = require('moment'); // npm install moment
    const checkDiskSpace = require('check-disk-space').default;

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

// ---------- Middleware ----------
const authUser = (req, res, next) => {
  if (req.session.user) return next();
  req.flash("errorMsg", "Please log in to access this page.");
  return res.redirect('/login');
};

const authAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.roles === 'admin') return next();
  req.flash("errorMsg", "Access denied. Admins only.");
  return res.redirect('/login');
};

// ---------- Logout ----------
app.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error('❌ Session destruction error:', err);
        return res.redirect('/home');
      }
      req.flash("successMsg", "You have been logged out successfully.");
      return res.redirect('/login');
    });
  } else {
    return res.redirect('/login');
  }
});

// ---------- Home ----------
app.get('/', (req, res) => res.redirect('/login'));
app.get('/home', (req, res) => res.render('studentdashboard'));

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
    req.flash('errorMsg', 'Password must include uppercase, lowercase, number, symbol.');
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
      req.flash('errorMsg', 'Password must include uppercase, lowercase, number, symbol.');
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
app.get("/ManageIG" , (req , res)=>{
  sql = "SELECT * FROM interest_groups";
  connection.query(sql, (err, results) => {
    if (err) {  
      throw new Error("Failed to fetch IGs.");
    }else{
      if(results.length===0){
        req.flash("message", "No Interest Groups found.");
      }
      return res.render("ManagerIG", { igList: results, message: req.flash("message"), successMsg: req.flash("successMsg") });

    }
  }
  )
})
// Admin Dashboard Route
app.get("/admindashboard", authAdmin, async (req, res) => {
  try {
    // 🧠 System Health: Server + DB + Storage
    const serverStatus = '✅ Online';

    const start = Date.now();
    await connection.promise().query('SELECT 1'); // Ping DB
    const dbLatency = Date.now() - start;

    let storageUsage = 'Unavailable';
    try {
      const disk = await checkDiskSpace('C:/'); // or '/' for Linux/Mac
      const total = disk.size;
      const free = disk.free;
      const used = total - free;
      const percentUsed = ((used / total) * 100).toFixed(1);
      storageUsage = `${percentUsed}% full`;
    } catch (err) {
      console.error('Disk usage error:', err);
      storageUsage = 'Error retrieving';
    }

    const lastBackup = '20 July 2025'; // Simulated

    // 📥 Recent Activities
    const [recentMembers] = await connection.promise().query(`
      SELECT s.name AS student_name, ig.name AS ig_name, m.created_at
      FROM members m
      JOIN students s ON m.student_id = s.id
      JOIN interest_groups ig ON m.ig_id = ig.id
      ORDER BY m.created_at DESC
      LIMIT 3
    `);

    const [recentIGUpdates] = await connection.promise().query(`
      SELECT name, updated_at FROM interest_groups
      ORDER BY updated_at DESC
      LIMIT 3
    `);

    const [recentGallery] = await connection.promise().query(`
      SELECT s.name AS uploaded_by, g.created_at
      FROM galleries g
      JOIN students s ON g.student_id = s.id
      ORDER BY g.created_at DESC
      LIMIT 3
    `);

    const activityFeed = [];
    recentMembers.forEach(m => {
      activityFeed.push({
        msg: `${m.student_name} requested to join ${m.ig_name} IG`,
        time: moment(m.created_at).fromNow()
      });
    });

    recentIGUpdates.forEach(i => {
      activityFeed.push({
        msg: `Admin updated IG “${i.name}”`,
        time: moment(i.updated_at).fromNow()
      });
    });

    recentGallery.forEach(g => {
      activityFeed.push({
        msg: `New gallery uploaded by ${g.uploaded_by}`,
        time: moment(g.created_at).fromNow()
      });
    });

    activityFeed.sort((a, b) => moment(b.time).valueOf() - moment(a.time).valueOf());

    // 📅 Upcoming Events
    const [upcomingEvents] = await connection.promise().query(`
      SELECT e.name, DATE_FORMAT(e.date, '%d %b %Y') AS date, ig.name AS ig_name
      FROM events e
      JOIN interest_groups ig ON e.ig_id = ig.id
      WHERE e.date >= CURDATE() AND e.date <= DATE_ADD(CURDATE(), INTERVAL 14 DAY)
      ORDER BY e.date ASC
    `);

    // 🗨️ Recent Comments
    const [recentComments] = await connection.promise().query(`
      SELECT c.comment, c.created_at, s.name AS commenter
      FROM gallery_comments c
      JOIN students s ON c.student_id = s.id
      ORDER BY c.created_at DESC
      LIMIT 5
    `);

    // 📊 Summary Stats
    const [students] = await connection.promise().query('SELECT COUNT(*) AS count FROM students');
    const [igs] = await connection.promise().query('SELECT COUNT(*) AS count FROM interest_groups');
    const [events] = await connection.promise().query("SELECT COUNT(*) AS count FROM events WHERE date >= CURDATE()");
    const [schools] = await connection.promise().query('SELECT COUNT(*) AS count FROM schools');
    const [gallery] = await connection.promise().query('SELECT COUNT(*) AS count FROM galleries');
    const [achievements] = await connection.promise().query('SELECT COUNT(*) AS count FROM student_achievements');

    // 🔔 Pending Actions
    const [pendingIGs] = await connection.promise().query("SELECT COUNT(*) AS count FROM interest_groups WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
    const [pendingMembers] = await connection.promise().query("SELECT COUNT(*) AS count FROM members WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
    const [pendingGallery] = await connection.promise().query("SELECT COUNT(*) AS count FROM galleries WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
    const [announcements] = await connection.promise().query('SELECT * FROM announcements ORDER BY created_at DESC LIMIT 3');
    // ✅ Render Dashboard
    res.render('admindashboard', {
      totalStudents: students[0].count,
      totalIGs: igs[0].count,
      upcomingEvents: events[0].count,
      totalSchools: schools[0].count,
      totalGallery: gallery[0].count,
      totalAchievements: achievements[0].count,
      pendingIGs: pendingIGs[0].count,
      pendingMembers: pendingMembers[0].count,
      pendingGallery: pendingGallery[0].count,
      recentAnnouncements: announcements,
      activityFeed,
      recentComments,
      serverStatus,
      dbLatency,
      storageUsage,
      lastBackup
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


app.get("/api/events", async (req, res) => {
  try {
    const [rows] = await connection.promise().query(`
      SELECT e.event_name AS title, e.date AS start, ig.name AS ig
      FROM events e
      JOIN interest_groups ig ON e.ig_id = ig.id
    `);

    // Optional: Add IG name as tooltip or extendedProps
    const formattedEvents = rows.map(event => ({
      title: `${event.title} (${event.ig})`,
      start: event.start,
      allDay: true
    }));

    res.json(formattedEvents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load events" });
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

// ---------- Admin: Manage IGs ----------
app.get("/admin/igs", authAdmin, (req, res) => {
  const sql = "SELECT * FROM interest_groups";
  connection.query(sql, (err, results) => {
    if (err) {
      req.flash("errorMsg", "Failed to fetch IGs.");
      return res.render("admin-igs", { igs: [], successMsg: req.flash("successMsg"), errorMsg: req.flash("errorMsg") });
    }
    res.render("admin-igs", {
      igs: results,
      successMsg: req.flash("successMsg"),
      errorMsg: req.flash("errorMsg")
    });
  });
});

// ---------- Start Server ----------
app.listen(3001, () => {
  console.log('🚀 Server is running on http://localhost:3001');
});
