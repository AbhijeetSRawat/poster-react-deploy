import mongoose from "mongoose";
import Otp from "../models/otp.js"
import { sendMail } from "../utils/sendMail.js";
import { User } from "../models/user.models.js";
import  Product  from "../models/add-product.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/APiResponse.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer';
import crypto from 'crypto'
import dotenv from 'dotenv'

import { uploadImageToCloudinary } from "../utils/imageUploader.js";
dotenv.config();


const saltRounds = 10;

// hash password function
async function hashPassword(password) {
    return await bcrypt.hash(password, saltRounds);

};

// Auth Sign Up Controller
async function authSignUpController(req, res) {
    try {
        const { firstName, lastName, email, password, number } = req.body;

        if (!firstName || !lastName || !email || !number || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        const hashedPassword = await hashPassword(password);
        const user = await User.create({ firstName, lastName, number, email, password: hashedPassword });

        // Generate token using method
        const token = await user.generateAuthToken();

       return res.status(200).json({
    success: true,
    message: 'SignUp successful!',
    token, // JWT token
    user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
    },
});

    } catch (error) {
        console.error(`Error: Registration ${error.message}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Please try again!",
        });
    }
}

// Login controller
const loginController = async (req, res) => {
    try {

        const adminEmail = "Admin@gmail.com";
        const adminPassword = "123456"

        const { email, password } = req.body;
        const user = await User.findOne({ email : email }).populate('profile').exec();

        console.log(user);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        if(email == adminEmail && password == adminPassword){
            user.role = "admin"
        }

        // Generate token using method
        const token = await user.generateAuthToken();

        return res.status(200).json({
            success: true,
            message: 'Login successful!',
            token, // Return token
            user
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};


// genrate Otp
async function genrateOtp() {
    return crypto.randomInt(1000, 9999);
}

// Forget Password Controller
async function userForgetPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(otp)
    const create = await Otp.findOneAndUpdate(
  { email: email.toLowerCase() },
  {
    $set: {
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  },
  { upsert: true }
);

    

    await sendMail(email, `Your TechBro24 password reset OTP is: ${otp}`);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });

  } catch (error) {
    console.error('Error in forget password:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}




// veriy Otp


async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    console.log("first",email," ",otp);
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }
console.log("second");
   const record = await Otp.findOne({ otp: otp });

console.log("third");
console.log("otp: ",record);

    if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }
console.log("4");
    await Otp.deleteOne({ otp }); // Cleanup OTP after use
console.log("5");
    const user = await User.findOne({ email: record.email.toLowerCase() });
console.log("6");
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      userId: user ? user._id : null,
    });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during OTP verification",
    });
  }
}





// Update Password 
async function resetPassword(req, res) {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(401).json({
            success: false,
            message: "new Password is Required"
        });
    };

    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.findByIdAndUpdate(id, { password: hashPassword }, { new: true });

        if (!updatedUser) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Error reset Password Please try again"
                }
            );
        };

        return res.status(200).json(
            {
                success: true,
                message: "Password Reset Successful"
            }
        );

    } catch (error) {
        console.log(`Error reset Password api ${error}`);
        return res.status(500).json(
            {
                success: false,
                message: "Error reset password internal server Error"
            }
        );
    };
};


// Admin login
const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (email === "admin@gmail.com" && password === "3434") {
            return res.status(200).json({ message: "Admin is logged in" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        // Successful login
        res.status(200).json({ message: "User logged in successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};



// Admin Controllers 
async function adminViewController(req, res) {
    try {
        const fetchAllUser = await User.find({});

        if (!fetchAllUser || fetchAllUser.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Users Fetched Successfully",
            allUsers: fetchAllUser , // Ensure this is sent in the response
            userLength: fetchAllUser.length
        });
    } catch (error) {
        console.log(`Error fetching users ${error}`);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// admin delete controller
async function adminDeleteUser(req, res) {
    const id = req.params.id;
    try {
        const adminDeleteUser = await User.findByIdAndDelete(id);

        if (!adminDeleteUser) {
            return res.status(401).json(
                {
                    success: false,
                    message: "Error Delete User"
                }
            );
        };

        return res.status(200).json(
            {
                success: true,
                message: "User Deleted Succesfull",
                deletedUserData: adminDeleteUser
            }
        );


    } catch (error) {
        console.log(`Error Deleting user ${error}`);
        return res.status(500).json(
            {
                success: false,
                message: "Error Delete User Internal Server Errorr"
            }
        );
    };
};


// Add product admin - Only image and category
// async function adminAddProduct(req, res) {
//     const { category } = req.body;

//     const image = req.file; // Multer stores multiple files in req.files array
//     console.log(image)
//     // Validation: category and at least one image required
//     if (!category || !image ) {
//         console.log("did not get image",category)
//         return res.status(400).json({
//             success: false,
//             message: "Category and at least one image are required"
//         });
//     }

//     try {
//         const imageFilename = image.filename; // Extract filenames

//         // const Image = await uploadImageToCloudinary(
//         //     image,
//         //     process.env.FOLDER_NAME
//         // )

//         const productData = {
//             category,
//             productImage: imageFilename, // Store all uploaded images
//             createdAt: Date.now(),
//             path: image.path,
//             // productURL:Image.secure_url
//         };

//         const product = await Product.create(productData);

//         if (!product) {
//             console.log("is error here")
//             return res.status(500).json({
//                 success: false,
//                 message: "Error creating product. Internal Server Error"
//             });
//         }

//         console.log("The product is : ",product)
//         return res.status(201).json({
//             success: true,
//             message: "Images uploaded successfully",
//             data: product
//         });
//     } catch (error) {
//         console.error('Error in adminAddProduct:', error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error. Please try again"
//         });
//     }
// }

async function adminAddProduct(req, res) {
  const { category } = req.body;
  const tags = Array.isArray(req.body.tags)
    ? req.body.tags
    : req.body.tags
    ? [req.body.tags]
    : [];

  const image = req.file;

  if (!category || !image) {
    return res.status(400).json({
      success: false,
      message: "Category and image are required"
    });
  }

  try {
    const imageFilename = image.originalname;

    const Image = await uploadImageToCloudinary(
      image,
      process.env.FOLDER_NAME
    );

    const productData = {
      category,
      productImage: imageFilename,
      createdAt: Date.now(),
      path: Image.secure_url,
      tags
    };

    const product = await Product.create(productData);

    if (!product) {
      return res.status(500).json({
        success: false,
        message: "Error creating product. Internal Server Error"
      });
    }

    return res.status(201).json({
      success: true,
      message: "Product uploaded successfully",
      data: product
    });
  } catch (error) {
    console.error("Error in adminAddProduct:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again"
    });
  }
}




// get product
async function getAllProduct(req, res) {
    try {
        const fetchProuct = await Product.find({});

        if (!fetchProuct) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Product not found"
                }
            );
        };

        return res.status(200).json(
            {
                success: true,
                message: "Product fetched successfull",
                allProduct: fetchProuct,
                totalProduct: fetchProuct.length
            }
        );

    } catch (error) {
        console.log(`Error get all product ${error}`);
        return res.status(500).json(
            {
                success: false,
                message: "Error Internal server error get Products"
            }
        );
    };
};

async function deleteProduct(req, res) {
    const deleteProduct = req.params.id;

    try {
        const response = await Product.findByIdAndDelete(deleteProduct);

        if (!response) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Product Not found"
                }
            );
        };

        return res.status(200).json(
            {
                success: false,
                message: true,
                deleteProductData: response
            }
        );

    } catch (error) {
        console.log(`Error Delete Product ${error}`);
        return res.status(500).json(
            {
                success: false,
                message: "Internal Server Error"
            }
        );
    };
};



// Product Update
async function adminProductEdit(req, res) {
    const { id } = req.params; // Get the product ID from the URL
    const { productName, price, offerOnPrice, category, rating } = req.body;

    if (!id) {
        return res.status(404).json(
            {
                success: false,
                message: "Id Not Found"
            }
        )
    };


    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product ID format"
        });
    }

    try {
        // Prepare updated product data
        const updatedProductData = {
            productName,
            price,
            offerOnPrice,
            category,
            rating,
        };

        if (req.file) {
            updatedProductData.productImage = req.file.filename;
        }

        // Update the product in the database
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedProductData, {
            new: true,
            runValidators: true,
        });

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            updatedProduct,
        });
    } catch (error) {
        console.error('Error in adminProductEdit:', error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Please try again"
        });
    };
};


// Product Get With Id
async function getProductWithId(req, res) {
    const productID = req.params.id;
    if (!productID) {
        return res.status(404).json(
            {
                success: false,
                message: "Product Id Not Found"
            }
        )    };

    try {
        const findProductWithId = await Product.findById(productID);

        if (!findProductWithId) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Product Not Found"
                }
            )
        };

        return res.status(200).json(
            {
                success: true,
                message: "Product Get Succesfull With Particular Id",
                productData: findProductWithId
            }
        );

    } catch (error) {
        console.log(`Error: ${error}`);
        throw new ApiError(500, "Internal Server Error geting Product With Id");
    }
};

// Increment Product Click Count
async function updateProductClick(req, res) {
    const productId = req.params.id;

    if (!productId) {
        return res.status(400).json({
            success: false,
            message: "Product ID is required",
        });
    }

    try {
        // Find product by ID
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Increment the click count
        product.clickCount += 1;  // Increment the total click count

        // Add a click entry into the clicks array
        product.clicks.push({
            timestamp: new Date(),
        });

        // Save the updated product
        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product click count updated successfully",
            product,
        });
    } catch (error) {
        console.error("Error updating product click:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}





export {
    authSignUpController,
    loginController,
    userForgetPassword,
    verifyOtp,
    resetPassword,
    adminLogin,
    adminViewController,
    adminDeleteUser,
    adminAddProduct,
    getAllProduct,
    deleteProduct,
    adminProductEdit,
    getProductWithId,
    updateProductClick,

}




