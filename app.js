const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  res.render("home", {});
});

app.get("/plasma", function(req,res){
  res.render("plasma", {});
})

app.get("/plasmaRegistration", function(req,res){
  res.render("plasmaRegistration", {});
})
app.get("/plasmaDataInput", function(req,res){
  res.render("plasmaDataInput", {});
})
app.get("/contactUs", function(req,res){
  res.render("contactUs", {});
})
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
