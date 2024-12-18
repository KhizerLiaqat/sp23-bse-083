const express = require("express");
let router = express.Router();

let multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

let Product = require("../../models/products.model");


router.get("/admin/products/delete/:id", async (req, res) => {
  let product = await Product.findByIdAndDelete(req.params.id);
  return res.redirect("/admin/products");
});


router.get("/admin/products/edit/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  return res.render("admin/productsedit", {
    layout: "adminlayout",
    product,
  });
});


router.post("/admin/products/edit/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  product.title = req.body.title;
  product.description = req.body.description;
  product.price = req.body.price;
  await product.save();
  return res.redirect("/admin/products");
});


router.get("/admin/products/create", (req, res) => {
  return res.render("admin/productform", { layout: "adminlayout" });
});


router.post(
  "/admin/products/create",
  upload.single("file"),
  async (req, res) => {
    let data = req.body;
    let newProduct = new Product(data);
    newProduct.title = data.title;
    if (req.file) {
      newProduct.picture = req.file.filename;
    }
    await newProduct.save();
    return res.redirect("/admin/products");
  }
);


router.get("/admin/products/:page?", async (req, res) => {
  let page = req.params.page ? Number(req.params.page) : 1;
  let pageSize = 5;
  let totalRecords = await Product.countDocuments();
  let totalPages = Math.ceil(totalRecords / pageSize);

  let products = await Product.find()
    .limit(pageSize)
    .skip((page - 1) * pageSize);

  return res.render("admin/products", {
    layout: "adminlayout",
    pageTitle: "Manage Your Products",
    products,
    page,
    totalPages,
  });
});

module.exports = router;
