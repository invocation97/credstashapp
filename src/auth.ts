import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { db } from "./lib/db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
      roleId: string;
      didFinishOnboarding: boolean;
      organizationId: string | null;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "database",
  },
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          roleId: profile.roleId ?? "bd94783b-cbdc-48ab-a730-ff1e28946468",
          didFinishOnboarding: profile.didFinishOnboarding ?? false,
          organizationId: profile.organizationId ?? null,
        };
      },
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      server: {
        host: process.env.RESEND_SERVER_HOST,
        port: parseInt(process.env.RESEND_SERVER_PORT!, 10),
        auth: {
          user: process.env.RESEND_EMAIL_SENDER,
          pass: process.env.RESEND_API_KEY,
        },
      },
      from: process.env.RESEND_EMAIL_SENDER,
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
    verifyRequest: "/auth/verify-request",
    newUser: "/onboarding",
  },
  callbacks: {
    async session({ session, user }) {
      session.user = {
        ...session.user,
      };

      return session;
    },
  },
});
