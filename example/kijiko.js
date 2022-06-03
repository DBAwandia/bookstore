const mongoose = require("mongoose")

const kijikoSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true,
    },
    price:{
        type: Number,
        required:true,
    },
    desc:{
        type: String,
        required:true,
    },
    maxPeople:{
        type: Number,
        required:true,
    },

    roomNumbers:[{number: Number, unavailableDates: {type: [Date]}}]
       
},{timestamps: true})

const kijiko = mongoose.model("rooms", kijikoSchema)
module.exports = kijiko