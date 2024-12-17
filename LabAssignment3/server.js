const express = require("express");
var expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

let server = express();
server.set("view engine", "ejs");
server.use(expressLayouts);
server.use(express.static("public"));

let adminProductsRouter = require("./routes/admin/products.controller");
const expressEjsLayouts = require("express-ejs-layouts");
server.use(adminProductsRouter);

server.get("/", (req, res) => {
    return res.render("bootsrap");
});
server.get("/portfolio", (req, res) => {
    return res.send(res.render("portfolio"));
});

server.get("/admin/products/create", (req, res) => {
    res.render("admin/productform", {
        layout: "adminlayout",
        pageTitle: "Create New Product"
    });
});
let connectionString = "mongodb+srv://thenote.mvwrw.mongodb.net/";
mongoose
    .connect(connectionString, {
        dbName: "TheNoteOfficials",
        pass: "Pakistan1234@Fdsa@1164",
        user: "KhizerLiaqat",
        useNewUrlParser: true
    })
    .then(() => console.log("Connected to Mongo DB Server: " + connectionString))
    .catch((error) => console.log("error while connecting" + error));


server.listen(5000, () => {
    console.log(`Server Started at localhost:5000`);
});


