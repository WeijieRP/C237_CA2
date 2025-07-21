const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Group5@123?',
    database: 'igconnect'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Middleware Setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

app.use(flash());

// Pass flash messages to all views
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route: Chatbot Page
app.get('/chat', (req, res) => {
    res.render('chatbot');
});

// Route: View all Interest Groups
app.get('/ig', (req, res) => {
    const sql = 'SELECT * FROM interest_groups';
    db.query(sql, (err, results) => {
        if (err) {
            req.flash('error', 'Error retrieving Interest Groups.');
            return res.redirect('/');
        }
        res.render('viewIGs', { igs: results });
    });
});

// Route: Render Add Interest Group Form
app.get('/addIG', (req, res) => {
    const categoriesSql = 'SELECT * FROM ig_categories';
    const schoolsSql = 'SELECT * FROM schools';

    db.query(categoriesSql, (err, categories) => {
        if (err) return res.status(500).send('Error fetching categories');
        db.query(schoolsSql, (err2, schools) => {
            if (err2) return res.status(500).send('Error fetching schools');
            res.render('addIG', { categories, schools });
        });
    });
});

// Route: Handle Add Interest Group
app.post('/addIG', (req, res) => {
    const { name, category_id, description, school_id, meeting_schedule } = req.body;
    const sql = 'INSERT INTO interest_groups (name, category_id, description, school_id, meeting_schedule) VALUES (?, ?, ?, ?, ?)';

    db.query(sql, [name, category_id, description, school_id, meeting_schedule], (err) => {
        if (err) {
            req.flash('error', 'Failed to add Interest Group.');
            return res.redirect('/ig');
        }
        req.flash('success', 'Interest Group added successfully!');
        res.redirect('/ig');
    });
});

// Route: Render Edit Interest Group Form
app.get('/editIG/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM interest_groups WHERE id = ?';

    db.query(sql, [id], (err, results) => {
        if (err || results.length === 0) {
            req.flash('error', 'Interest Group not found.');
            return res.redirect('/ig');
        }

        const categoriesSql = 'SELECT * FROM ig_categories';
        const schoolsSql = 'SELECT * FROM schools';

        db.query(categoriesSql, (err2, categories) => {
            if (err2) return res.status(500).send('Error fetching categories');
            db.query(schoolsSql, (err3, schools) => {
                if (err3) return res.status(500).send('Error fetching schools');
                res.render('editIG', { ig: results[0], categories, schools });
            });
        });
    });
});

// Route: Handle Edit Interest Group
app.post('/editIG/:id', (req, res) => {
    const id = req.params.id;
    const { name, category_id, description, school_id, meeting_schedule } = req.body;

    const sql = 'UPDATE interest_groups SET name = ?, category_id = ?, description = ?, school_id = ?, meeting_schedule = ? WHERE id = ?';
    db.query(sql, [name, category_id, description, school_id, meeting_schedule, id], (err) => {
        if (err) {
            req.flash('error', 'Failed to update Interest Group.');
            return res.redirect('/ig');
        }
        req.flash('success', 'Interest Group updated successfully!');
        res.redirect('/ig');
    });
});

// Route: Delete Interest Group
app.get('/deleteIG/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM interest_groups WHERE id = ?';

    db.query(sql, [id], (err) => {
        if (err) {
            req.flash('error', 'Failed to delete Interest Group.');
            return res.redirect('/ig');
        }
        req.flash('success', 'Interest Group deleted successfully!');
        res.redirect('/ig');
    });
});

// Route: View Categories
app.get('/categories', (req, res) => {
    const sql = 'SELECT * FROM ig_categories';
    db.query(sql, (err, results) => {
        if (err) {
            req.flash('error', 'Error retrieving categories.');
            return res.redirect('/');
        }
        res.render('viewCategories', { categories: results });
    });
});

// Route: Render Add Category Form
app.get('/addCategory', (req, res) => {
    res.render('addCategory');
});

// Route: Handle Add Category
app.post('/addCategory', (req, res) => {
    const { name, description } = req.body;
    const sql = 'INSERT INTO ig_categories (name, description) VALUES (?, ?)';

    db.query(sql, [name, description], (err) => {
        if (err) {
            req.flash('error', 'Failed to add category.');
            return res.redirect('/categories');
        }
        req.flash('success', 'Category added successfully!');
        res.redirect('/categories');
    });
});

// Route: Render Edit Category Form
app.get('/editCategory/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM ig_categories WHERE id = ?';

    db.query(sql, [id], (err, results) => {
        if (err || results.length === 0) {
            req.flash('error', 'Category not found.');
            return res.redirect('/categories');
        }
        res.render('editCategory', { category: results[0] });
    });
});

// Route: Handle Edit Category
app.post('/editCategory/:id', (req, res) => {
    const id = req.params.id;
    const { name, description } = req.body;
    const sql = 'UPDATE ig_categories SET name = ?, description = ? WHERE id = ?';

    db.query(sql, [name, description, id], (err) => {
        if (err) {
            req.flash('error', 'Failed to update category.');
            return res.redirect('/categories');
        }
        req.flash('success', 'Category updated successfully!');
        res.redirect('/categories');
    });
});

// Route: Delete Category
app.get('/deleteCategory/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM ig_categories WHERE id = ?';

    db.query(sql, [id], (err) => {
        if (err) {
            req.flash('error', 'Failed to delete category.');
            return res.redirect('/categories');
        }
        req.flash('success', 'Category deleted successfully!');
        res.redirect('/categories');
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
