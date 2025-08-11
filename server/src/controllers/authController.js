
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");
const validateSignUpData = require("../utils/validation");


const signUp = async (req, res) => {
    try {
        //validate the data
        validateSignUpData(req);
        const { userName, email, password } = req.body;

        //encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        //instance to the calss which is userModel
        const user = new User({
            userName, email, password: passwordHash
        })

        await user.save();
        // Create JWT token
        const token = await user.getJWT();

        // Set cookie with token
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 8 * 3600000) // 8 hours
        });
        const userResponse = {
            _id: user._id,
            userName: user.userName,
            email: user.email,
        };
        res.status(201).json({ message: "User registered successfully", user: userResponse });


    } catch (error) {
        res.status(400).send("Error in saving userdata: " + error.message);
    }
}

const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!validator.isEmail(email)) {
            throw new Error("Invalid")
        }

        //compare the login details
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid creditentials")
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {
            //create jwt token

            const token = await user.getJWT();

            //add token to cookie
            res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 8 * 3600000) })

            res.status(200).json({ message: "Login successful",  user: { _id: user._id, userName: user.userName, email: user.email } });
        } else {
            throw new Error("Invalid Credentials")
        }

    } catch (error) {
        res.status(400).send("Error in saving userdata: " + error.message);
    }
}

const logOut = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.status(200).json({ message: "Logout successful" });

    } catch (error) {
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}

module.exports = { signUp, logIn, logOut }
