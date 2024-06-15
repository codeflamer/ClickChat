"use client";
import { addFriendSafely } from "@/lib/database/mutation";
import { Button } from "./ui/button";
import { useFormState, useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { AddFriendSchema } from "@/types";
import * as z from "zod";
import { useAction } from "next-safe-action/hooks";
import { useToast } from "./ui/use-toast";

export default function AddFriendForm() {
  const { toast } = useToast();

  const myform = useForm<z.infer<typeof AddFriendSchema>>({
    resolver: zodResolver(AddFriendSchema),
    defaultValues: {
      email: "",
    },
  });

  const { execute, result, status } = useAction(addFriendSafely, {
    onSuccess: (data) => {
      if (data?.success) {
        toast({
          variant: "default",
          title: "Success",
          description: data?.success,
        });
      }
      if (data?.error) {
        toast({
          variant: "destructive",
          title: "An error has occured",
          description: data?.error,
        });
      }
      myform.reset();
    },
    onError: (err) => {
      if (err.serverError) {
        console.log(err.serverError);
        toast({
          variant: "destructive",
          title: "An error has occured",
          description: err.serverError,
        });
      }
      if (err.validationErrors) {
        console.log(err.validationErrors);
        // toast({
        //   variant: "destructive",
        //   title: "An error has occured",
        //   description: err.serverError,
        // });
      }
      if (err.fetchError) {
        console.log(err.fetchError);
        toast({
          variant: "destructive",
          title: "An error has occured",
          description: err.fetchError,
        });
      }
    },
  });

  const onSubmit = (values: z.infer<typeof AddFriendSchema>) => {
    execute(values);
    console.log("clicking");
  };

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
