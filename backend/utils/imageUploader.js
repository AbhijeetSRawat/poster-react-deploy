import cloudinary from 'cloudinary';

export const uploadImageToCloudinary = async (file, folder, width = null, height = null) => {
  try {
    const options = {
      folder,
      resource_type: 'image',
    };

    if (width && height) {
      options.width = width;
      options.height = height;
      options.crop = 'scale';
    }

    return await cloudinary.v2.uploader.upload(file.path, options);
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    throw err;
  }
};
