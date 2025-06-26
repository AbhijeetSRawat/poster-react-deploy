import Product from "../models/add-product.models.js";

export async function showProductWithDate (req, res) {
    try {
        const now = new Date();
        const month = now.getMonth() + 1; // Months are 0-indexed
        const day = now.getDate();

        // Convert stored dates to match only month and day
        const products = await Product.find({
            $expr: {
                $and: [
                    { $eq: [{ $month: "$createdAt" }, month] },
                    { $eq: [{ $dayOfMonth: "$createdAt" }, day] }
                ]
            }
        });

        console.log("the products are : ", products);
        
        return res.status(200).json({
            success: true,
            message: "All the images have been fetched successfully",
            data: products
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error while displaying images with date"
        });
    }
};


