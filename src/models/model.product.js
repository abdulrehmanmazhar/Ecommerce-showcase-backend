import mongoose ,{ Schema } from "mongoose";


const productSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    images:{
        type:[String],
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        default: 0
    },
    brand:{
        type: String,
        required: true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    countInStock:{
        type: Number,
        default: 0
    },
    rating:{
        type: Number,
        default: 0
    },
    numReviews:{
        type: Number,
        default: 0
    },
    isFeatured:{
        type: Boolean,
        default: false
    }
},{timestamps: true})

export const Product = mongoose.model('product', productSchema)