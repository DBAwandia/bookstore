const express = require("express")
const router = express.Router()
const examples = require("../example/Ados")
const CryptoJS = require("crypto-js")
const jwt =require("jsonwebtoken")
const {verifyTokenAndAuthorization,verifyTokens, verifyAdmin } = require("./verifyTokenss")
//register
router.post("/register", async(req,res)=>{
    const number = req.body.number
    const email = req.body.email
    const password = CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SEC).toString()
    const user = examples({ number: number, email: email , password: password})
    try{
        const oldUser = await examples.findOne({ email: req.body.email})
        if(oldUser){
            res.status(400).json("Already in use")
        }else{
             await user.save()
            res.status(200).json(user)
        }
    }catch(err){
        res.status(500).json(err + "err")
    }
})
//login
router.post("/login", async(req,res)=>{
    try{
        const user = await examples.findOne({number: req.body.number})
        !user && res.status(400).json("provide details")
        const hashedPassword = CryptoJS.AES.decrypt(user.password,process.env.PASS_SEC)
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
        originalPassword !== req.body.password && res.status(400).json("Wrong")

        const {password,isAdmin, ...others} = user._doc
        const token = jwt.sign({id: user._id, admin: user.isAdmin}, process.env.JWT_TOKEN,{expiresIn:"3d"})

        res.cookie("access_tokens", token,{httpOnly: true}).status(200).json({details:{...others}, isAdmin})

    }catch(err){
        res.status(500).json(err)
    }
})
//update
router.put("/:id",verifyTokenAndAuthorization,async(req,res)=>{
    try{
        const updatedUser = await examples.findByIdAndUpdate(req.params.id,{$set: req.body},{new: true})
        res.status(201).json(updatedUser)
    }catch(err){
        res.status(500).json(err)
    }
})
// router.put("/:id",verifyTokenAndAuthorization, async(req,res)=>{
//     try{
//         const updatedUser = await examples.findByIdAndUpdate(req.params.id,{$set: req.body},{new: true})
//         res.status(201).json(updatedUser)
//     }catch(err){
//         res.status(500).json("Err" + err)
//     }
// })
//delete
router.delete("/:id",verifyTokenAndAuthorization, async(req,res)=>{
    try{
      await examples.findByIdAndDelete(req.params.id)
        res.status(201).json("Deleted")
    }catch(err){
        res.status(500).json("Err" + err)
    }
})
//get by id
router.get("/:id",verifyTokenAndAuthorization, async(req,res)=>{
    try{
        const getUser = await examples.findById(req.params.id)
        res.status(201).json(getUser)
    }catch(err){
        res.status(500).json("Err" + err)
    }
})
router.get("/",verifyAdmin, async(req,res)=>{
    try{
        const getUser = await examples.find()
        res.status(201).json(getUser)
    }catch(err){
        res.status(500).json("Err" + err)
    }
})





module.exports = router