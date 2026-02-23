import type { NextApiRequest, NextApiResponse } from "next";
import removeBackgroundAndUploadFromUrl from "@/lib/removeBackground";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ message: "imageUrl is required in body" });
    }

    const url = await removeBackgroundAndUploadFromUrl(imageUrl);
    return res.status(200).json({ url });
  } catch (err: any) {
    console.error("/api/image error:", err?.message || err);
    return res
      .status(err?.status || 500)
      .json({ message: err?.message || "Internal Server Error" });
  }
}
