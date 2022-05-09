const hash = require('object-hash');
const JWT = require('jsonwebtoken')
const fs = require('fs');
const {generateAccessToken,
        generateRefreshToken} = require('../middleware/generateToken');

const validData = require('../middleware/valid');


const authCtrl = {
    signup: async(req,res)=>{
        try {
            const {username, fname, lname, password} = req.body;
            
            const hashedPass = await hash.MD5(password);

            const userData = [{
                fname,
                lname,
                username,
                password:hashedPass
            }]

            fs.readFile('userInfo.json',(err,data)=>{
                if(err) throw err;
                if(data.length > 0){
                    const oldUserData = JSON.parse(data);

                    const isUser = oldUserData.find((user)=>{
                        return user.username === username
                    })
                    if(isUser) return res.status(400).json({
                        "result":false,
                        error:'username already exists'
                    });

                    oldUserData.push(...userData);

                    registerUser(oldUserData,res)
                    
                }
                else{ registerUser(userData,res)}
               
            })


        } catch (err) {
            res.status(500).json({msg:err.message})
        }
    },
    signin: async(req,res)=>{
        try {
            const {username,password} = req.body;
            if(!username || !password) return res.status(400).json({
                "result":false,
                error:'Please provide username and password'
            })
            fs.readFile('userInfo.json',(err,data)=>{
                if(err) throw err;
                if(data.length > 0){
                    const users = JSON.parse(data);
                    const foundUser = users.find((user)=>{
                        return user.username === username;
                    })

                    if(!foundUser) return res.status(401).json({
                        "result":false,
                        error:'Invalid username/password'
                    });
                    
                    loginUser(foundUser,password,res);
                }else{
                    return res.status(400).json({msg:'No Account Found'})
                }
            })

        } catch (err) {
            res.status(500).json({msg:err.message})
        }
    },
    refreshToken:async(req,res)=>{
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Please login first" });
            
            const decoded = (
                JWT.verify(rf_token, `${process.env.SECRET_REFRESH_TOKEN}`)
            )

            if (!decoded) return res.status(400).json({ msg: "Please login first" });
            
            fs.readFile('userInfo.json',(err,data)=>{
                if(err) throw err;
                const allUsers = JSON.parse(data);
                const user = allUsers.find((user)=>{
                    return user.username === decoded.username
                })
                console.log(user)
                if(!user) return res.status(400).json({msg:'This account doesnot exist'})
                const access_token = generateAccessToken({
                    username:user.username,
                    firstname:user.fname
                })
                res.json({ 
                    "result":"true",
                    "data":user,
                    access_token
                });
            })
            
            

            // 
        } catch (err) {
            return res.status(500).json({msg:err.message})
        }
    }
}

module.exports = authCtrl;


const loginUser = async(foundUser,password,res) =>{
    
    const hashedPass = await hash.MD5(password)
    if(hashedPass !== foundUser.password){
        return res.status(401).json({
            "result":false,
            error:'Invalid username/password'
        });
    }

    const access_token = generateAccessToken({username:foundUser.username, firstname:foundUser.fname});
    const refresh_token = generateRefreshToken({username:foundUser.username, firstname:foundUser.fname});

    res.cookie("refreshtoken", refresh_token,{
        httpOnly:true,
        path:`/api/refresh_token`,
        maxAge: 30*24*60*60*1000, //30 days
    })
    res.status(200).json({
        "result":true,
        "jwt":access_token,
        "message":"Signin success"
    })

}


const registerUser = async( userData, res) =>{
    const newUserData = JSON.stringify(userData,null,2);
    fs.writeFile('userInfo.json', newUserData, (err)=>{
        if(err) throw err;
    })
    res.status(200).json({
        "result": true,
        "message": "SignUp success. Please proceed to Signin"
    })
}