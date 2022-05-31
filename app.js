//jshint esversion:6


const express= require("express");
const bodyParser=require("body-parser");
const { response } = require("express");

const app =express();
let items=["Buy food","Cook food","Eat food"];
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(request,response){
let today =new Date();  
let options ={
    weekday:"long",
    day:"numeric",
    month:"long"
};
let day=today.toLocaleDateString("en-US",options);

response.render("list", {KindOfDay: day,newListItems:items});
});
app.post("/",function(request,response){
let item= request.body.newItem;
items.push(item);
response.redirect("/");
});

app.listen(3000,function(){
   
    console.log("server started on port 3000");
});