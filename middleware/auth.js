const JWT = require('jsonwebtoken');

const auth = async(req,res,next) =>{
    try {
        const token = req.header("Authorization");
        
        if(!token) return res.status(401).json({
            "result":false,
            "error":"Please provide a JWT token"
        })
        
        const authToken = token.trim().split(' ')[1];
        
        const decoded = JWT.verify(authToken, `${process.env.SECRET_ACCESS_TOKEN}`);
        
        if(!decoded) return res.status(400).json({
            "result":false,
            "error":"JWT Verification Failed"
        })
        
        req.username = decoded.username;
        next()

    } catch (err) {
        return res.status(500).json({msg:err.message});
    }
}

module.exports = auth;