const express = require('express');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const sqlite3 = require('sqlite3').verbose(); // Import SQLite3
const path = require('path');
const session = require('express-session'); // Add express-session
const bodyParser = require('body-parser'); // Import body-parser
const app = express();
const fs = require('fs'); // Import the fs module
const errorHandler = require('./scripts/handler'); // Adjust the path as needed
const multer = require('multer');

// Initialize SQLite database
// Redirect stdout and stderr to a file (e.g., logs.txt)
const logStream = fs.createWriteStream('logs.txt', { flags: 'a' });
// Now, all console output will be written to logs.txt
// Multer for handling file uploads
const storage = multer.memoryStorage(); // Store files in memory (you can configure to store on disk)
const upload = multer({ storage: storage });
// Initialize SQLite database for the "bots" table
app.use(errorHandler);
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Create user table if it doesn't exist
    db.run(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, discordId TEXT, username TEXT, avatar TEXT)'
    );
  }
});

// Express Middleware
app.use(
  session({
    secret: 'DdNXSbKhRj#$!', // Change this to a strong, random secret
    resave: true,
    saveUninitialized: true,
    logFn: () => { }
  })
);

app.use(passport.initialize());
app.use(passport.session());
// Middleware to handle missing express-session middleware error
app.use((err, req, res, next) => {
  if (err.message === 'Login sessions require session support. Did you forget to use `express-session` middleware?') {
    // This error is related to missing express-session middleware, so we'll suppress it
    return res.status(500).send('Internal Server Error');
  }

  if (err instanceof TokenError && err.message === 'Invalid "code" in request.') {
    // This error is related to an invalid code in the OAuth2 request
    // You can customize the error message and response as needed
    return res.status(400).send('Invalid OAuth2 code');
  }

  next(err); // Pass other errors to the default error handler
});

// Passport Configuration
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new DiscordStrategy(
    {
      clientID: '1150810541586137089', // Replace with your Discord OAuth2 client ID
      clientSecret: 'dcbMSv-bAABBWYSw9K8tmmYHa0MLgOsJ', // Replace with your Discord OAuth2 client secret
      callbackURL: 'https://offier-discord-bot.thedeveloperhub.repl.co/auth/discord/callback', // Replace with your callback URL
      scope: ['identify'],
    },
    (accessToken, refreshToken, profile, done) => {
      // Save the user's profile data in the SQLite database
      db.run(
        'INSERT INTO users (discordId, username, avatar) VALUES (?, ?, ?)',
        [profile.id, profile.username, profile.avatar],
        (err) => {
          if (err) {
            console.error('Error inserting user data:', err.message);
          }
        }
      );
      return done(null, profile);
    }
  )
);

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('login.html');
});
app.get('/homepage', ensureAuthenticated, (req, res) => {
  res.render('homepage.html', { user: req.user });
});
// Route to serve the admin.html page
app.get('/admin', ensureAuthenticated, (req, res) => {
  const yourDiscordId = '1063691309782675566'; // Replace with your Discord ID

  // Check if the user is you (the admin)
  if (req.user.id === yourDiscordId) {
    res.render('admin.html', { user: req.user });
  } else {
    res.status(403).send('Forbidden'); // User is not you (the admin)
  }
});
app.get('/about', ensureAuthenticated, (req, res) => {
  res.render('about.html');
});
app.get('/contact', ensureAuthenticated, (req, res) => {
  res.render('contact.html');
});
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;
  const userData = `Name: ${name}\nEmail: ${email}\nMessage: ${message}\n\n`;

  // Append user data to a text file named 'user_data.txt'
  fs.appendFile('user_data.txt', userData, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/contact?submitted=true');
    }
  });
});

app.get('/profile', ensureAuthenticated, (req, res) => {
  const user = req.user; // The authenticated user's data from the DiscordStrategy

  // Fetch user data from the SQLite database for the currently authenticated user
  db.get('SELECT * FROM users WHERE discordId = ?', [user.id], (err, row) => {
    if (err) {
      console.error('Error fetching user data:', err.message);
      return res.status(500).send('Internal Server Error');
    }

    // Pass the user data to the profile template
    res.render('profile.html', { user: row });
  });
});

app.get('/auth/discord', passport.authenticate('discord'));

app.get(
  '/auth/discord/callback',
  passport.authenticate('discord', {
    successRedirect: '/homepage',
    failureRedirect: '/login', // Change this to your login page
  })
);
// Route to check authentication status
app.get("/check-auth", (req, res) => {
  res.json({ isAuthenticated: req.isAuthenticated() });
});
app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard.html');
});
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});
// Middleware to ensure authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
