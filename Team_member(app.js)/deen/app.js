const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    }
});

const upload = multer({ storage: storage });

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

// Set up view engine
app.set('view engine', 'ejs');
//  enable static files
app.use(express.static('public'));
// enable form processing
app.use(express.urlencoded({
    extended: false
}));

// Insert code for Session Middleware below 
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    // Session expires after 1 week of inactivity
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } 
}));

app.use(flash());

// Define routes
app.get('/galleries',  (req, res) => {
        const sql = "SELECT * FROM galleries";
        mysql.query(sql, (error, results) => {
        if (error) {
            req.flash('error', 'Error fetching gallery');
            return res.redirect('/');
        }
        res.render('galleries', { galleries: results });
    });
}); 

// View galleries
app.get('/galleries/:id', (req, res) => {
  // Extract the gallery ID from the request parameters
  const galleryId = req.params.id;

  // Fetch data from MySQL based on the product ID
  connection.query('SELECT * FROM products WHERE galleryId = ?', [galleryId], (error, results) => {
      if (error) throw error;

      // Check if any product with the given ID was found
      if (results.length > 0) {
          // Render HTML page with the product data
          res.render('gallery', { gallery: results[0], user: req.session.user  });
      } else {
          // If no product with the given ID was found, render a 404 page or handle it accordingly
          res.status(404).send('Image not found');
      }
  });
});

// Add image
app.post('/addImage', upload.single('image'),  (req, res) => {
    // Extract product data from the request body
    const { ig_id, caption, upload_date} = req.body;
    let media_url;
    if (req.file) {
        media_url = req.file.filename; // Save only the filename
    } else {
        media_url = null;
    }

    const sql = 'INSERT INTO galleries (productName, quantity, price, image) VALUES (?, ?, ?, ?)';
    // Insert the new product into the database
    connection.query(sql , [ig_id, caption, upload_date, media_url], (error, results) => {
        if (error) {
            // Handle any error that occurs during the database operation
            console.error("Error adding product:", error);
            res.status(500).send('Error adding product');
        } else {
            // Send a success response
            res.redirect('/galleries');
        }
    });
});

// Update Galleries
app.post('/updateGalleries/:id', upload.single('image'), (req, res) => {
    const id = req.params.id;
    // Extract product data from the request body
    const { ig_id, caption, upload_date } = req.body;
    let media_url  = req.body.currentImage; //retrieve current image filename
    if (req.file) { //if new image is uploaded
        media_url = req.file.filename; // set image to be new image filename
    } 

    const sql = 'UPDATE galleries SET ig_id = ? , caption = ?, upload_date = ?, media_url =? WHERE productId = ?';
    // Insert the new product into the database
    connection.query(sql, [ig_id, caption, upload_date, media_url, id], (error, results) => {
        if (error) {
            // Handle any error that occurs during the database operation
            console.error("Error updating product:", error);
            res.status(500).send('Error updating product');
        } else {
            // Send a success response
            res.redirect('/inventory');
        }
    });
});

// Delete
app.get('/deleteImage/:id', (req, res) => {
    const id = req.params.id;

    connection.query('DELETE FROM galleries WHERE id = ?', [id], (error, results) => {
        if (error) {
            // Handle any error that occurs during the database operation
            console.error("Error deleting product:", error);
            res.status(500).send('Error deleting product');
        } else {
            // Send a success response
            res.redirect('/galleries');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
