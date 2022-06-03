const express = require("express")
const router = express.Router()
const users = require('../models/User')
const CryptoJS = require("crypto-js")
const jwt =require("jsonwebtoken")
const { verifyToken, verifyTokenAndAuthorization, verifyIsAdmin } = require("./verifyToken")

router.post("/register", async(req,res)=>{
    const email = req.body.email
    const username = req.body.username
    const password = CryptoJS.DES.encrypt(req.body.password,process.env.PASS_SEC ).toString()
    const user = users({ email: email, username: username, password: password})
    try{
        const oldUser = await users.findOne({email: req.body.email})

        if(oldUser){
            res.status(400).json("Already in use")

        }else{
            await user.save()
            res.status(200).json(user)
            
        }
    }catch(err){
        res.status(500).json("check details")
    }
})
router.post("/login", async (req,res)=>{
    try{
        const user = await users.findOne({email: req.body.email})
        !user && res.status(400).json("Error")
        const hashedPassword = CryptoJS.DES.decrypt( user.password,process.env.PASS_SEC)
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
        originalPassword !== req.body.password && res.status(400).json("wrong details")

        const { password,isAdmin, ...others}= user._doc

        const token = jwt.sign({id: user._id,isAdmin: user.isAdmin}, process.env.JWT_TOKEN)

        res.cookie("access_token",token,{httpOnly: true}).status(201).json({details: {...others}, isAdmin})

    }catch(err){
        res.status(500).json("Error")
    }
})
router.put("/:id",verifyTokenAndAuthorization, async(req,res)=>{
    try{
        const updatedUser = await users.findByIdAndUpdate(req.params.id,{$set: req.body},{new: true})
        res.status(201).json(updatedUser)
    }catch(err){
        res.status(500).json("Err" + err)
    }
})
//Delete
router.delete("/:id",verifyTokenAndAuthorization, async(req,res)=>{
    try{
       await users.findByIdAndDelete(req.params.id)
        res.status(201).json("Deleted")
    }catch(err){
        res.status(500).json("Err" + err)
    }
})
//Get
router.get("/:id", verifyTokenAndAuthorization,async(req,res)=>{
    try{
        const user = await users.findById(req.params.id)
        res.status(201).json(user)
    }catch(err){
        res.status(500).json("Err" + err)
    }
})

//Get All
router.get("/",verifyIsAdmin, async(req,res)=>{
    try{
        const user = await users.find()
        res.status(201).json(user)
    }catch(err){
        res.status(400).json("err" + err)
    }
    
})

//check out

// router.get("/checkauth", verifyToken, (req,res,next)=>{
//     res.send("Authorized")
// })
// router.get("/checkuser/:id", verifyTokenAndAuthorization, (req,res,next)=>{
//     res.send("Authorized to delete")
// })
// router.get("/verifyIsAdmin/:id", verifyIsAdmin, (req,res,next)=>{
//     res.send("Admin to delete all")
// })


module.exports = router