import Product from "../models/add-product.models.js";

export async function displayPicturesByCategories (req,res){
    try{
        const {category} = req.body;

        const pictures = await Product.find({category : category});

        return res.status(200).json({
            success:true,
            message:"All the pictures fetched successfully with respect to their categories",
            data:pictures
        })
    }
    catch(error){

        console.log(error);

        return res.status(500).json({
            success:false,
            message:"Error fetching pictures with a particular category"
    })
    }
}