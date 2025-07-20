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
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database: igconnect');
});

// Set up multer for file uploads (retained, but not actively used by IG Roles/Members routes)
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
    secret: 'secret', // CHANGE THIS TO A STRONG, UNIQUE SECRET IN PRODUCTION
    resave: false,
    saveUninitialized: true,
    // Session expires after 1 week of inactivity
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } 
}));

app.use(flash());

// *************************************************************************
// TEMPORARY: Simulate a logged-in USER (student) for direct feature testing
// REMOVE OR COMMENT OUT THIS BLOCK FOR PRODUCTION WITH AUTHENTICATION
app.use((req, res, next) => {
    if (!req.session.user) {
        req.session.user = {
            id: 100, // Dummy ID for a student
            username: 'TestStudent',
            email: 'student@example.com',
            role: 'user' // <<<<<< IMPORTANT: Set to 'user' for student role
        };
    }
    next();
});
// *************************************************************************

// Middleware to check if user is logged in (NOW ACTIVE)
const checkAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        req.flash('error', 'Please log in to view this resource');
        res.redirect('/login'); // Redirect to login if not authenticated
    }
};

// Middleware to check if user is admin (NOW ACTIVE)
const checkAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        req.flash('error', 'Access denied. You must be an administrator.');
        res.redirect('/'); // Redirect to home or another appropriate page
    }
};

// Middleware for form validation (for user registration) (RETAINED, BUT NOT USED IF REGISTER ROUTE IS COMMENTED)
const validateRegistration = (req, res, next) => {
    const { username, email, password, address, contact, role } = req.body;

    if (!username || !email || !password || !address || !contact || !role) {
        req.flash('error', 'All fields are required.');
        req.flash('formData', req.body);
        return res.redirect('/register');
    }
    
    if (password.length < 6) {
        req.flash('error', 'Password should be at least 6 characters long.');
        req.flash('formData', req.body);
        return res.redirect('/register');
    }
    next();
};

// --- User Authentication Routes (Still commented out for direct access, but logic is active) ---
app.get('/', (req, res) => {
    // For direct testing, we redirect directly to members list for user view
    res.redirect('/members'); 
    // Original line (uncomment for full auth):
    // res.render('index', { 
    //     user: req.session.user, 
    //     messages: req.flash('success'), 
    //     errors: req.flash('error') 
    // });
});

// login/register/logout routes remain commented out for this specific testing scenario
// app.get('/register', ...);
// app.post('/register', ...);
// app.get('/login', ...);
// app.post('/login', ...);
// app.get('/logout', ...);


// --- IG ROLES ROUTES ---
// View all IG roles (User role can view)
app.get('/ig_roles', checkAuthenticated, (req, res) => {
    connection.query('SELECT * FROM ig_roles', (error, results) => {
        if (error) {
            console.error('Error fetching IG roles:', error);
            req.flash('error', 'Error fetching IG roles: ' + error.message);
            return res.redirect('/');
        }
        res.render('ig_roles_list', { 
            igRoles: results, 
            user: req.session.user, 
            messages: req.flash('success'), 
            errors: req.flash('error') 
        });
    });
});

// Add new IG role form (Admin only - protected by checkAdmin)
app.get('/addIgRole', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('addIgRole', { 
        user: req.session.user, 
        messages: req.flash('success'), 
        errors: req.flash('error') 
    });
});

// Add new IG role (Admin only - protected by checkAdmin)
app.post('/addIgRole', checkAuthenticated, checkAdmin, (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        req.flash('error', 'Title is required for IG Role.');
        return res.redirect('/addIgRole');
    }
    const sql = 'INSERT INTO ig_roles (title, description) VALUES (?, ?)';
    connection.query(sql, [title, description], (error, results) => {
        if (error) {
            console.error('Error adding IG role:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                req.flash('error', 'Role with this title already exists.');
                return res.redirect('/addIgRole');
            }
            req.flash('error', 'Error adding IG role: ' + error.message);
            return res.redirect('/ig_roles');
        }
        req.flash('success', 'IG Role added successfully!');
        res.redirect('/ig_roles');
    });
});

// Get data for updating an IG role (Admin only - protected by checkAdmin)
app.get('/updateIgRole/:id', checkAuthenticated, checkAdmin, (req, res) => {
    const roleId = req.params.id;
    connection.query('SELECT * FROM ig_roles WHERE id = ?', [roleId], (error, results) => {
        if (error) {
            console.error('Error fetching IG role for update:', error);
            req.flash('error', 'Error fetching IG role: ' + error.message);
            return res.redirect('/ig_roles');
        }
        if (results.length > 0) {
            res.render('updateIgRole', { 
                igRole: results[0], 
                user: req.session.user, 
                messages: req.flash('success'), 
                errors: req.flash('error') 
            });
        } else {
            req.flash('error', 'IG Role not found.');
            res.redirect('/ig_roles');
        }
    });
});

// Update IG role (Admin only - protected by checkAdmin)
app.post('/updateIgRole/:id', checkAuthenticated, checkAdmin, (req, res) => {
    const roleId = req.params.id;
    const { title, description } = req.body;
    if (!title) {
        req.flash('error', 'Title is required for IG Role update.');
        return res.redirect(`/updateIgRole/${roleId}`);
    }
    const sql = 'UPDATE ig_roles SET title = ?, description = ? WHERE id = ?';
    connection.query(sql, [title, description, roleId], (error, results) => {
        if (error) {
            console.error('Error updating IG role:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                req.flash('error', 'Role with this title already exists.');
                return res.redirect(`/updateIgRole/${roleId}`);
            }
            req.flash('error', 'Error updating IG role: ' + error.message);
            return res.redirect('/ig_roles');
        }
        if (results.affectedRows === 0) {
            req.flash('error', 'IG Role not found or no changes made.');
        } else {
            req.flash('success', 'IG Role updated successfully!');
        }
        res.redirect('/ig_roles');
    });
});

// Delete IG role (Admin only - protected by checkAdmin)
app.get('/deleteIgRole/:id', checkAuthenticated, checkAdmin, (req, res) => {
    const roleId = req.params.id;
    // First, check if any members are associated with this role
    connection.query('SELECT COUNT(*) AS count FROM members WHERE role_id = ?', [roleId], (error, results) => {
        if (error) {
            console.error('Error checking members for role deletion:', error);
            req.flash('error', 'Error checking members for role deletion: ' + error.message);
            return res.redirect('/ig_roles');
        }
        if (results[0].count > 0) {
            req.flash('error', 'Cannot delete role: Members are currently assigned to this role.');
            return res.redirect('/ig_roles');
        }

        // If no members are assigned, proceed with deletion
        connection.query('DELETE FROM ig_roles WHERE id = ?', [roleId], (deleteError, deleteResults) => {
            if (deleteError) {
                console.error('Error deleting IG role:', deleteError);
                req.flash('error', 'Error deleting IG role: ' + deleteError.message);
                return res.redirect('/ig_roles');
            }
            if (deleteResults.affectedRows === 0) {
                req.flash('error', 'IG Role not found for deletion.');
            } else {
                req.flash('success', 'IG Role deleted successfully!');
            }
            res.redirect('/ig_roles');
        });
    });
});


// --- IG MEMBERS ROUTES ---
// View all members (User role can view)
app.get('/members', checkAuthenticated, (req, res) => {
    const sql = `
        SELECT m.id, m.student_id, m.ig_id, ir.title AS role_name, m.joined_date
        FROM members m
        JOIN ig_roles ir ON m.role_id = ir.id
    `;
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Error fetching members:', error);
            req.flash('error', 'Error fetching members: ' + error.message);
            return res.redirect('/');
        }
        res.render('members_list', { 
            members: results, 
            user: req.session.user, 
            searchPerformed: false, 
            messages: req.flash('success'), 
            errors: req.flash('error') 
        });
    });
});

// Add new member form (Admin only - protected by checkAdmin)
app.get('/addMember', checkAuthenticated, checkAdmin, (req, res) => {
    // Fetch roles to populate a dropdown
    connection.query('SELECT id, title FROM ig_roles', (error, roles) => {
        if (error) {
            console.error('Error fetching roles for add member form:', error);
            req.flash('error', 'Error fetching roles for form: ' + error.message);
            return res.redirect('/members');
        }
        res.render('addMember', { 
            roles: roles, 
            user: req.session.user, 
            messages: req.flash('success'), 
            errors: req.flash('error') 
        });
    });
});

// Add new member (Admin only - protected by checkAdmin)
app.post('/addMember', checkAuthenticated, checkAdmin, (req, res) => {
    const { student_id, ig_id, role_id, joined_date } = req.body;
    if (!student_id || !ig_id || !role_id || !joined_date) {
        req.flash('error', 'All fields are required for adding a member.');
        return res.redirect('/addMember');
    }
    const sql = 'INSERT INTO members (student_id, ig_id, role_id, joined_date) VALUES (?, ?, ?, ?)';
    connection.query(sql, [student_id, ig_id, role_id, joined_date], (error, results) => {
        if (error) {
            console.error('Error adding member:', error);
            req.flash('error', 'Error adding member: ' + error.message);
            return res.redirect('/addMember');
        }
        req.flash('success', 'Member added successfully!');
        res.redirect('/members');
    });
});

// Get data for updating a member's role (Admin only - protected by checkAdmin)
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
            req.flash('error', 'Error fetching member: ' + error.message);
            return res.redirect('/members');
        }
        if (memberResults.length === 0) {
            req.flash('error', 'Member not found.');
            return res.redirect('/members');
        }

        connection.query('SELECT id, title FROM ig_roles', (roleError, roleResults) => {
            if (roleError) {
                console.error('Error fetching roles for update member form:', roleError);
                req.flash('error', 'Error fetching roles for form: ' + roleError.message);
                return res.redirect('/members');
            }
            res.render('updateMember', { 
                member: memberResults[0], 
                roles: roleResults, 
                user: req.session.user, 
                messages: req.flash('success'), 
                errors: req.flash('error') 
            });
        });
    });
});

// Update member's role (Admin only - protected by checkAdmin)
app.post('/updateMember/:id', checkAuthenticated, checkAdmin, (req, res) => {
    const memberId = req.params.id;
    const { student_id, ig_id, role_id, joined_date } = req.body;
    if (!student_id || !ig_id || !role_id || !joined_date) {
        req.flash('error', 'All fields are required for updating a member.');
        return res.redirect(`/updateMember/${memberId}`);
    }
    const sql = 'UPDATE members SET student_id = ?, ig_id = ?, role_id = ?, joined_date = ? WHERE id = ?';
    connection.query(sql, [student_id, ig_id, role_id, joined_date, memberId], (error, results) => {
        if (error) {
            console.error('Error updating member:', error);
            req.flash('error', 'Error updating member: ' + error.message);
            return res.redirect(`/updateMember/${memberId}`);
        }
        if (results.affectedRows === 0) {
            req.flash('error', 'Member not found or no changes made.');
        } else {
            req.flash('success', 'Member updated successfully!');
        }
        res.redirect('/members');
    });
});

// Remove member (Admin only - protected by checkAdmin)
app.get('/deleteMember/:id', checkAuthenticated, checkAdmin, (req, res) => {
    const memberId = req.params.id;
    connection.query('DELETE FROM members WHERE id = ?', [memberId], (error, results) => {
        if (error) {
            console.error('Error deleting member:', error);
            req.flash('error', 'Error deleting member: ' + error.message);
            return res.redirect('/members');
        }
        if (results.affectedRows === 0) {
            req.flash('error', 'Member not found for deletion.');
        } else {
            req.flash('success', 'Member removed successfully!');
        }
        res.redirect('/members');
    });
});

// Search members by IG and student name (User role can search)
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
        sql += ' AND m.ig_id LIKE ?';
        queryParams.push(`%${ig_id}%`);
    }
    if (student_name) {
        sql += ' AND m.student_id LIKE ?';
        queryParams.push(`%${student_name}%`);
    }

    connection.query(sql, queryParams, (error, results) => {
        if (error) {
            console.error('Error searching members:', error);
            req.flash('error', 'Error searching members: ' + error.message);
            return res.redirect('/members');
        }
        res.render('members_list', { 
            members: results, 
            user: req.session.user, 
            searchPerformed: true, 
            req: req, 
            messages: req.flash('success'), 
            errors: req.flash('error') 
        });
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));