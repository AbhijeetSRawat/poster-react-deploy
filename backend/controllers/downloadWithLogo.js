// controllers/downloadWithLogo.js
import axios from "axios";
import sharp from "sharp";
import { Buffer } from "node:buffer";


export const downloadWithLogo = async (req, res) => {
  try {
    const { imgURL, logoURL } = req.query;

    if (!imgURL) {
      return res.status(400).json({ success: false, message: "imgURL is required" });
    }

    // Download main image
    const mainImgResp = await axios.get(imgURL, { responseType: 'arraybuffer' });
    const mainImgBuffer = Buffer.from(mainImgResp.data);

    let finalImage;

    if (logoURL) {
      const logoResp = await axios.get(logoURL, { responseType: 'arraybuffer' });
      const logoBuffer = Buffer.from(logoResp.data);

     const mainMeta = await sharp(mainImgBuffer).metadata();
        const logoWidth = Math.floor(mainMeta.height * 0.1); // 48px on 800px image ≈ 6%
        const resizedLogo = await sharp(logoBuffer).resize({ width: logoWidth }).toBuffer();

      
      finalImage = await sharp(mainImgBuffer)
        .composite([
          {
            input: resizedLogo,
            top: 20,
            left: 20,
          },
        ])
        .jpeg()
        .toBuffer();
    } else {
      finalImage = await sharp(mainImgBuffer).jpeg().toBuffer();
    }

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Content-Disposition", "attachment; filename=poster.jpg");
    res.send(finalImage);
  } catch (err) {
    console.error("Error generating image:", err);
    res.status(500).json({ success: false, message: "Image processing failed" });
  }
};
