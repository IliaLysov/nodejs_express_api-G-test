const {Schema, model, Types} = require('mongoose')

const UserSchema = new Schema({
    username: {
        type: String,
        require: true,
        validate: {
            validator: function (value) {
                const latinRegex = /^[a-zA-Z ]*$/
                return latinRegex.test(value)
            },
            message: props => `${props.value} is not a valid username. Only Latin characters are allowed.`
        },
        unique: true
    },
    organization: {type: Types.ObjectId},
    subscribe: {type: Boolean},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String},
    surname: {type: String},
    avatar: {
        ETag: {type: String},
        Location: {type: String},
        Key: {type: String},
        Bucket: {type: String}
    },
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String}
})

module.exports = model('User', UserSchema)