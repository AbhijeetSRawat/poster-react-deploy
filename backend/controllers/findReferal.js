import Referal from "../models/referal.js";

export async function findReferal(req, res) {
  try {
    const { referalcode } = req.body;

    const deletionOfReferal = await Referal.findOneAndDelete({ referalCode: referalcode });

    if (!deletionOfReferal) {
      return res.status(404).json({
        success: false,
        message: "Referral not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Referral deleted successfully!",
      data: deletionOfReferal
    });
  } catch (error) {
    console.error("Error deleting referral:", error);
    return res.status(500).json({
      success: false,
      message: "Referral details can't be deleted"
    });
  }
}
