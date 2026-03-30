import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = async (buffer: Buffer) => {
  const base64 = buffer.toString("base64");

  const result = await cloudinary.uploader.upload(
    `data:image/jpeg;base64,${base64}`,
    {
      folder: "profile_images",
    }
  );

  return result.secure_url;
};