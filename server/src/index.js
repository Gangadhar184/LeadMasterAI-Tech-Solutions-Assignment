const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/authRoutes");

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/auth", authRouter);

app.listen(7777, ()=> {
    console.log("server is running on port 7777");
})
