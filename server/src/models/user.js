const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required : true,
        maxLength : 20
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validator(value){
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value);
            }
        }
    },
    password: {
        type : String,
        required: true,
        validator(value){
            if(!validator.isStrongPassword(value)) {
                throw new Error("Use Strong Password: " + value);
            }
        }
    }
    
} ,  {
    timestamps: true
})

// add method to schema

userSchema.methods.getJWT =  function() {
    const user = this;
    const token =  jwt.sign({_id: user._id}, "slayer", {expiresIn: "1d"});
    return token;
}

userSchema.methods.validatePassword = async function (passwordByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = bcrypt.compare(passwordByUser, passwordHash);
    return isPasswordValid;
}


const User = mongoose.model("User", userSchema);
module.exports = User;
