import mongoose from 'mongoose'

const ShopItemSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: String,
        trim: true
    },
    stock: {
        type: Number
    },
    image: {
        type: String,
        trim: true
    }
})

const shopItemModel = mongoose.model('Shop Item', ShopItemSchema, 'shop');
shopItemModel.createIndexes();
export default shopItemModel