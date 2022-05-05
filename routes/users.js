const router = require('express').Router()
const bcrypt = require('bcryptjs')

const User = require('../models/user')
const imageController = require('../controller/uploadImage')
const auth = require('../controller/auth')

router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (err) {
        res.status(400).json(err)
    }
})

router.get('/user/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { } = user
        res.status(200).json(user)
    } catch (err) {
        res.status(400).json(err)
    }
})

router.post('/SignUp', async (req, res) => {
    const { firstname, lastname, email, password } = req.body

    if (firstname && lastname && email && password) {

        const user = await User.findOne({ email })

        if (!user) {
            const hash = await bcrypt.hash(password, 10)
            const user = new User({
                firstname,
                lastname,
                email,
                password: hash
            })
            try {
                const a1 = await user.save()
                res.status(200).json(a1)
            } catch (err) {
                res.status(400).json(err)
            }
        } else {
            res.status(200).json('Email already exists')
        }
    } else {
        res.json({
            message: 'Please enter all details'
        })
    }
})

router.put('/edit-profile/addProfile-Pic/:id', auth, imageController, async (req, res) => {
    if (req.user.id === req.params.id) {
        try {
            // const user = await User.findById(req.body.userID)
            await User.findByIdAndUpdate(req.params.id, {
                $set: { ...req.body, image: req.file.filename }
            })
            res.status(200).json({
                message: 'Profile picture added successfully'
            })
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.json({
            message: 'You are not authorized person'
        })
    }

})

/* router.put('/edit-profile/editProfile-Pic/:id', imageController, async (req, res) => {
    if (req.body.userID === req.params.id) {
        try {
            // const user = await User.findById(req.body.userID)
            await User.findByIdAndUpdate(req.params.id, {
                $set: { ...req.body, image: req.file.path }
            })
            res.status(200).json({
                message: 'Profile picture added successfully'
            })
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.json({
            message: 'You are not authorized person'
        })
    }

}) */

router.put('/edit-profile/removeProfile-Pic/:id', auth, imageController, async (req, res) => {
    if (req.user.id === req.params.id) {
        try {
            // const user = await User.findById(req.body.userID)
            await User.findByIdAndUpdate(req.params.id, { ...req.body, image: '' })
            res.status(200).json({
                message: 'Profile picture removed successfully'
            })
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.json({
            message: 'You are not authorized person'
        })
    }

})

router.put('/edit-profile/userDetails/:id', auth, async (req, res) => {
    console.log(req.user);
    if (req.user.id === req.params.id) {
        try {
            // const user = await User.findById(req.body.userID)
            await User.findByIdAndUpdate(req.params.id, { ...req.body })
            res.status(200).json({
                message: 'User details updated successfully'
            })
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.json({
            message: 'You are not authorized person'
        })
    }

})

router.put('/changePassword/:id', auth, async (req, res) => {
    if (req.user.id === req.params.id) {
        try {
            const user = await User.findById(req.user.id)
            if (!user) {
                res.status(400).json({
                    message: "User not found"
                })
            } else {
                // comparing given password with hashed password
                bcrypt.compare(req.body.currentPassword, user.password).then(async (result) => {
                    if (result) {
                        const newPass = await bcrypt.hash(req.body.newPassword, 10)
                        const user = await User.findByIdAndUpdate(req.params.id, { password: newPass })
                        res.status(201).json({
                            message: "Passord updated successfully",
                            user: user
                        });
                    } else {
                        res.status(400).json({ message: "Current password is incorrect" });
                    }
                })
            }
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.json({
            message: 'You are not authorized person'
        })
    }

})

router.delete('/delete/:id', auth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('User deleted successfully')
    } catch (err) {
        res.status(400).json(err)
    }
})

module.exports = router