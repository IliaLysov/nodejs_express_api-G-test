const {Schema, model, Types} = require('mongoose')

const ProductSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String},
    price: {type: Number},
    quantity: {type: Number},
    rootPacking: {type: String},
    packageType: {type: String},
    packageCount: {type: Number},
    seedlingHight: {type: Number},
    seedlingWidth: {type: Number},
    seedTrunkHeight: {type: Number},
    seedTrunkGirth: {type: Number},
    plantType: [{type: String}],
    leafType: {type: String},
    frostResistance: {type: Number},
    lightLevel: {type: String},
    crownShape: [{type: String}],
    floweringPeriod: [{type: String}],
    careFeature: [{type: String}],
    soil: [{type: String}],
    deseaseResistance: {type: String},
    permanentLeafColor: [{type: String}],
    autumnLeafColor: [{type: String}],
    flowerColor: [{type: String}],
    trunkColor: [{type: String}],
    plantHeight: {type: String},
    plantWidth: {type: String},
    plantTrunkHeight: {type: String},
    plantTrunkGirth: {type: String},
    created_at: {type: Types.ObjectId, ref: 'User'},
    sellerName: {type: String},
    images: [{
        ETag: {type: String},
        Location: {type: String},
        Key: {type: String},
        Bucket: {type: String}
    }]
})

module.exports = model('Product', ProductSchema)