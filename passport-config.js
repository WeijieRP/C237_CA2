const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const mysql = require("mysql2");
require('dotenv').config();

// ✅ MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456789102345popA', // Replace with your actual MySQL password
  database: 'igconnect'
});

module.exports = function (passport) {
  // 🔐 Session: store only user ID
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 🔓 Fetch user from DB by ID
  passport.deserializeUser((id, done) => {
    const sql = `SELECT * FROM users WHERE id = ?`;
    connection.query(sql, [id], (err, results) => {
      if (err) return done(err);
      done(null, results[0]);
    });
  });

  // 🌐 Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    const email = profile.emails?.[0]?.value || `${profile.id}@google-placeholder.com`;
    const oauth_id = profile.id;
    const provider = 'google';
    const username = profile.displayName;
    const roles = null; // to be completed later

    const checkSQL = `SELECT * FROM users WHERE email = ? AND oauth_provider = ?`;
    connection.query(checkSQL, [email, provider], (err, results) => {
      if (err) return done(err);

      if (results.length > 0) return done(null, results[0]);

      const insertSQL = `INSERT INTO users (username, email, roles, oauth_provider, oauth_id) VALUES (?, ?, ?, ?, ?)`;
      connection.query(insertSQL, [username, email, roles, provider, oauth_id], (err) => {
        if (err) return done(err);
        connection.query(checkSQL, [email, provider], (err2, newUser) => {
          if (err2) return done(err2);
          return done(null, newUser[0]);
        });
      });
    });
  }));

  // 🐱 GitHub OAuth Strategy
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback",
    scope: ['user:email']
  },
  (accessToken, refreshToken, profile, done) => {
    const email = profile.emails?.[0]?.value || `${profile.username}@noemail.github`;
    const oauth_id = profile.id;
    const provider = 'github';
    const username = profile.username || profile.displayName;
    const roles = null;

    const checkSQL = `SELECT * FROM users WHERE email = ? AND oauth_provider = ?`;
    connection.query(checkSQL, [email, provider], (err, results) => {
      if (err) return done(err);

      if (results.length > 0) return done(null, results[0]);

      const insertSQL = `INSERT INTO users (username, email, roles, oauth_provider, oauth_id) VALUES (?, ?, ?, ?, ?)`;
      connection.query(insertSQL, [username, email, roles, provider, oauth_id], (err) => {
        if (err) return done(err);
        connection.query(checkSQL, [email, provider], (err2, newUser) => {
          if (err2) return done(err2);
          return done(null, newUser[0]);
        });
      });
    });
  }));
};
