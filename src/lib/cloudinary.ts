import axios from "axios";

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/raw/upload`;

export const uploadToCloudinary = async (
  file: File,
  onProgress?: (progress: number) => void,
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

  const res = await axios.post(CLOUDINARY_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (e.total && onProgress) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });

  return res.data.secure_url;
};

/**
 * Ensure Cloudinary URL uses HTTPS to avoid mixed-content issues when site is served over HTTPS.
 */
export function ensureCloudinaryHttps(url?: string | null) {
  if (!url) return url || "";
  // If the URL already has https, return as-is. If it's protocol-relative or http, force https.
  return url.replace(/^http:\/\//i, "https://").replace(/^:\/\//, "https://");
}

export default uploadToCloudinary;
