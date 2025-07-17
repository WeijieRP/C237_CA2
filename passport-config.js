const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const mysql = require("mysql2");
const connection = mysql.createConnection({ /* same config */ });

module.exports = function(passport) {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  // GOOGLE STRATEGY
  passport.use(new GoogleStrategy({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    const email = profile.emails[0].value;
    const oauth_id = profile.id;
    const provider = 'google';

    const sql = `SELECT * FROM users WHERE email = ? AND oauth_provider = ?`;
    connection.query(sql, [email, provider], (err, results) => {
      if (err) return done(err);

      if (results.length > 0) return done(null, results[0]);

      // Insert new Google user
      const insertSQL = `INSERT INTO users (username, email, roles, oauth_provider, oauth_id) VALUES (?, ?, ?, ?, ?)`;
      const username = profile.displayName;
      const roles = null;

      connection.query(insertSQL, [username, email, roles, provider, oauth_id], (err, result) => {
        if (err) return done(err);
        connection.query(sql, [email, provider], (err2, newUser) => {
          return done(null, newUser[0]);
        });
      });
    });
  }));

  // GITHUB STRATEGY
  passport.use(new GitHubStrategy({
    clientID: 'YOUR_GITHUB_CLIENT_ID',
    clientSecret: 'YOUR_GITHUB_CLIENT_SECRET',
    callbackURL: "/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    const email = profile.emails[0].value;
    const oauth_id = profile.id;
    const provider = 'github';

    const sql = `SELECT * FROM users WHERE email = ? AND oauth_provider = ?`;
    connection.query(sql, [email, provider], (err, results) => {
      if (err) return done(err);

      if (results.length > 0) return done(null, results[0]);

      const username = profile.username || profile.displayName;
      const roles = null;

      const insertSQL = `INSERT INTO users (username, email, roles, oauth_provider, oauth_id) VALUES (?, ?, ?, ?, ?)`;
      connection.query(insertSQL, [username, email, roles, provider, oauth_id], (err, result) => {
        if (err) return done(err);
        connection.query(sql, [email, provider], (err2, newUser) => {
          return done(null, newUser[0]);
        });
      });
    });
  }));
}
