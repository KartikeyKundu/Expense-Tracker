import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import type { NextAuthOptions } from "next-auth"

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.provider = account.provider;
        token.id = account.providerAccountId;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.provider = token.provider as string;
      session.user.id = token.id as string;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}

export default authOptions;