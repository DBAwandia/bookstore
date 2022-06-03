const jwt = require("jsonwebtoken")

const verifyToken = async(req,res,next)=>{
    const token = req.cookies.access_token
    if(!token){
        res.status(401).json("invalid")
    }else{
        jwt.verify(token, process.env.JWT_TOKEN,(err, user)=>{
            if(err){
                res.status(403).json("Invalid token")
            }else{
                req.user = user
                next()
            }
        })
    }
}

const verifyTokenAndAuthorization = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(403).json("Not Authorized")
        }
    })
}
const verifyIsAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next()
        }else{
            res.status(403).json("Not Authorized")
        }
    })
}

module.exports= { verifyToken, verifyTokenAndAuthorization,verifyIsAdmin}