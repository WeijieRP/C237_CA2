const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const app = express();

// MySQL Connection
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
        process.exit(1); // Graceful exit on DB error
    }
    console.log('Connected to MySQL database: igconnect');
});

// Middleware Setup
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'supersecretkey',  // Use env variable in production
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Simulate Logged-In User (For Testing)
app.use((req, res, next) => {
    if (!req.session.user) {
        req.session.user = {
            id: 100,
            username: 'TestAdmin',
            role: 'admin' // Change to 'user' for student
        };
    }
    next();
});

// Role Middleware
const checkAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        req.flash('error', 'Please log in first.');
        res.redirect('/login');
    }
};

const checkAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        req.flash('error', 'Access denied. Admin only.');
        res.redirect('/');
    }
};

// ---------- INTEREST GROUP CATEGORIES ----------

// View all categories
app.get('/categories', checkAuthenticated, (req, res) => {
    const sql = 'SELECT * FROM ig_categories';
    connection.query(sql, (err, results) => {
        if (err) {
            req.flash('error', 'Error fetching categories.');
            return res.redirect('/');
        }
        res.render('viewCategories', { categories: results, user: req.session.user });
    });
});

// Add category form
app.get('/addCategory', checkAuthenticated, checkAdmin, (req, res) => {
    res.render('addCategory', { user: req.session.user });
});

// Add category
app.post('/addCategory', checkAuthenticated, checkAdmin, (req, res) => {
    const { name, description } = req.body;
    const sql = 'INSERT INTO ig_categories (name, description) VALUES (?, ?)';
    connection.query(sql, [name, description], (err) => {
        if (err) {
            req.flash('error', 'Failed to add category.');
            return res.redirect('/categories');
        }
        req.flash('success', 'Category added successfully.');
        res.redirect('/categories');
    });
});

// Edit category form
app.get('/editCategory/:id', checkAuthenticated, checkAdmin, (req, res) => {
    const sql = 'SELECT * FROM ig_categories WHERE id = ?';
    connection.query(sql, [req.params.id], (err, results) => {
        if (err || results.length === 0) {
            req.flash('error', 'Category not found.');
            return res.redirect('/categories');
        }
        res.render('editCategory', { category: results[0], user: req.session.user });
    });
});

// Update category
app.post('/editCategory/:id', checkAuthenticated, checkAdmin, (req, res) => {
    const { name, description } = req.body;
    const sql = 'UPDATE ig_categories SET name = ?, description = ? WHERE id = ?';
    connection.query(sql, [name, description, req.params.id], (err) => {
        if (err) {
            req.flash('error', 'Failed to update category.');
            return res.redirect('/categories');
        }
        req.flash('success', 'Category updated successfully.');
        res.redirect('/categories');
    });
});

// Delete category
app.get('/deleteCategory/:id', checkAuthenticated, checkAdmin, (req, res) => {
    const sql = 'DELETE FROM ig_categories WHERE id = ?';
    connection.query(sql, [req.params.id], (err) => {
        if (err) {
            req.flash('error', 'Failed to delete category.');
            return res.redirect('/categories');
        }
        req.flash('success', 'Category deleted.');
        res.redirect('/categories');
    });
});

// ---------- INTEREST GROUPS ----------

// View all IGs
app.get('/ig', checkAuthenticated, (req, res) => {
    const sql = 'SELECT * FROM interest_groups';
    connection.query(sql, (err, results) => {
        if (err) {
            req.flash('error', 'Error fetching IGs.');
            return res.redirect('/');
        }
        res.render('viewIGs', { igs: results, user: req.session.user });
    });
});

// Add IG form
app.get('/addIG', checkAuthenticated, checkAdmin, (req, res) => {
    connection.query('SELECT * FROM ig_categories', (err, categories) => {
        if (err) {
            req.flash('error', 'Error loading form.');
            return res.redirect('/ig');
        }
        res.render('addIG', { categories, user: req.session.user });
    });
});

// Add IG
app.post('/addIG', checkAuthenticated, checkAdmin, (req, res) => {
    const { name, category_id, description, school_id, meeting_schedule } = req.body;
    const sql = 'INSERT INTO interest_groups (name, category_id, description, school_id, meeting_schedule) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [name, category_id, description, school_id, meeting_schedule], (err) => {
        if (err) {
            req.flash('error', 'Failed to add IG.');
            return res.redirect('/ig');
        }
        req.flash('success', 'Interest Group added.');
        res.redirect('/ig');
    });
});

// Edit IG form
app.get('/editIG/:id', checkAuthenticated, checkAdmin, (req, res) => {
    connection.query('SELECT * FROM interest_groups WHERE id = ?', [req.params.id], (err, results) => {
        if (err || results.length === 0) {
            req.flash('error', 'IG not found.');
            return res.redirect('/ig');
        }
        connection.query('SELECT * FROM ig_categories', (catErr, categories) => {
            if (catErr) {
                req.flash('error', 'Error loading categories.');
                return res.redirect('/ig');
            }
            res.render('editIG', { ig: results[0], categories, user: req.session.user });
        });
    });
});

// Update IG
app.post('/editIG/:id', checkAuthenticated, checkAdmin, (req, res) => {
    const { name, category_id, description, school_id, meeting_schedule } = req.body;
    const sql = 'UPDATE interest_groups SET name = ?, category_id = ?, description = ?, school_id = ?, meeting_schedule = ? WHERE id = ?';
    connection.query(sql, [name, category_id, description, school_id, meeting_schedule, req.params.id], (err) => {
        if (err) {
            req.flash('error', 'Failed to update IG.');
            return res.redirect('/ig');
        }
        req.flash('success', 'Interest Group updated.');
        res.redirect('/ig');
    });
});

// Delete IG
app.get('/deleteIG/:id', checkAuthenticated, checkAdmin, (req, res) => {
    const sql = 'DELETE FROM interest_groups WHERE id = ?';
    connection.query(sql, [req.params.id], (err) => {
        if (err) {
            req.flash('error', 'Failed to delete IG.');
            return res.redirect('/ig');
        }
        req.flash('success', 'Interest Group deleted.');
        res.redirect('/ig');
    });
});

// ---------- Default Route ----------
app.get('/', (req, res) => {
    res.redirect('/ig');
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
