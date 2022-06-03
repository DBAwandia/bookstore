const mongoose =require("mongoose")

const nyumbaSChema = new mongoose.Schema({
        name:{
            type: String,
            required: true
        },
        type:{
            type: String,
            required: true
        },
        title:{
            type: String,
            required: true
        },
        city:{
            type: String,
            required: true
        },
        distance:{
            type: String,
            required: true
        },
        photos:{
            type: [String],
        },
        desc:{
            type: String,
            required: true
        },
        rating:{
            type: Number,
            min: 0,
            max: 8
        },
        rooms:{
            type: [String]
        },
        cheapestPrice:{
            type: Number,
            required: true
        },
        featured:{
            type: Boolean,
            default: false
        }
},{timestamps: true})

const Nyumbas = mongoose.model("example2", nyumbaSChema)

module.exports = Nyumbas