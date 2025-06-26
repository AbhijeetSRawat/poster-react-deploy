

import crypto from "crypto"


import {mongoose} from "mongoose"
import {User} from "../models/user.models.js"
import {subscribe}  from "./subsciption.js"
import { instance } from "../config/razorpay.js";



// Capture the payment and initiate the Razorpay order
export async function createPayment  (req, res)  {
    
    const userId = req.user._id;

    const user = await User.findById(userId);

    if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found"
        })
    }

  let total_amount = 500

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  }

  try {
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options)
    console.log(paymentResponse)
    res.json({
      success: true,
      data: paymentResponse,
    })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." })
  }
}

// verify the payment
export async function verifyPayment (req, res) {
  const razorpay_order_id = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature


  const userId = req.user._id

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {

    return res.status(200).json({ success: true, message: "Payment Verified" })

  }

  return res.status(200).json({ success: false, message: "Payment Failed" })
}
