const express = require("express");
const {signUp, logIn, logOut} = require("../controllers/authController");
const {userAuth} = require("../middlewares/auth")

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", logIn);
authRouter.post("/logout", logOut);

//get current logged in user
authRouter.get("/me", userAuth, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = authRouter;
