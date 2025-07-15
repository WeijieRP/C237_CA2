const express = require('express');
const mysql = require('mysql2');

//******** TODO: Insert code to import 'express-session' *********//
const session= require('express-session')

const flash = require('connect-flash');

const app = express();

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Group5@123?',
    database: 'IG_Connect'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:true,
    //session expires after 1 week of inactivity
    cookie:{maxAge:1000*60*60*24*7}
}));
