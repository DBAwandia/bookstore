const express = require("express")
const Hotel = require("../models/Hotel")
const router = express.Router()
const hotels = require("../models/Hotel")
const Room = require("../models/Room")
const { verifyIsAdmin } = require("./verifyToken")

//create
router.post("/", async(req,res)=>{
    const newHotel =new Hotel(req.body)
    try{
        const savedHotel = await newHotel.save()
        res.status(200).json(savedHotel)
    }catch(err){
        res.status(500).json("Err" + err)
    }
})
//update
router.put("/:id", async(req,res)=>{
    try{
        const updatedHotel = await hotels.findByIdAndUpdate(req.params.id,{$set: req.body},{new: true})
        res.status(201).json(updatedHotel)
    }catch(err){
        res.status(500).json("Err" + err)
    }
})
//Delete
router.delete("/:id", async(req,res)=>{
    try{
       await hotels.findByIdAndDelete(req.params.id)
        res.status(201).json("Deleted")
    }catch(err){
        res.status(500).json("Err" + err)
    }
})
//Get
router.get("/find/:id", async(req,res)=>{
    try{
        const hotel = await hotels.findById(req.params.id)
        res.status(201).json(hotel)
    }catch(err){
        res.status(500).json("Err" + err)
    }
})

//Get All
router.get("/", async(req,res)=>{
    const {min,max, ...others}= req.query
    try{
        const hotell = await hotels.find({...others, cheapestPrice: {$gt: min | 1, $lt: max || 999},}).limit(req.query.limit)
        res.status(201).json(hotell)
    }catch(err){
        res.status(400).json("err" + err)
    }
    
})

router.get("/countByCity", async(req,res)=>{
    const cities = req.query.cities.split(",")
    try{
        const list = await Promise.all(cities.map(city=>{
            return hotels.countDocuments({ city: city})
        }))
        res.status(201).json(list)
    }catch(err){
        res.status(400).json("err" + err)
    }
    
})
router.get("/countByType", async(req,res)=>{

    try{
        const hotelCount = await hotels.countDocuments({type: "hotel"})
        const apartmentCount = await hotels.countDocuments({type: "apartment"})
        const resortCount = await hotels.countDocuments({type: "resort"})
        const villaCount = await hotels.countDocuments({type: "villa"})
        const cabinCount = await hotels.countDocuments({type: "cabin"})
    
        res.status(201).json([
            {type: "hotel", count: hotelCount},
            {type: "apartments", count: apartmentCount},
            {type: "resorts", count: resortCount},
            {type:"villas", count: villaCount},
            {type:"cabins", count: cabinCount}
        ])
    }catch(err){
        res.status(400).json("err" + err)
    }
    
})
router.get("/room/:id", async(req,res)=>{
    try{
        const hoteli = await hotels.findById(req.params.id)
        const list = await Promise.all(hoteli.roomy.map((room)=>{
            return Room.findById(room)
        }))
        res.status(200).json(list)
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router
