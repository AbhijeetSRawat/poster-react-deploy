import { User } from "../models/user.models.js";

export async function subscribe(req, res) {
    try {
        const userId = req.body.userId;
        
        // 1. Find user
        const user = await User.findById(userId); // Simplified query

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 2. Check subscription status (fixed variable name casing)
        if (user.subscribed) {
            return res.status(409).json({
                success: false,
                message: "User already has an active subscription",
                data: {
                    subscribedSince: user.subscriptionDate // Consider adding this field to your schema
                }
            });
        }

        // 3. Update subscription
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                subscribed: true,
                subscriptionDate: new Date(Date.now()) // Track when subscription was activated
            },
            { 
                new: true,
                runValidators: true,
                
            }
        );

        return res.status(200).json({
            success: true,
            message: "Subscription activated successfully",
            data: updatedUser
        });

    } catch (error) {
        console.error("Subscription Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message // Include error details for debugging
        });
    }
}