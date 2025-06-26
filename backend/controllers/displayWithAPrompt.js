import express from "express";
import dotenv from "dotenv";
import axios from "axios"; // Use import instead of require

dotenv.config();

export async function generateWithPrompt(req, res) {
    try {
        const options = {
            method: "POST",
            url: "https://api.edenai.run/v2/image/generation",
            headers: {
                authorization: `Bearer ${process.env.EDENAI_API_KEY}`, // Store your API key in .env
            },
            data: {
                providers: "openai",
                text: "a red flying balloon.",
                resolution: "512x512",
            },
        };

        const response = await axios.request(options);
        console.log(response.data);

        return res.status(200).json({
            success: true,
            message: "Images generated successfully",
            data: response.data,
        });

    } catch (error) {
        console.error(error); // Log the actual error for debugging

        return res.status(500).json({
            success: false,
            message: "Cannot generate images by prompt",
        });
    }
};
