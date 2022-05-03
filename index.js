const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cookieParser = require("cookie-parser")
const cors = require('cors')
const path = require('path')

// const productsRouter = require('./routes/products')

const loginRouter = require('./controller/login')
const auth = require('./controller/auth')
const usersRouter = require('./routes/users')
const postsRouter = require('./routes/posts')

dotenv.config()
const url = process.env.DB_URL
// const url = 'mongodb://localhost/secure'

const port = process.env.PORT || 8080

const app = express()

mongoose.connect(url, () => {
    console.log("connected successfully");
})
app.use(cors())
app.use(cookieParser())

app.use(express.json())

app.use('/login', loginRouter)

// app.use('/', auth)

app.all('/*', (req, res, next) => {
    if (req.method == 'OPTIONS') {
        res.status(200).end()
    } else {
        next()
    }
})
// app.use('/users/SignUp', usersRouter)
app.use('/users', usersRouter)
app.use('/posts', auth, postsRouter)
app.use(express.static(path.join(__dirname, "uploads")));
app.use('/*', (req, res) => {
    res.json({
        message: 'Page not found'
    })
})

app.listen(port, () => {
    console.log("Server is running on port 8080");
})