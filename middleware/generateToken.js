const JWT = require('jsonwebtoken');

const generateAccessToken = (payload) =>{
    return JWT.sign(payload, `${process.env.SECRET_ACCESS_TOKEN}`, {expiresIn:'10m'})
}

const generateRefreshToken = (payload) =>{
    return JWT.sign(payload, `${process.env.SECRET_REFRESH_TOKEN}`,{expiresIn:'30d'})
}

module.exports = {generateAccessToken, generateRefreshToken}