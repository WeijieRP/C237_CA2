const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

module.exports = (passport, connection) => {
  // 🔑 Serialize
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 🔓 Deserialize
  passport.deserializeUser((id, done) => {
    connection.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
      if (err) return done(err);
      return done(null, results[0]);
    });
  });

  // 🌐 Google Strategy
  passport.use(
    new GoogleStrategy({
      clientID: 'YOUR_GOOGLE_CLIENT_ID',
      clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;
      connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return done(err);
        if (results.length > 0) return done(null, results[0]);

        // Register new user
        const newUser = {
          username: profile.displayName,
          email: email,
          roles: 'user'
        };
        connection.query(
          'INSERT INTO users (username, email, roles) VALUES (?, ?, ?)',
          [newUser.username, newUser.email, newUser.roles],
          (err, result) => {
            if (err) return done(err);
            newUser.id = result.insertId;
            return done(null, newUser);
          }
        );
      });
    })
  );

  // 🐙 GitHub Strategy
  passport.use(
    new GitHubStrategy({
      clientID: 'YOUR_GITHUB_CLIENT_ID',
      clientSecret: 'YOUR_GITHUB_CLIENT_SECRET',
      callbackURL: '/auth/github/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails ? profile.emails[0].value : `${profile.username}@github.com`;
      connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return done(err);
        if (results.length > 0) return done(null, results[0]);

        // Register new user
        const newUser = {
          username: profile.username,
          email: email,
          roles: 'user'
        };
        connection.query(
          'INSERT INTO users (username, email, roles) VALUES (?, ?, ?)',
          [newUser.username, newUser.email, newUser.roles],
          (err, result) => {
            if (err) return done(err);
            newUser.id = result.insertId;
            return done(null, newUser);
          }
        );
      });
    })
  );
};
