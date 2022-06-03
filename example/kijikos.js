const express = require("express")
const router = express.Router()
const kijiko = require("./kijiko")
const example2 = require("./Nyumbas")
const rooms = require("./kijiko")
const { verifyAdmin } = require("./verifyTokenss")
//update hotel
router.post("/:hotelid", async(req,res)=>{
    const hotelId = req.params.hotelid
    const newKijiko = new kijiko(req.body)
    try{
        const savedHotel = await newKijiko.save()
        try{
            await example2.findByIdAndUpdate(hotelId, {$push:{ room:savedHotel._id }})
        }catch(err){
            res.status(500).json(err)
        }
        res.status(200).json(savedHotel)
    }catch(err){
        res.status(500).json(err)
    }
})
//delete
router.delete("/:id/:hotelid",async(req,res)=>{
    const hotelId = req.params.hotelid
    try{
        await rooms.findByIdAndDelete(req.params.id)
        try{
            await example2.findByIdAndUpdate($pull,{rooms: req.params.id})
        }catch(err){
            res.status(500).json(err)
        }
        res.status(200).json("Deleted")
    }catch(err){
        res.status(500).json(err)
    }
})
router.put("/:id",async(req,res)=>{
    try{
        const updatedUser = await rooms.findByIdUpdate(req.params.id,{$set: req.body},{new: true})
        res.status(200).json(updatedUser)
    }catch(err){
        res.status(500).json(err)
    }
})
router.get("/:id",async(req,res)=>{
    try{
        const getUser = await rooms.findById(req.params.id)
        res.status(200).json(getUser)
    }catch(err){
        res.status(500).json(err)
    }
})
router.get("/", async(req,res)=>{
    try{
        const getuser = await rooms.find()
        res.status(200).json(getuser)
    }catch(err){
        res.status(500).json(err)
    }
})



module.exports = router