import Product from "../models/add-product.models.js";

export async function displayAllPictures (req,res){
    try{
        const Products = await Product.find({});

        if(!Products){
            return res.status(404).json({
                success:false,
                message:"No Products found !"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Products fetched successfully",
            data:Products
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}