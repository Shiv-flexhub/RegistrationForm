const mongoose = require("mongoose");

const connection = async ()=>{
    try {
      await mongoose.connect('mongodb://localhost:27017/RegistrationForm');
      console.log('connection successful');
    } catch (error) {
      console.log(error);
    }
  }
  connection();
  