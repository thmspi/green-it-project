const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));


// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
  secret: 'thisIsASecretThatShouldStaySecret', // replace with a strong secret
  resave: false,
  saveUninitialized: false
}));

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Route handlers
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const listRoutes = require('./routes/list');

app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/list', listRoutes);



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
