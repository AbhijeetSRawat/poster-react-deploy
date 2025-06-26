import { User } from "../models/user.models.js";


export async function getAllUsers (req,res){
    try{
        const Users = await User.find({}).populate('profile').exec();

        if(!Users){
            return res.status(404).json({
                success:false,
                message:"No User found !"
            })
        }

       return res.status(200).json({
            success:true,
            message:"Users fetched successfully",
            data:Users
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}