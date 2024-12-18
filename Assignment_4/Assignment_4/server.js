// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");

// Create an express server object
let server = express();

// Middleware setup
server.use(cookieParser());
server.use(session({ secret: "my session secret", resave: false, saveUninitialized: true }));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Set up EJS as the view engine
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views")); // Make sure 'views' folder exists

// Use express layouts for the views
server.use(expressLayouts);

// Expose the public folder for static files
server.use(express.static(path.join(__dirname, 'public'))); // Static folder for public assets
server.use(express.static(path.join(__dirname, 'uploads'))); // Static folder for uploads

// Routes for main portfolio and bootstrap pages
// server.get("/portfolio", (req, res) => {
//   return res.render("index");
// });

server.get("/", (req, res) => {
  return res.render("bootstrap");
});

// Import and use the admin products controller
let adminProductsRouter = require("./routes/admin/products.controller");
server.use(adminProductsRouter);

// Import and use the admin categories controller
let adminCategoriesRouter = require("./routes/admin/categories.controller");
server.use(adminCategoriesRouter);

// Add as many routes as you want
server.get("/about-me", (req, res) => {
  return res.render("about-me");
});

server.get("/", async (req, res) => {
  let Product = require("./models/product.model");
  let products = await Product.find();
  return res.render("homepage", { products });
});

// Admin route for creating products (although it's already in products.controller.js, ensure it's not redundant)
server.get("/admin/products/create", (req, res) => {
  res.render("admin/productform", {
    layout: "adminlayout",
    pageTitle: "Create New Product"
  });
});

server.get("/admin/categories/create", (req, res) => {
  res.render("admin/category-form", {
    layout: "adminlayout",
    pageTitle: "Create New Category"
  });
});

// User Schema
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
}));

// Routes
server.get('/auth/login', (req, res) => {
  res.render('auth/login', {
     layout: "authlayout",
    pageTitle: "Login"
  });  // Ensure login.ejs exists in the views folder
});

server.get('/auth/register', (req, res) => {
  res.render('auth/register', {
    layout: "authlayout",
   pageTitle: "Signup"
 });  // Ensure register.ejs exists in the views folder
});

// Registration Route
server.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.redirect('/auth/login');  // Redirect to login after successful registration
});

// Login Route
server.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(400).send('User not found');
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid password');

  const token = jwt.sign({ username: user.username }, 'your-secret-key', { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });  // Store JWT token in cookie
  res.redirect('/admin/products');  // Redirect to admin panel after login
});

// Admin Route (Protected)
server.get('/admin', (req, res) => {
  const token = req.cookies.token;  // Access the token from cookies
  if (!token) return res.redirect('/');  // Redirect if no token found

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) return res.redirect('/');  // Redirect if token is invalid
    res.render('admin-panel', { username: decoded.username });  // Render the admin panel
  });
});

// MongoDB connection
let connectionString = "mongodb+srv://KhizerLiaqat:Pakistan1234_@thenote.mvwrw.mongodb.net/";
mongoose
  .connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Server: " + connectionString))
  .catch((error) => console.log(error.message));

// Start the server at port 5000
server.listen(5000, () => {
  console.log(`Server started at localhost:5000`);
});
