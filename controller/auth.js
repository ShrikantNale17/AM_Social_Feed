const jwt = require("jsonwebtoken")

const SECRETE_KEY = process.env.SECRETE_KEY

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization || req.cookies.jwt
    const error = new Error()
    error.status = 403
    if (authHeader) {
        const token = authHeader
        if (token) {
            try {
                const user = jwt.verify(token, SECRETE_KEY)
                req.user = user
                return next()
            } catch (e) {
                return res.status(200).json({ message: 'invalid/expired token' })
            }
        }
        return res.status(200).json({ message: 'user must provide token' })
    }
    return res.status(200).json({ message: 'you are not authorized person' })
}

module.exports = auth