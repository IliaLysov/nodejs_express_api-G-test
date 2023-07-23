const {Schema, model, Types} = require('mongoose')

const UserSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    surname: {type: String, required: true},
    avatar: {
        ETag: {type: String},
        Location: {type: String},
        Key: {type: String},
        Bucket: {type: String}
    },
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    seller: {type: Boolean, default: false},
    cart: [{
        id: {type: Types.ObjectId},
        count: {type: Number}
    }],
    favorite: [{type: Types.ObjectId}]
})

module.exports = model('User', UserSchema)