import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      theme?: string | null;
      provider?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    theme?: string | null;
    provider?: string | null;
  }
}
