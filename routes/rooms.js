const express = require("express")
const Room =require("../models/Room")
const Hotel = require("../models/Hotel")
const router = express.Router()
const rooms = require("../models/Room")
const { verifyIsAdmin } = require("./verifyToken")

router.post("/:hotelid", async (req,res)=>{
    const hotelId = req.params.hotelid
    const newRoom = new Room(req.body)

try{
    const savedRoom =await newRoom.save()
    try{
        await Hotel.findByIdAndUpdate(hotelId,{$push: {roomy: savedRoom._id}})
    }catch(err){
        res.status(500).json(err + "err")
    }
    res.status(200).json(savedRoom)
}catch(err){
    res.status(500).json(err+ "err")
}
})
//update
router.put("/:id",verifyIsAdmin, async(req,res)=>{
    try{
        const updatedRoom = await rooms.findByIdAndUpdate(req.params.id,{$set: req.body},{new: true})
        res.status(201).json(updatedRoom)
    }catch(err){
        res.status(500).json("Err" + err)
    }
})
//Delete
router.delete("/:id/:hotelid",verifyIsAdmin, async(req,res)=>{
    const hotelId = req.params.hotelid

    try{
       await rooms.findByIdAndDelete(req.params.id)
       try{
        await Hotel.findByIdAndUpdate(hotelId,{$pull: {roomy: req.params.id}})
    }catch(err){
        res.status(500).json(err + "err")
    }
        res.status(201).json("Deleted")
    }catch(err){
        res.status(500).json("Err" + err)
    }
})
//Get
router.get("/:id", async(req,res)=>{
    try{
        const room = await rooms.findById(req.params.id)
        res.status(201).json(room)
    }catch(err){
        res.status(500).json("Err" + err)
    }
})

//Get All
router.get("/", async(req,res)=>{
    try{
        const roomm = await rooms.find()
        res.status(201).json(roomm)
    }catch(err){
        res.status(400).json("err" + err)
    }
    
})



module.exports = router