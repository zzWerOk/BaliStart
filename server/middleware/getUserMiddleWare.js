
const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }
    try{
        const token = req.headers.authorization.split(' ')[1]
        if(token){
            req.user = jwt.verify(token, process.env.SECRET_KEY)
        }
        next()
    }catch (e) {
        return next()
    }
}