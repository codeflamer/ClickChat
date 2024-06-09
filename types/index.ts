import * as z from "zod";

export const AddFriendSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Invalid Email",
    })
    .email(),
});
