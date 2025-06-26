import { User } from "../models/user.models.js";

export async function getUserDetails (req,res){
    try{

        const userId = req.user._id;

        const user = await User.findById(userId).populate('profile').exec();

        return res.status(200).json({
            success:true,
            message:"User details fetched successfully !",
            data:user
        })
    }
    catch(error){
        console.log(error);
       return res.status(500).json({
            success:false,
            message:"User details can't be fetched"
        })
    }
}

