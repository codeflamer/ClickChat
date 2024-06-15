"use server";
import { v2 as cloudinary } from "cloudinary";
import { createMessageImage } from "../database/mutation";

export const getSignatureServer = async () => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    process.env.CLOUD_API_SECRET!,
  );

  return { success: { timestamp, signature } };
};

type PhotoData = {
  public_id: string;
  version: string;
  signature: string;
  url: string;
};

export const uploadPhotoContentDB = async (
  photoData: PhotoData,
  content: string,
  recepientId: string,
  privateChatId: string,
) => {
  const expectedSignature = cloudinary.utils.api_sign_request(
    { public_id: photoData.public_id, version: photoData.version },
    process.env.CLOUD_API_SECRET!,
  );

  if (expectedSignature === photoData.signature) {
    await createMessageImage(
      photoData.url,
      recepientId,
      content,
      privateChatId,
    );
    console.log("Success");
  }
};
