"use client";
import { addFriendSafely } from "@/lib/database/mutation";
import { Button } from "./ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { AddFriendSchema } from "@/types";
import * as z from "zod";
import { useAction } from "next-safe-action/hooks";

export default function AddFriendForm() {
  const myform = useForm<z.infer<typeof AddFriendSchema>>({
    resolver: zodResolver(AddFriendSchema),
    defaultValues: {
      email: "",
    },
  });

  const { execute, result, status } = useAction(addFriendSafely, {
    onSuccess: (data) => {
      if (data?.success) console.log(data.success);
      if (data?.error) console.log(data.error);
    },
    onError: (err) => {
      if (err.serverError) {
        console.log(err.serverError);
      }
      if (err.validationErrors) {
        console.log(err.validationErrors);
      }
      if (err.fetchError) {
        console.log(err.fetchError);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof AddFriendSchema>) => {
    execute(values);
  };

  //   console.log(state);

  return (
    <div>
      {/* <form action={formAction}> */}
      <form onSubmit={myform.handleSubmit(onSubmit)}>
        <label htmlFor="email">Friend-Email:</label>
        <input
          id="email"
          type="email"
          placeholder="Enter Friend's Email Address"
          className="rounded-md border-2 border-black px-2 py-2"
          {...myform.register("email")}
          // required
        />
        <div className="my-2" />
        {/* {initialState} */}
        {/* {state?.errors?.email &&
          state?.errors.email.map((msg: string) => (
            <p className="mt-2 text-center text-sm text-red-500" key={msg}>
              {msg}
            </p>
          ))} */}
        <Button disabled={status === "executing"} type="submit">
          Send Request
        </Button>
      </form>
    </div>
  );
}
