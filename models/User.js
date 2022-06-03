const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true,
        unique: true
    },
    email:{
        type: String,
        validate:{
            validator: validator.isEmail,
            message: "provide email"
        },
        required: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    isAdmin:{
        type: Boolean,
        default: true
    }
},{timestamps: true})

const User = mongoose.model("users", userSchema)

module.exports = User