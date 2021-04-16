const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductModel = new Schema({
    name: {
        type:String
    },
    price: Number,
    desc: String
})

module.exports = mongoose.model('Product', ProductModel)