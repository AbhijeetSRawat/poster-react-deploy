import Profile from "../models/profile.js";
import { User } from "../models/user.models.js";

import { uploadImageToCloudinary } from "../utils/imageUploader.js";
import dotenv from 'dotenv'

dotenv.config();

export async function profile (req,res){
    try{
        
        const userId = req.user._id;
       
        const{address,about, age, gender,business} = req.body;
        console.log(address,about,age,gender,business)

        const {logo}= req.files;
        console.log("REQ.FILES:", logo);


        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                success:false,
                message:"No User found !"
            })
        }

         const image = await uploadImageToCloudinary(
            logo,
            process.env.FOLDER_NAME,
            )
         console.log("Image uploaded:", image);

          const profile = await Profile.create({ address,about, age, gender, logo:image.secure_url,business });

          user.profile = profile._id;

          await user.save()

       return res.status(200).json({
            success:true,
            message: "profile created successfully",
            data:profile
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error
        })
    }
}