const express = require('express');
let server = express();

server.set("view engine", "ejs");
server.use(express.static("public"));


server.get('/', function (req, res) {
    res.render("index");

});
server.get('/portfolio', (req, res) => {
    res.render("portfolio");
})



server.listen(5000, () => {
    console.log("server listening on port 8080");

})