const {Schema, model, Types} = require('mongoose')

const ProductSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String},
    quantity: {type: Number},
    price: {type: Number},
    images: [{
        ETag: {type: String},
        Location: {type: String},
        Key: {type: String},
        Bucket: {type: String}
    }],
    created_at: {type: Types.ObjectId, ref: 'User'},
    sellerName: {type: String}
})

module.exports = model('Product', ProductSchema)