const express = require('express');
const app =express();
const PORT = process.env.PORT||8000;
const path = require("path");
const hbs = require("hbs");
require("./db/conn");
const Employee = require("./models/schema")
const bcrypt = require("bcryptjs");





const viewsPath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");
const staticPath = path.join(__dirname, "../public");

app.use(express.static(staticPath));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set("view engine", "hbs");
app.set("views", viewsPath)
hbs.registerPartials(partialPath)


app.get("/",(req,res)=>{
    res.send("hello from the other side")
})

app.get("/login",(req,res)=>{
    res.render("login") 
})


app.post("/login", async(req,res)=>{
    try{
        
        const email = req.body.username;
        const user = await Employee.find({email});  
        const isMatch = await bcrypt.compare(req.body.password,user[0].password)
       
        // const tkkn = await user.generateAuthToken()
        // console.log(tkkn)

        if(!isMatch){
            res.send("incorrect login details")
        }
        else{

        res.send(user);
        }
    }catch(err){
        console.log(err)
        res.send(err).status(400);
    }
})  




app.get("/register",(req,res)=>{
    res.render("register")
})

app.post("/register", async(req,res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if(password == cpassword){
            const user = new Employee({
                firstname : req.body.firstName,
                lastname : req.body.lastName,
                email : req.body.email,
                phone : req.body.phone,
                age : req.body.age,
                gender : req.body.gender,
                password : password,
                confirmPassword : cpassword        
            })
            const ttk = await user.generateAuthToken()
                
            await user.save();
            res.status(201).render("login");

        }else{
            res.send("password aren't matching")
        }

    }catch(err){
        console.log(err)
        res.status(400).send(err)
    }
})


    
app.listen(PORT,()=>{
    console.log(`server is running at ${[PORT]}`)
})