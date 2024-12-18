// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const Order = require("./models/order.model");
const Product = require("./models/product.model");


const server = express();

// Middleware 
server.use(cookieParser());
server.use(session({ secret: "my session secret", resave: false, saveUninitialized: true }));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));



server.set("view engine", "ejs");
server.set("views", path.join("/views", "views"));
server.use(expressLayouts);

server.use(express.static(path.join("/style.css", "public")));
server.use(express.static(path.join("style1.css", "uploads")));

const adminProductsRouter = require("./routes/admin/products.controller");
const adminCategoriesRouter = require("./routes/admin/categories.controller");
const ordersRouter = require("./routes/admin/orders.controller");

server.use(adminProductsRouter);
server.use(adminCategoriesRouter);
server.use("/admin/orders", ordersRouter);


// CONNECTED MONGODB
let connectionString = "mongodb+srv://KhizerLiaqat:Pakistan1234_@thenote.mvwrw.mongodb.net/";
mongoose
  .connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Server: " + connectionString))
  .catch((error) => console.log(error.message));

server.get("/", async (req, res) => {
  let products = await Product.find();
  return res.render("homepage", { products });
});

server.get("/bootstrap", (req, res) => {
  return res.render("bootstrap");
});

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

const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
}));

server.get('/auth/login', (req, res) => {
  res.render('auth/login', { layout: "authlayout", pageTitle: "Login" });
});

server.get('/auth/register', (req, res) => {
  res.render('auth/register', { layout: "authlayout", pageTitle: "Signup" });
});

server.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.redirect('/auth/login');
});

server.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(400).send('User not found');
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid password');

  const token = jwt.sign({ username: user.username }, 'your-secret-key', { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });
  res.redirect('/admin/products');
});

server.get('/admin', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/');

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) return res.redirect('/');
    res.render('admin-panel', { username: decoded.username });
  });
});

server.post("/checkout", async (req, res) => {
  const { name, street, city, postalCode, items } = req.body;

  if (!name || !street || !city || !postalCode || !items || items.length === 0) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  let totalAmount = 0;
  items.forEach(item => {
    totalAmount += item.price * item.quantity;
  });

  const orderId = `ORD-${Date.now()}`;

  const order = new Order({
    orderId,
    customerInfo: { name, street, city, postalCode },
    items,
    totalAmount
  });

  try {
    await order.save();
    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (err) {
    res.status(500).json({ message: 'Error placing the order' });
  }
});

server.get('/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.render('admin/orders', { orders });
  } catch (err) {
    res.status(500).send('Error retrieving orders');
  }
});


server.listen(5001, () => {
  console.log(`Server started at localhost:5001`);
});
