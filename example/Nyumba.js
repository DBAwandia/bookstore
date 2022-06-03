const express = require("express")
const router = express.Router()
const example2 = require("./Nyumbas")
const { verifyTokenAndAuthorization,verifyTokens, verifyAdmin } = require("./verifyTokenss")

router.post("/",verifyAdmin, async(req,res)=>{
    const name = req.body.name
    const type = req.body.type
    const title = req.body.title
    const city =  req.body.city
    const distance = req.body.distance
    const photos = req.body.photos
    const desc = req.body.desc
    const rating = req.body.rating
    const rooms= req.body.rooms
    const cheapestPrice= req.body.cheapestPrice
    const featured = req.body.featured

    const savedData = example2({ name: name, type: type, title: title, city: city, distance: distance, photos: photos, desc: desc ,rating: rating, rooms: rooms, cheapestPrice: cheapestPrice, featured: featured})
    try{
        await  savedData.save()
        res.status(200).json(savedData)
    }catch(err){
        res.status(500).json(err)
    }
})

router.put("/:id",verifyAdmin, async(req,res)=>{
    try{
        const updatedUser = await example2.findByIdAndUpdate(req.params.id,{$set: req.body},{new: true})
        res.status(200).json(updatedUser)
    }catch(err){
        res.status(500).json(err)
    }
})
router.get("/", verifyAdmin,async (req,res)=>{
    try{
       const getData = await example2.find()
       res.status(201).json(getData)

    }catch(err){
        res.status(500).json(err)
    }
})
router.get("/:id", verifyAdmin,async (req,res)=>{
    try{
       const getData = await example2.findById(req.params.id)
       res.status(201).json(getData)

    }catch(err){
        res.status(500).json(err)
    }
})
router.delete("/:id", verifyTokenAndAuthorization,async (req,res)=>{
    try{
      await example2.findByIdAndDelete(req.params.id)
       res.status(201).json("Deleted")

    }catch(err){
        res.status(500).json(err)
    }
})
module.exports = router