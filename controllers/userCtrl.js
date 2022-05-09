const fs = require('fs');

const userCtrl = {
    getUser : async(req,res)=>{
        try {
            fs.readFile('userInfo.json',(err,data)=>{
                if(err) throw err;

                const allUsers = JSON.parse(data);
                const user = allUsers.find((user)=>{
                    return user.username === req.username
                })
                if(!user) return res.status(400).json({msg:'User not found'})

                res.status(200).json({
                    "result":true,
                    "data":{
                        fname:user.fname,
                        lname:user.lname,
                        password:user.password,
                    }
                })
            })
        } catch (err) {
            return res.status(500).json({msg:err.message});
        }
    }
}


module.exports = userCtrl;