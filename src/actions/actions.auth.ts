"use server";

import { signOut } from "@/auth";

type SignUserOut = {
  redirectTo?: string;
};

export const signUserOut = async () => {
  await signOut({
    redirectTo: "/auth/sign-in",
  });
};
