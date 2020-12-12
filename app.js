//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
const _=require("lodash");
let log=1;
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";


const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDb",{useNewUrlParser: true })

const blogSchema={
  title:String,
  data:String,
};
const Blog=mongoose.model("Blog",blogSchema);
const defaultHome=new Blog({
  title:"Home",
  data:homeStartingContent,
})

app.get("/",function(req,res){
  Blog.find({},function(err,found){
    console.log(found);
    if(found.length===0)
    {
      defaultHome.save();
      res.redirect("/");
    }else{
      res.render("home",{found});    }

  });


});

app.get("/about",function(req,res){
  res.render("about",{
    aboutPara:aboutContent,
  });
});

app.get("/contact",function(req,res){
  res.render("contact",{
    contactPara:contactContent,
  })
});

app.get("/compose",function(req,res){
  if(log)
  {
    res.render("login");

  }
});

app.post("/compose",function(req,res){
  const titleData=req.body.composeTitle;
  const composeContent=req.body.composeText;
  console.log(composeContent);
const composeBlog=new Blog({
  title:titleData,
  data:composeContent,
});
composeBlog.save();

  // titleContent.push(titleData);
  // homeStartingContent.push(composeContent);
  res.redirect("/");
});


app.get("/posts/:next",function(req,res){

Blog.find({title:req.params.next},function(err,found){
  res.render("post",{found})
});

  console.log(req.params.next);
});


app.get("/login",function(req,res){
  res.render("login");
});

app.post("/login",function(req,res){

  const mail="karthikbalaji022@gmail.com";
  const pass="kb22"
  if(req.body.inputEmail === mail && req.body.password === pass)
  {
    log=0;
    res.render("compose");
  }else{
    res.render("failure");
  }
});

app.get("/delete",function(req,res){
  if(log)
  {
    res.render("login");

  }else{res.render("delete")}

});



app.post("/delete",function(req,res){
  const del=_.lowerCase(req.body.delete);
  let success=1;
  Blog.find({},function(err,found){
    console.log("****"+found)
    if(found==0)
    {
      res.redirect("/failure");
    }else{
      found.forEach(function(index){
        if(del===_.lowerCase(index.title))
        {
          Blog.deleteOne({_id:index._id},function(err){})
          success=0;
        }

      });
    }

  });

  if(success){
    res.render("failure");
  }else{
  res.redirect("/");
}
});






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
