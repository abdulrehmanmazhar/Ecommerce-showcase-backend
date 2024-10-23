import { Category } from "../models/model.category.js";
import express from 'express';
import pLimit from 'p-limit';
import {v2 as cloudinary} from 'cloudinary';
const router = express.Router();

router.get('/', async (req, res)=>{
    const categoryList = await Category.find();

    if(!categoryList){
        return res.status(500).json({success:false})
    }
    res.send(categoryList)
})
router.get('/:id', async(req, res)=>{
    const category = await Category.findById(req.params.id)
    if(!category){
        return res.status(500).json({message:"this particular category wasn't found"})
    }
    return res.status(200).send(category);
})
router.delete('/:id', async(req, res)=>{
    const deletedCategory = await Category.findByIdAndDelete(req.params.id)
    if(!deletedCategory){
        return res.status(404).json({message:"this particular category wasn't found", success: false})
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
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id,{name : req.body.name,
        images: imgURL,
        color : req.body.color},{new:true})
    if(!updatedCategory){
        return res.status(404).json({message:"this particular category wasn't updated maybe it doesn't exist", success: false})
    }
    return res.status(200).json({message:'Updated successfully', success: true});
})
router.post('/create',async (req, res)=>{
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

    let category = new Category({
        name : req.body.name,
        images: imgURL,
        color : req.body.color
    })

    if(!category){
        return res.status(500).json({error: err , success: false})
    }

    category = await category.save();

    res.status(200).json(category);
})
export default router;