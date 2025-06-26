import Referal from "../models/referal.js";

export async function createReferal(req, res) {
  try {
    const { referalcode } = req.body;

    const referal = await Referal.create({ referalCode: referalcode });

    if (!referal) {
      return res.status(400).json({
        success: false,
        message: "Referral could not be created"
      });
    }

    return res.status(201).json({
      success: true,
      message: "Referral created successfully",
      data: referal
    });
  } catch (error) {
    console.error("❌ Error creating referral:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}
