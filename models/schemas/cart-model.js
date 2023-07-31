const {Schema, model, Types} = require('mongoose')

const CartSchema = new Schema({
    userId: {type: Types.ObjectId, ref: 'User'},
    productId: {type: Types.ObjectId, ref: 'Product'},
    count: {type: Number}
})

module.exports = model('Cart', CartSchema)