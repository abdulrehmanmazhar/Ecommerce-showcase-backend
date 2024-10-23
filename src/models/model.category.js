import mongoose ,{ Schema } from "mongoose";

const cateogySchema = new Schema({
    name:{
        type: String,
        required: true
    },
    images:{
        type: [String],
        required: true
    },
    color:{
        type: String,
        required: true
    }
},
{timestamps: true})

export const Category = mongoose.model('category', cateogySchema);