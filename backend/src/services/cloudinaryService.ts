import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = async (fileBuffer: Buffer) => {
  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "profiles" }, (error, result) => {
        if (error || !result) {
          return reject(error);
        }
        resolve(result.secure_url);
      })
      .end(fileBuffer);
  });
};