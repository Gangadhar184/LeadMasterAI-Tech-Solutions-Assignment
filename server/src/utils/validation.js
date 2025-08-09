const validator = require("validator");


const validateSignUpData = (req)=>{

    const {userName, email, password} = req.body; 

    if(!userName){
        throw new Error("Name is not valid, Required Both fields");
    }
    else if(!validator.isEmail(email)){
        throw new Error("Email is not valid")

    }
    else if(!validator.isStrongPassword(password))  {
        throw new Error("Please enter strong password");
    }
}

module.exports = validateSignUpData;
