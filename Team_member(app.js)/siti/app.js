const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');

const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Group5@123?',
    database: 'igconnect',
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    }
});

const upload = multer({ storage: storage });


// Set up view engine
app.set('view engine', 'ejs');
// enable static files
app.use(express.static('public'));
// enable form processing
app.use(express.urlencoded({
    extended: false
}));
// enable JSON body parsing
app.use(express.json());

// Session Middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    // Session expires after 1 week of inactivity
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } 
}));

app.use(flash());

// Middleware to check if user is logged in
const checkAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        req.flash('error', 'Please log in to view this resource');
        res.redirect('/login');
    }
};

// Middleware to check if user is admin
const checkAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        req.flash('error', 'Access denied');
        res.redirect('/'); 
    }
};

// Middleware for form validation (for user registration)
const validateRegistration = (req, res, next) => {
    const { username, email, password, address, contact, role } = req.body;

    if (!username || !email || !password || !address || !contact || !role) {
        req.flash('error', 'All fields are required.');
        req.flash('formData', req.body);
        return res.redirect('/register');
    }
    
    if (password.length < 6) {
        req.flash('error', 'Password should be at least 6 or more characters long');
        req.flash('formData', req.body);
        return res.redirect('/register');
    }
    next();
};

// --- User Authentication Routes (Re-added as they are essential for roles/members access with session/flash) ---
app.get('/',  (req, res) => {
    res.render('index', {user: req.session.user} );
});

app.get('/register', (req, res) => {
    res.render('register', { messages: req.flash('error'), formData: req.flash('formData')[0] });
});

app.post('/register', validateRegistration, (req, res) => {
    const { username, email, password, address, contact, role } = req.body;
    const sql = 'INSERT INTO users (username, email, password, address, contact, role) VALUES (?, ?, SHA1(?), ?, ?, ?)';
    connection.query(sql, [username, email, password, address, contact, role], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY' && err.sqlMessage.includes('email')) {
                req.flash('error', 'Email already registered.');
                req.flash('formData', req.body);
                return res.redirect('/register');
            }
            console.error('Error during registration:', err);
            req.flash('error', 'Registration failed. Please try again.');
            req.flash('formData', req.body);
            return res.redirect('/register');
        }
        console.log(result);
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');
    });
});

app.get('/login', (req, res) => {
    res.render('login', { messages: req.flash('success'), errors: req.flash('error') });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/login');
    }

    const sql = 'SELECT * FROM users WHERE email = ? AND password = SHA1(?)';
    connection.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            req.flash('error', 'An error occurred during login.');
            return res.redirect('/login');
        }

        if (results.length > 0) {
            req.session.user = results[0]; 
            req.flash('success', 'Login successful!');
            // Redirect based on role
            if(req.session.user.role === 'admin') {
                res.redirect('/members'); // Admins go to members list
            } else {
                res.redirect('/'); // Regular users go to home or a user dashboard
            }
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


// --- IG ROLES ROUTES ---
// View all IG roles
app.get('/ig_roles', checkAuthenticated, (req, res) => {
    connection.query('SELECT * FROM ig_roles', (error, results) => {
        if (error) {
            console.error('Error fetching IG roles:', error);
            return res.status(500).send('Error fetching IG roles');
        }
        res.render('ig_roles_list', { igRoles: results, user: req.session.user });
    });
});

// Add new IG role form
app.get('/addIgRole', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('addIgRole', { user: req.session.user });
});

// Add new IG role
app.post('/addIgRole', checkAuthenticated, checkAdmin, (req, res) => {
    const { title, description } = req.body;
    const sql = 'INSERT INTO ig_roles (title, description) VALUES (?, ?)';
    connection.query(sql, [title, description], (error, results) => {
        if (error) {
            console.error('Error adding IG role:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                req.flash('error', 'Role with this title already exists.');
                return res.redirect('/addIgRole');
            }
            return res.status(500).send('Error adding IG role');
        }
        req.flash('success', 'IG Role added successfully!');
        res.redirect('/ig_roles');
    });
});

// Get data for updating an IG role
app.get('/updateIgRole/:id', checkAuthenticated, checkAdmin, (req, res) => {
    const roleId = req.params.id;
    connection.query('SELECT * FROM ig_roles WHERE id = ?', [roleId], (error, results) => {
        if (error) {
            console.error('Error fetching IG role for update:', error);
            return res.status(500).send('Error fetching IG role');
        }
        if (results.length > 0) {
            res.render('updateIgRole', { igRole: results[0], user: req.session.user });
        } else {
            res.status(404).send('IG Role not found');
        }
    });
});

// Update IG role
app.post('/updateIgRole/:id', checkAuthenticated, checkAdmin, (req, res) => {
    const roleId = req.params.id;
    const { title, description } = req.body;
    const sql = 'UPDATE ig_roles SET title = ?, description = ? WHERE id = ?';
    connection.query(sql, [title, description, roleId], (error, results) => {
        if (error) {
            console.error('Error updating IG role:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                req.flash('error', 'Role with this title already exists.');
                return res.redirect(`/updateIgRole/${roleId}`);
            }
            return res.status(500).send('Error updating IG role');
        }
        req.flash('success', 'IG Role updated successfully!');
        res.redirect('/ig_roles');
    });
});

// Delete IG role
app.get('/deleteIgRole/:id', checkAuthenticated, checkAdmin, (req, res) => {
    const roleId = req.params.id;
    // First, check if any members are associated with this role
    connection.query('SELECT COUNT(*) AS count FROM members WHERE role_id = ?', [roleId], (error, results) => {
        if (error) {
            console.error('Error checking members for role deletion:', error);
            return res.status(500).send('Error checking members');
        }
        if (results[0].count > 0) {
            req.flash('error', 'Cannot delete role: Members are currently assigned to this role.');
            return res.redirect('/ig_roles');
        }

        // If no members are assigned, proceed with deletion
        connection.query('DELETE FROM ig_roles WHERE id = ?', [roleId], (deleteError, deleteResults) => {
            if (deleteError) {
                console.error('Error deleting IG role:', deleteError);
                return res.status(500).send('Error deleting IG role');
            }
            req.flash('success', 'IG Role deleted successfully!');
            res.redirect('/ig_roles');
        });
    });
});


// --- IG MEMBERS ROUTES ---
// View all members
app.get('/members', checkAuthenticated, (req, res) => {
    const sql = `
        SELECT m.id, m.student_id, m.ig_id, ir.title AS role_name, m.joined_date
        FROM members m
        JOIN ig_roles ir ON m.role_id = ir.id
    `;
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Error fetching members:', error);
            return res.status(500).send('Error fetching members');
        }
        res.render('members_list', { members: results, user: req.session.user });
    });
});

// Add new member form
app.get('/addMember', checkAuthenticated, checkAdmin, (req, res) => {
    // Fetch roles to populate a dropdown
    connection.query('SELECT id, title FROM ig_roles', (error, roles) => {
        if (error) {
            console.error('Error fetching roles for add member form:', error);
            return res.status(500).send('Error fetching roles');
        }
        res.render('addMember', { roles: roles, user: req.session.user });
    });
});

// Add new member
app.post('/addMember', checkAuthenticated, checkAdmin, (req, res) => {
    const { student_id, ig_id, role_id, joined_date } = req.body;
    const sql = 'INSERT INTO members (student_id, ig_id, role_id, joined_date) VALUES (?, ?, ?, ?)';
    connection.query(sql, [student_id, ig_id, role_id, joined_date], (error, results) => {
        if (error) {
            console.error('Error adding member:', error);
            return res.status(500).send('Error adding member');
        }
        req.flash('success', 'Member added successfully!');
        res.redirect('/members');
    });
});

// Get data for updating a member's role
app.get('/updateMember/:id', checkAuthenticated, checkAdmin, (req, res) => {
    const memberId = req.params.id;
    const sqlMember = `
        SELECT m.id, m.student_id, m.ig_id, m.role_id, m.joined_date, ir.title AS role_name
        FROM members m
        JOIN ig_roles ir ON m.role_id = ir.id
        WHERE m.id = ?
    `;
    connection.query(sqlMember, [memberId], (error, memberResults) => {
        if (error) {
            console.error('Error fetching member for update:', error);
            return res.status(500).send('Error fetching member');
        }
        if (memberResults.length === 0) {
            return res.status(404).send('Member not found');
        }

        connection.query('SELECT id, title FROM ig_roles', (roleError, roleResults) => {
            if (roleError) {
            console.error('Error fetching roles for update member form:', roleError);
                return res.status(500).send('Error fetching roles');
            }
            res.render('updateMember', { member: memberResults[0], roles: roleResults, user: req.session.user });
        });
    });
});

// Update member's role
app.post('/updateMember/:id', checkAuthenticated, checkAdmin, (req, res) => {
    const memberId = req.params.id;
    const { student_id, ig_id, role_id, joined_date } = req.body;
    const sql = 'UPDATE members SET student_id = ?, ig_id = ?, role_id = ?, joined_date = ? WHERE id = ?';
    connection.query(sql, [student_id, ig_id, role_id, joined_date, memberId], (error, results) => {
        if (error) {
            console.error('Error updating member:', error);
            return res.status(500).send('Error updating member');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Member not found');
        }
        req.flash('success', 'Member updated successfully!');
        res.redirect('/members');
    });
});

// Remove member
app.get('/deleteMember/:id', checkAuthenticated, checkAdmin, (req, res) => {
    const memberId = req.params.id;
    connection.query('DELETE FROM members WHERE id = ?', [memberId], (error, results) => {
        if (error) {
            console.error('Error deleting member:', error);
            return res.status(500).send('Error deleting member');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Member not found');
        }
        req.flash('success', 'Member removed successfully!');
        res.redirect('/members');
    });
});

// Search members by IG and student name
app.get('/searchMembers', checkAuthenticated, (req, res) => {
    const { ig_id, student_name } = req.query;
    let sql = `
        SELECT m.id, m.student_id, m.ig_id, ir.title AS role_name, m.joined_date
        FROM members m
        JOIN ig_roles ir ON m.role_id = ir.id
        WHERE 1=1
    `;
    const queryParams = [];

    if (ig_id) {
        sql += ' AND m.ig_id = ?';
        queryParams.push(ig_id);
    }
    if (student_name) {
        sql += ' AND m.student_id LIKE ?';
        queryParams.push(`%${student_name}%`);
    }

    connection.query(sql, queryParams, (error, results) => {
        if (error) {
            console.error('Error searching members:', error);
            return res.status(500).send('Error searching members');
        }
        res.render('members_list', { members: results, user: req.session.user, searchPerformed: true });
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));