import { Category } from "../models/model.category.js";
import { Product } from "../models/model.product.js";
import express from 'express';
import pLimit from 'p-limit';
import {v2 as cloudinary} from 'cloudinary';
const router = express.Router();

router.get('/', async(req, res)=>{
    const productList = await Product.find().populate({ path: 'Category', strictPopulate: false });
    if(!productList){
        res.status(500).json({success:false})
    }
    res.send(productList)
})
router.get('/:id', async(req, res)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
        return res.status(500).json({message:"this particular product wasn't found"})
    }
    return res.status(200).send(product);
})
router.post('/create',async (req, res)=>{
    const category = await Category.findById(req.body.category);
    if(!category){
        return res.status(404).send('invaild category')
    }
    const limit = pLimit(2);
    const images = req.body.images.map((image)=>{
        return limit(async()=>{
            const result = await cloudinary.uploader.upload(image);
            return result;
        })
    })
    let uploadStatus = await Promise.all(images);
    const imgURL = uploadStatus.map((item)=>{
        return item.secure_url;
    })

    if(!uploadStatus){
        return (res.status(500).json({error: 'image cannot upload', success: false}))
    }
    let data = req.body;
    data.images=imgURL;
    let product = new Product(data);
    if(!product){
        return res.status(500).json({error: err , success: false})
    }
    product = await product.save()
    res.status(201).json(product);
})
router.delete('/:id', async(req, res)=>{
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if(!deletedProduct){
        return res.status(404).json({message:"this particular product wasn't found", success: false})
    }
    return res.status(200).json({message:'Deleted successfully', success: true});
})
router.put('/:id', async(req, res)=>{
    const limit = pLimit(2);
    const images = req.body.images.map((image)=>{
        return limit(async()=>{
            const result = await cloudinary.uploader.upload(image);
            return result;
        })
    })
    let uploadStatus = await Promise.all(images);
    const imgURL = uploadStatus.map((item)=>{
        return item.secure_url;
    })
    let data = req.body;
    data.images=imgURL;
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{data},{new:true})
    if(!updatedProduct){
        return res.status(404).json({message:"this particular product wasn't updated maybe it doesn't exist", success: false})
    }
    return res.status(200).json({message:'Updated successfully', success: true});
})
export default router;