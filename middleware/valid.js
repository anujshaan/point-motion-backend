

const validData = (req,res,next)=>{
    
    const{username,fname,lname,password} = req.body
    
    if(!username){
        return res.status(400).json({
            'result':false,
            error:'fields can\'t be empty'
        })
    }else if(username.length < 4){
        return res.status(400).json({
            'result':false,
            error:'username check failed'
        })
    }else if(!validUsername(username)){
        return res.status(400).json({
            'result':false,
            error:'username check failed'
        })
    }

    if(!password){
        return res.status(400).json({
            'result':false,
            error:'fields can\'t be empty'
        })
    }else if(password.length < 5){
        return res.status(400).json({
            'result':false,
            error:'password check failed'
        })
    }else if(!validPassword(password)){
        return res.status(400).json({
            'result':false,
            error:'password check failed'
        })
    }

    if(!fname){
        return res.status(400).json({
            'result':false,
            error:'fields can\'t be empty'
        })
    }else if(!validName(fname)){
        return res.status(400).json({
            'result':false,
            error:'fname or lname check failed'
        })
    }

    if(!lname){
        return res.status(400).json({
            'result':false,
            error:'fields can\'t be empty'
        })
    }else if(!validName(lname)){
        return res.status(400).json({
            'result':false,
            error:'fname or lname check failed'
        })
    }

    next()

}

module.exports = validData;

const validUsername = (username) =>{
    const re = /^(?=.*\d)|(?=.*[A-Z])|(?=.*\W)/;
    return !re.test(username);
}

const validPassword = (password)=>{
    let isSpeacial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    let isValid = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])/;

    if(isSpeacial.test(password)){
        return false;
    } else {
        if(isValid.test(password))
            return true;
    }
}

const validName = (name)=>{
    const re = /^[a-zA-Z]{1,}$/;
    return re.test(name);
}