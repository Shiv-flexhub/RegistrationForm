const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const employeeSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        maxlength:12
    },
    lastname:{
        type:String,
        required:true,
        maxlength:12
    },
    email:{
        type:String,
        required:true,
        unique:[true,"Email already present"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email");
            }
        }
    },
    phone:{
        type:String,
        required:true,
        unique:true,
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})


employeeSchema.methods.generateAuthToken = async function(){
    try{
        const email = this.email;
        const tkn = await jwt.sign({_id:this._id.toString()},email)
        this.tokens = this.tokens.concat({token:tkn})
        

    }catch(err){
        console.log(errs)
        res.send(err);
    }
}


employeeSchema.pre("save", async function(next){
    try{
        if(this.isModified("password")){
            this.password = await bcrypt.hash(this.password,10)
            this.confirmPassword = undefined;
        }
        next();
    }catch(err){
        res.send(err);
    }
})

const Employee = new mongoose.model("Employee",employeeSchema);

module.exports = Employee;

