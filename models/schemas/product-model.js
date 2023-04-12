const {Schema, model, Types} = require('mongoose')

const ProductSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String},
    images: [{type: String}],
    owner: {type: Types.ObjectId, ref: 'User'},
})

module.exports = model('Product', ProductSchema)