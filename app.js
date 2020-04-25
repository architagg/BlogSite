const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const methodOverride = require("method-override");
const expressSanitizer= require("express-sanitizer");
app = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/blogrestapp", {useNewUrlParser:true ,useUnifiedTopology: true});
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine","ejs")
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//MONGOOSE MODEL CONFIG
var blogschema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date ,  default: Date.now()}
});

var Blog = mongoose.model("Blog", blogschema);

// RESTFUL ROUTES

app.get("/",function(req,res){
  res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
  Blog.find({},function(err,blogs){
    if(err){
      console.log("ERROR!");
    }else{
      res.render("index.ejs",{blogs:blogs});
    }
  });
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new.ejs");
});
//CREATE ROUTE
app.post("/blogs",function(req,res){
  //create blog
  var title = req.body.title;
  var image = req.body.image;
  var body = req.body.body;
  var newBlog = {title: title , image: image, body: body};
  Blog.create(newBlog,function(err,newBlog){
    if(err){
      console.log("ERROR!");
    }else{
      res.redirect("/blogs");
    }
  });
});
//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
    if(err){
      res.redirect("/blogs");
    }else{
      res.render("showBlog.ejs",{blog: foundBlog});
    }
  });
});
//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
    if(err){
      res.redirect("/blogs");
    }else{
      res.render("edit.ejs" , {blog: foundBlog})
    }
  });
});
//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
  var title = req.body.title;
  var image = req.body.image;
  var body = req.body.body;
  var updatedBlog = {title: title , image: image, body: body};
  Blog.findByIdAndUpdate(req.params.id,updatedBlog,function(err,updatedblog){
    if(err){
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs/"+req.params.id);
    }
  });
});
//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
  //destroy blog
  Blog.findByIdAndRemove(req.params.id,function(err){
    if(err){
      res.redirect("/blogs");
    }else{//Redirecting to Index
      res.redirect("/blogs");
    }
  });
});















app.listen(2345,function(){
  console.log("Blog Server Started!!");
});
