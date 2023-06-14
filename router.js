const { Router } = require("express");
const express = require("express");
const route = express.Router();
const user = require("./database");
const bcrypt = require("bcryptjs");


route.get("/",(req,res)=>{
    res.render("index");
})

route.get("/loginn",(req,res)=>{
    res.render("login");
})
route.post("/register",async(req,res)=>{
    try {
        const data = new user(req.body);
        if(data.password===data.confpassword){
            const emailvalidation = await user.findOne({email:data.email})
            if(emailvalidation){
                res.send("This email alrady axist");
            }

            const token = await data.generateToken();
            console.log("This token is user"+token);

            res.cookie("jwt",token);

            const savedata = await data.save();
            res.render("login")
        }else{
            res.status(400).send("Password not conform");
        }
       
    } catch (error) {
        res.status(400).send(error);
    }
})

route.post("/login",async(req,res)=>{
    try {
        const chekemail = req.body.email;
        const passworduser = req.body.password;
        const databasedata = await user.findOne({email:chekemail});
        const ismatch = await bcrypt.compare(passworduser,databasedata.password);
        if(ismatch){
            const token = await databasedata.generateToken();
            res.cookie("jwt",token);
            res.render("contact");
        }else{
            res.status(400).send("This not right place correct information");
        }
        
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = route;