// View  all interest group
app.get('/ig', (req, res) => {
    const sql = 'SELECT * FROM interest_groups';
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving Interest Groups');
        }
        res.render('viewIGs', { igs: results });
    });
});

//add an interest group
app.get('/addIG', (req, res) => {
    const categoriesSql = 'SELECT * FROM ig_categories';
    const schoolsSql = 'SELECT * FROM schools';

    connection.query(categoriesSql, (error, categories) => {
        if (error) {
            console.error('Error fetching categories:', error.message);
            return res.status(500).send('Error fetching categories');
        }
        connection.query(schoolsSql, (err, schools) => {
            if (err) {
                console.error('Error fetching schools:', err.message);
                return res.status(500).send('Error fetching schools');
            }
            res.render('addIG', { categories, schools });
        });
    });
});

app.post('/addIG', (req, res) => {
    const { name, category_id, description, school_id, meeting_schedule } = req.body;
    const sql = 'INSERT INTO interest_groups(name, category_id, description, school_id, meeting_schedule) VALUES(?, ?, ?, ?, ?)';
    connection.query(sql, [name, category_id, description, school_id, meeting_schedule], (error, results) => {
        if (error) {
            console.error("Error adding IG:", error);
            res.status(500).send('Error adding IG');
        } else {
            res.redirect('/ig');
        }
    });
});

// Edit  an interest group
app.get('/editIG/:id', (req, res) => {
    const ig_id = req.params.id;
    const sql = 'SELECT * FROM interest_groups WHERE ig_id = ?';
    connection.query(sql, [ig_id], (error, results) => {
        if (error) {
            console.error('Error fetching IG:', error.message);
            return res.status(500).send('Error fetching IG');
        }
        const categoriesSql = 'SELECT * FROM ig_categories';
        const schoolsSql = 'SELECT * FROM schools';
        connection.query(categoriesSql, (err, categories) => {
            if (err) {
                console.error('Error fetching categories:', err.message);
                return res.status(500).send('Error fetching categories');
            }
            connection.query(schoolsSql, (err2, schools) => {
                if (err2) {
                    console.error('Error fetching schools:', err2.message);
                    return res.status(500).send('Error fetching schools');
                }
                res.render('editIG', { ig: results[0], categories, schools });
            });
        });
    });
});

app.post('/editIG/:id', (req, res) => {
    const ig_id = req.params.id;
    const { name, category_id, description, school_id, meeting_schedule } = req.body;
    const sql = 'UPDATE interest_groups SET name = ?, category_id = ?, description = ?, school_id = ?, meeting_schedule = ? WHERE ig_id = ?';
    connection.query(sql, [name, category_id, description, school_id, meeting_schedule, ig_id], (error, results) => {
        if (error) {
            console.error("Error updating IG:", error);
            res.status(500).send('Error updating IG');
        } else {
            res.redirect('/ig');
        }
    });
});

// Delete  an interest group
app.get('/deleteIG/:id', (req, res) => {
    const ig_id = req.params.id;
    const sql = 'DELETE FROM interest_groups WHERE ig_id = ?';
    connection.query(sql, [ig_id], (error, results) => {
        if (error) {
            console.error("Error deleting IG:", error);
            res.status(500).send('Error deleting IG');
        } else {
            res.redirect('/ig');
        }
    });
});

// View all IG Category
app.get('/categories', (req, res) => {
    const sql = 'SELECT * FROM ig_categories';
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error Retrieving Categories');
        }
        res.render('viewCategories', { categories: results });
    });
});

// Add new IG Category
app.get('/addCategory', (req, res) => {
    res.render('addCategory');
});

app.post('/addCategory', (req, res) => {
    const { name, description } = req.body;
    const sql = 'INSERT INTO ig_categories(name, description) VALUES(?, ?)';
    connection.query(sql, [name, description], (error, results) => {
        if (error) {
            console.error("Error adding category:", error);
            res.status(500).send('Error adding category');
        } else {
            res.redirect('/categories');
        }
    });
});

// Edit IG Category
app.get('/editCategory/:id', (req, res) => {
    const category_id = req.params.id;
    const sql = 'SELECT * FROM ig_categories WHERE id = ?';
    connection.query(sql, [category_id], (error, results) => {
        if (error) {
            console.error('Error fetching category:', error.message);
            return res.status(500).send('Error fetching category');
        }
        res.render('editCategory', { category: results[0] });
    });
});

app.post('/editCategory/:id', (req, res) => {
    const category_id = req.params.id;
    const { name, description } = req.body;
    const sql = 'UPDATE ig_categories SET name = ?, description = ? WHERE id = ?';
    connection.query(sql, [name, description, category_id], (error, results) => {
        if (error) {
            console.error("Error updating category:", error);
            res.status(500).send('Error updating category');
        } else {
            res.redirect('/categories');
        }
    });
});

// Delete IG Category
app.get('/deleteCategory/:id', (req, res) => {
    const category_id = req.params.id;
    const sql = 'DELETE FROM ig_categories WHERE id = ?';
    connection.query(sql, [category_id], (error, results) => {
        if (error) {
            console.error("Error deleting category:", error);
            res.status(500).send('Error deleting category');
        } else {
            res.redirect('/categories');
        }
    });
});

