const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/authRoutes");
const examRouter = require("./routes/examRoutes");
const cors = require("cors");


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/auth", authRouter);
app.use("/api/exam", examRouter);


app.listen(7777, ()=> {
    console.log("server is running on port 7777");
})
