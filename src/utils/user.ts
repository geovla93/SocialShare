import { signIn } from "next-auth/react";

import client from "@/lib/genql";

export const registerUser = async (
  user: {
    name: string;
    email: string;
    password: string;
    username: string;
    bio: string;
  },
  profilePicUrl?: string
) => {
  await client.mutation({ signUp: [{ user, image: profilePicUrl }, {}] });
};

export const loginUser = async (user: { email: string; password: string }) => {
  const res = await signIn<"credentials">("credentials", {
    redirect: false,
    email: user.email,
    password: user.password,
  });

  return res;
};
