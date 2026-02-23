import axios from "axios";

export async function removeBackgroundAndUploadFromUrl(
  imageUrl: string,
): Promise<string> {
  if (!imageUrl) throw new Error("imageUrl is required");

  const removeBgKey = process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY;
  if (!removeBgKey) throw new Error("REMOVE_BG API key not configured");

  // 1) Call remove.bg to remove background and get binary PNG
  const removeResp = await axios.post(
    "https://api.remove.bg/v1.0/removebg",
    new URLSearchParams({ image_url: imageUrl, size: "auto" }).toString(),
    {
      headers: {
        "X-Api-Key": removeBgKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      responseType: "arraybuffer",
      validateStatus: (s) => s >= 200 && s < 300,
    },
  );

  const buffer = Buffer.from(removeResp.data, "binary");
  const base64 = buffer.toString("base64");
  const dataUri = `data:image/png;base64,${base64}`;

  // 2) Upload to Cloudinary using unsigned preset (data URI accepted)
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;
  const folder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration missing (name or preset)");
  }

  const cloudUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const params = new URLSearchParams();
  params.append("file", dataUri);
  params.append("upload_preset", uploadPreset);
  if (folder) params.append("folder", folder);

  const uploadResp = await axios.post(cloudUrl, params.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    validateStatus: (s) => s >= 200 && s < 300,
  });

  return uploadResp.data.secure_url as string;
}

export default removeBackgroundAndUploadFromUrl;
