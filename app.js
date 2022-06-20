//jshint esversion:6


const express= require("express");
const bodyParser=require("body-parser");
const { response } = require("express");
const mongoose =require("mongoose");
// const date=require(__dirname+ "/date.js");
const _=require("lodash");
const app =express();
// const items=["Buy food","Cook food","Eat food"];
// const workItems=[];
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://lamiya:test@cluster0.a3mm1.mongodb.net/todolistDB",{useNewUrlParser:true});
const itemsSchema ={
    name:String
};
const Item = mongoose.model(
"Item",itemsSchema
);

const item1 =new Item({
name:"Welcome to to do list!"
});
const item2 =new Item({
    name:"Hit the + button to add a new item."
    });
    const item3 =new Item({
        name:"<-- Hit this to delete an item."
        });
const defaultItems =[item1,item2,item3];       

const listSchema={
    name:String,
    items:[itemsSchema]
};

const List =mongoose.model("List",listSchema);

app.get("/",function(request,response){
    // const day= date.getDate();

    Item.find({},function(err,foundItems){
    if(foundItems.length ===0){
        Item.insertMany(defaultItems,function(err){
            if(err){
                console.log(err);
            } else{
                console.log("successfully saved default items to database");
            }
        });
        response.redirect("/");
    }else{
        response.render("list", {listTitle: "Today",newListItems:foundItems});
    }  
});

});
// app.get("/work",function(request,response){
//     response.render("list", {listTitle:"work list",newListItems:workItems});
// });

app.get("/:customListName",function(request,response){
customListName=_.capitalize(request.params.customListName);

List.findOne({name:customListName},function(err,foundList){
    if(!err){
       
            if(!foundList){
              //create new list
              const list =new List({
                name:customListName,
                items:defaultItems
            });
            list.save();
            response.redirect("/"+ customListName);
            } else{
                //show existing list
                response.render("list",{listTitle:foundList.name,newListItems:foundList.items});
            }
    
     
    }
});


}); 

app.get("/about",function(request,response){
    response.render("about");
});

app.post("/",function(request,response){
    const itemName= request.body.newItem;
    const listName =request.body.list;
    const item =new Item({
        name:itemName
    });
    if(listName ==="Today"){
        item.save();
        response.redirect("/");

    }
    else{
       List.findOne({name:listName},function (err,foundList){
           foundList.items.push(item);
           foundList.save();
           response.redirect("/" +listName);
       }) 
    }
    
//     if(request.body.list === "work"){
// workItems.push(item);
// response.redirect("/work");
//     }else{
//         items.push(item);
//         response.redirect("/");
//     }



});
app.post("/delete",function(request,response){
const checkItemId=request.body.checkbox;
const listName =request.body.listName;
if(listName === "Today"){

Item.findByIdAndRemove(checkItemId,function(err){
    if(!err){
       
        console.log("successfully deleted checked  item");
        response.redirect("/");
    }
});}
else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkItemId}}},function(err,foundList){
if(!err){
    response.redirect("/"+listName);
}
});
} 
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
app.listen(port,function(){
   
    console.log("server started sucessfully");
});