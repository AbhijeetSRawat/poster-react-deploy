import Profile from "../models/profile.js";
import { User } from "../models/user.models.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";
import dotenv from "dotenv";

dotenv.config();

export async function profile(req, res) {
  try {
    const userId = req.user._id;
    const { address, about, age, gender, business } = req.body;

    console.log("Form fields:", address, about, age, gender, business);

    const logoFile = req?.files?.logo?.[0] || null;
    const footerFile = req?.files?.footer?.[0] || null;

    console.log("Uploaded Files:", logoFile?.originalname, footerFile?.originalname);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found!",
      });
    }

    let image1 = { secure_url: "" };
    let image2 = { secure_url: "" };

    if (logoFile) {
      image1 = await uploadImageToCloudinary(logoFile, process.env.FOLDER_NAME);
      console.log("Logo uploaded:", image1.secure_url);
    }

    if (footerFile) {
      image2 = await uploadImageToCloudinary(footerFile, process.env.FOLDER_NAME);
      console.log("Footer uploaded:", image2.secure_url);
    }

    const profile = await Profile.create({
      address,
      about,
      age,
      gender,
      business,
      logo: image1.secure_url,
      footer: image2.secure_url,
    });

    user.profile = profile._id;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile created successfully",
      data: profile,
    });
  } catch (error) {
    console.error("Profile creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
}
