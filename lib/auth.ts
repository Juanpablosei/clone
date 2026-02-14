import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { CredentialsSignin } from "next-auth";
import { prismaAuth } from "./prisma-auth";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true, // Necesario en Vercel/serverless para evitar bucles de redirect
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prismaAuth.user.findUnique({
            where: {
              email: credentials.email as string,
            },
          });

          if (!user) {
            return null;
          }

          if ("active" in user && user.active === false) {
            throw new CredentialsSignin("Tu cuenta está desactivada. Contacta al administrador.");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (err) {
          if (err instanceof CredentialsSignin) throw err;
          console.error("[auth] authorize error:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Si la URL es relativa, redirigir a /admin
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Si la URL es del mismo origen, permitirla
      if (new URL(url).origin === baseUrl) return url;
      // Por defecto, redirigir a /admin
      return `${baseUrl}/admin`;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});

