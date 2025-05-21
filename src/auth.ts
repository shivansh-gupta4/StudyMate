import NextAuth, { User, Account, Profile } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prismaClient from "@/app/lib/db"; // Assuming you have Prisma set up

// Define custom types
declare module "next-auth" {
  interface Session {
    callbackUrl?: string;
    user: {
      id?: string;
      email: string;
      name?: string | null;
      courseFilled?: boolean;
      courseName?: string | null;
    };
  }

  interface JWT {
    id?: string;
    email: string;
    name?: string | null;
    courseFilled?: boolean;
    courseName?: string | null;
  }
}

enum Provider {
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
  CREDENTIALS = 'CREDENTIALS',
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async(credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const user = await prismaClient.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("Error in credentials authorization:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/auth/login",
    error: "/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account) {
        console.error("Account is null, sign-in failed");
        return false;
      }
    
      if (account.provider === "credentials") {
        try {
          if (!user.email) {
            console.error("Email is missing");
            return false;
          }

          const existingUser = await prismaClient.user.findUnique({
            where: { 
              email: user.email 
            },
          });

          if (!existingUser) {
            console.error("No user found with this email");
            return false;
          }

          if (existingUser.registered) {
            if (existingUser.CourseFilled) {
              return true;
            } else {
              return `/learning_choice/${existingUser.id}`;
            }
          } else {
            return `/auth/register?id=${existingUser.id}`;
          }
        } catch (error) {
          console.error("Error during credentials sign-in:", error);
          return false;
        }
      }

      try {
        if (!user.email || !account.provider) {
          console.error("Email or provider is missing");
          return false;
        }
    
        let providerEnumValue: Provider;
        switch (account.provider.toLowerCase()) {
          case 'google':
            providerEnumValue = Provider.GOOGLE;
            break;
          case 'github':
            providerEnumValue = Provider.GITHUB;
            break;
          default:
            console.error("Unsupported provider:", account.provider);
            return false;
        }

        const existingUser = await prismaClient.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser?.registered) {
          console.log(existingUser.registered ? "User is registered" : "User is not registered");
          
          if (existingUser.CourseFilled) {
            return true;
          } else {
            return `/learning_choice/${existingUser.id}`;
          }
        } else if (existingUser && !existingUser.registered) {
          return `/auth/register?id=${existingUser.id}`;
        } else {
          const newUser = await prismaClient.user.create({
            data: {
              email: user.email,
              name: user.name || profile?.name || '',
              provider: providerEnumValue,
              password: '',
              registered: false,
            },
          });
          return `/auth/register?id=${newUser.id}`;
        }
      } catch (error) {
        console.error("Error during social sign-in:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        try {
          const existingUser = await prismaClient.user.findUnique({
            where: { email: user.email || '' },
            include: {
              studyPlan: true
            }
          });

          if (existingUser) {
            token.id = user.id;
            token.email = user.email || '';
            token.name = user.name || '';
            token.courseFilled = existingUser.CourseFilled;
            token.courseName = existingUser.studyPlan?.planName || null;
          }
        } catch (error) {
          console.error("Error in JWT callback:", error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        try {
          if (session.user) {
            session.user.id = token.id as string | undefined;
            session.user.email = token.email as string;
            session.user.name = token.name as string | null;
            session.user.courseFilled = token.courseFilled as boolean | undefined;
            session.user.courseName = token.courseName as string | null;
          } else {
            session.user = {
              id: token.id as string | undefined,
              email: token.email as string,
              name: token.name as string | null,
              courseFilled: token.courseFilled as boolean | undefined,
              courseName: token.courseName as string | null,
            };
          }

          const existingUser = await prismaClient.user.findUnique({
            where: { email: token.email as string },
          });

          if (existingUser?.CourseFilled) {
            session.callbackUrl = '/dashboard/calendar';
          }
        } catch (error) {
          console.error("Error in session callback:", error);
        }
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
