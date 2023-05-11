const mongoose = require('mongoose')

const MemberSchema = new mongoose.Schema({
    name:{
        firstName:{
            type: String,
            required: true
        },
        lastName:{
            type: String,
            required: true
        },
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    createDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = Memeber = mongoose.model('member', MemberSchema)