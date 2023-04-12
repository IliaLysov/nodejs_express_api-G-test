const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    surname: {type: String, required: true},
    avatar: {type: String},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    seller: {type: Boolean, default: false}
})

module.exports = model('User', UserSchema)