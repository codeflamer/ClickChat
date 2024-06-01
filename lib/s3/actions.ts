"use server";

import { auth } from "../auth/auth";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as SignedURL } from "@aws-sdk/s3-request-presigner";
import { generateFileName } from "../utils";
import { createMessageImage } from "../database/mutation";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const acceptedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const maxFileSize = 1024 * 1024 * 10;

export async function getSignedUrl(
  type: string,
  size: number,
  checkSum: string,
  recipientId: string
) {
  const session = await auth();
  if (!session) {
    return { failure: "Not authenticated" };
  }
  if (!acceptedTypes.includes(type)) {
    return { failure: "invalid file type" };
  }
  if (size > maxFileSize) {
    return { failure: "File size too large" };
  }

  // console.log(fileName);
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: generateFileName(),
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checkSum,
    Metadata: {
      userId: session.user!.id!,
    },
  });
  const signedURL = await SignedURL(s3, putObjectCommand, { expiresIn: 60 });
  const response = await createMessageImage(
    signedURL.split("?")[0],
    session.user!.id!,
    recipientId
  );
  if (!response) {
    return { failure: "Something went wrong" };
  }
  const imageMessageId = response.imageMessage.id;
  const messageId = response.message.id;
  //generate signedURl here

  //create media here initially wihout a messageUrl
  return { success: { url: signedURL, imageMessageId, messageId } };
}
