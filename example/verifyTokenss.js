const jwt = require("jsonwebtoken")

const verifyTokens = async(req,res,next)=>{
        const token = req.cookies.access_tokens

    if(!token){
        res.status(400).json("invalid")
    }else{
        jwt.verify( token,process.env.JWT_TOKEN, (err,user)=>{
            if(err){
                res.status(400).json("wrong")
            }else{
                req.user= user
                next()
            }
        })
    }
}

const verifyTokenAndAuthorization = ( req,res,next )=>{
     verifyTokens(req,res, ()=>{
         if(req.user.id  = req.params.id || req.isAdmin.id){
             next()
         }else{
             res.status(400).json("not authorized")
         }
     })
}
const verifyAdmin = (req,res,next)=>{
    verifyTokens(req,res,next, ()=>{
        if(req.user.isAdmin){
            next()
        }else{
            res.status(400).json("not allowed")
        }
    })
}


module.exports =  { verifyAdmin,verifyTokens,verifyTokenAndAuthorization}
