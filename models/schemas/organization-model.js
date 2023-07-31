const {Schema, model, Types} = require('mongoose')

const OrganizationSchema = new Schema({
    name: {type: String},
    nickname: {
        type: String,
        require: true,
        validate: {
            validator: function (value) {
                const latinRegex = /^[a-zA-Z -]*$/
                return latinRegex.test(value)
            },
            message: props => `${props.value} is not a valid nickname. Only Latin characters are allowed.`
        },
        unique: true
    },
    description: {type: String},
    email: {type: String},
    site: {type: String},
    whatsApp: {type: String},
    telegram: {type: String},
    approved: {type: Boolean},
    logo: {
        ETag: {type: String},
        Location: {type: String},
        Key: {type: String},
        Bucket: {type: String}
    },
    created_at: {type: Types.ObjectId, ref: 'User'},
    editors: [{type: Types.ObjectId, ref: 'User'}]
})

module.exports = model('Organization', OrganizationSchema)