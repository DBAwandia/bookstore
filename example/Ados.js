const mongoose = require("mongoose")
const validator = require("validator")
const adoSchema = new mongoose.Schema({
    number:{
        type: Number,
        required: true,
        unique: true
    },
    email:{
        type: String,
        validate:{
          validator:  validator.isEmail,
          message:"Enter correct email"
        },
        required: true
    },
    password:{
        type: String,
        minlength: 6,
        required: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    }
},{timestamps: true})

const Ados = mongoose.model("examples", adoSchema)

module.exports = Ados