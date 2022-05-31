//jshint esversion:6


const express= require("express");
const bodyParser=require("body-parser");
const { response } = require("express");
const date=require(__dirname+ "/date.js");

const app =express();
const items=["Buy food","Cook food","Eat food"];
const workItems=[];
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(request,response){
    const day= date.getDate();
response.render("list", {listTitle: day,newListItems:items});
});
app.get("/work",function(request,response){
    response.render("list", {listTitle:"work list",newListItems:workItems});
});
app.get("/about",function(request,response){
    response.render("about");
});
app.post("/",function(request,response){
    const item= request.body.newItem;
    if(request.body.list === "work"){
workItems.push(item);
response.redirect("/work");
    }else{
        items.push(item);
        response.redirect("/");
    }



});


app.listen(3000,function(){
   
    console.log("server started on port 3000");
});