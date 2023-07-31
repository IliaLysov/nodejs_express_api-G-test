const {Schema, model, Types} = require('mongoose')

const FavoritesSchema = new Schema({
    userId: {type: Types.ObjectId, ref: 'User'},
    productId: {type: Types.ObjectId, ref: 'Product'},
})

module.exports = model('Favorites', FavoritesSchema)