"use client";
import { addFriendToCurrentUser } from "@/lib/database/mutation";
import { Button } from "./ui/button";
import { useFormState, useFormStatus } from "react-dom";

export default function AddFriendForm() {
  const { pending } = useFormStatus();
  const initialState = {
    message: null,
    errors: {},
  };

  const [state, formAction] = useFormState(
    addFriendToCurrentUser,
    initialState
  );

  //   console.log(state);

  return (
    <div>
      <form action={formAction}>
        <label htmlFor="friendId">Add Friend by email:</label>
        <input
          name="friendId"
          id="friendId"
          type="email"
          placeholder="Enter Friend's Email Address"
          className="border-2 border-black rounded-md py-2 px-2"
          required
        />
        <div className="my-2" />
        {/* {initialState} */}
        {state?.errors?.email &&
          state?.errors.email.map((msg: string) => (
            <p className="mt-2 text-sm text-red-500 text-center" key={msg}>
              {msg}
            </p>
          ))}
        <Button disabled={pending}>Add Friend</Button>
      </form>
    </div>
  );
}
