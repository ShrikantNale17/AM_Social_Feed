const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const User = require('../models/user')
const jwtSecret = process.env.SECRETE_KEY

router.post('/', async (req, res, next) => {

    const { email, password } = req.body
    // Check if username and password is provided

    if (!email || !password) {
        return res.status(400).json({
            message: "Email or Password not present",
        })
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            res.status(400).json({
                message: "Login not successful",
                error: "User not found",
            })
        } else {
            // comparing given password with hashed password
            bcrypt.compare(password, user.password).then(function (result) {
                if (result) {
                    const maxAge = 3 * 60 * 60;
                    const token = jwt.sign(
                        { id: user._id, name: user.name },
                        jwtSecret,
                        {
                            expiresIn: maxAge, // 3hrs in sec
                        }
                    );
                    res.setHeader("Authorization", token);
                    res.cookie("jwt", token, {
                        httpOnly: true,
                        maxAge: maxAge * 1000, // 3hrs in ms
                    });
                    res.status(201).json({
                        message: "User successfully Logged in",
                        user: user._id,
                        token: token
                    });
                } else {
                    res.status(400).json({ message: "Password is incorrect" });
                }
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "Email does not exist",
            error: error.message,
        })
    }

    /* const { email, password } = req.body
    // Check if username and password is provided
    if (!email || !password) {
        return res.status(400).json({
            message: "Email or Password not present",
        })
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            res.status(400).json({
                message: "Login not successful",
                error: "User not found",
            })
        } else {
            // comparing given password with hashed password
            bcrypt.compare(password, user.password).then(function (result) {
                result
                    ? res.status(200).json({
                        message: "Login successful",
                        user,
                    })
                    : res.status(400).json({ message: "Login not succesful" })
            })
        }
    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
        })
    } */


    /* try {
        const user = await User.findOne({
            $and: [
                { 'email': req.body.email },
                { 'password': req.body.password }
            ]
        });
        if (user) {
            res.status(200).json('Awsome...we found you.')
        } else {
            res.status(400).json('Sorry, your email or password is incorrect')
        }
    } catch (err) {
        res.status(500).json(err)
    } */
})

module.exports = router