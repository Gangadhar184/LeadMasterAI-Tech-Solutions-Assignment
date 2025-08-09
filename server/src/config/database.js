const mongoose = require("mongoose");

// mongodb+srv://gangadhar:vAdCexTpWw3ogKCn@cluster0.4dib3un.mongodb.net/

const connectDB = async () => {
    try{
        await mongoose.connect("mongodb+srv://gangadhar:vAdCexTpWw3ogKCn@cluster0.4dib3un.mongodb.net/quizz");
        console.log("database connection established");
    }catch(error){
        console.error(error.message);
        process.exit(1);
    }
    
}

module.exports = connectDB;
