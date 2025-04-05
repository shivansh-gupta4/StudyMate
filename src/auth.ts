import NextAuth, { User, Account, Profile } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prismaClient from "@/app/lib/db"; // Assuming you have Prisma set up


declare module "next-auth" {
  interface Session {
    callbackUrl?: string; // Add the callbackUrl property
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
      authorize: async(credentials)=>{

        console.log("Authorizing with credentials:", credentials);
        
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Here you can implement your logic for user validation, for example:
        // 1. Query the database to check if the user exists
        const user = await prismaClient.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // 3. Return the user if validation is successful
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt', // Use JWT for session management
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7, // 7 days (in seconds)
  },
  pages: {
    signIn: "/auth/login", // Custom sign-in page
    error: "/error",       // Custom error page
  },
  callbacks: {
    async signIn({ user, account, profile}) {
      if (!account) {
        console.error("Account is null, sign-in failed");
        return false; // Prevent sign-in if account is null
      }
    
      // Check if the provider is "credentials"
      if (account.provider === "credentials") {
        // Automatically allow the sign-in by returning true
        return true;
      }
      try {
        // Ensure the email is defined and not null
        const userEmail = user.email ?? undefined;
        const provider= account?.provider;

        console.log(userEmail);
        console.log(provider);
        
    
        if (!userEmail || !provider) {
          console.error("Email is missing or invalid.");
          return false;
        }
    
        let providerEnumValue: Provider;

        switch (provider.toLowerCase()) {
          case 'google':
            providerEnumValue = Provider.GOOGLE;
            break;
          case 'github':
            providerEnumValue = Provider.GITHUB;
            break;
          default:
            console.error("Unsupported provider:", provider);
            return false;
        }

        // Check if the user exists in the database
        const existingUser = await prismaClient.user.findUnique({
          where: {
            email: userEmail, // Safe to use as `string | undefined`
          },
        });
    
        console.log("Existing user found:", !!existingUser);
        console.log(existingUser);

        if(existingUser?.registered)
        console.log(existingUser.registered ? "User is registered" : "User is not registered");

        // Handle based on formType
        if (existingUser) {
          console.log("user exists");

          if (existingUser.registered) {
            if(existingUser.CourseFilled)
          return true;
        else
        return `/learning_choice/${existingUser.id}`;
          } else {
            console.log("not registered");
            return `/auth/register?id=${existingUser.id}`;
          }
        } 
        else 
        {
          console.log("user does not exist");
          await prismaClient.user.create({
            data: {
              email: userEmail,
              name: user.name || profile?.name || '',
              provider: providerEnumValue,
              password: '',
              registered: false,
            },
          });

            const existingUser = await prismaClient.user.findUnique({
            where: {
              email: userEmail, // Safe to use as `string | undefined`
            },
          });

          if(existingUser){
            const userId = existingUser.id;
          return `/auth/register?id=${existingUser.id}`;
        }

          return false;
        }
        
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false; // Reject login on error
      }
    },
    async jwt({ token, user, account }) {

  console.log("JWT Callback");
  console.log("Token:", token);
  console.log("User:", user);
  console.log("Account:", account);
      // This callback will handle token creation
      if (user) {
        // Store necessary information in the JWT token
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      // This callback ensures the session is populated with token data
      if (session.user) {
        
        session.user.email = token.email as string;
        session.user.name = token.name as string;
       
      } else {
        // Initialize session.user if it doesn't exist
        session.user = {
          
          email: token.email as string,
          name: token.name as string,
        
        };
      }
      const existingUser = await prismaClient.user.findUnique({
        where: {
          email: token.email as string, // Safe to use as `string | undefined`
        },
      });

      if(existingUser){
      if (existingUser.CourseFilled) {
        session.callbackUrl = '/learning_choice';
      } else {
        session.callbackUrl = '/dashboard/calendar';
      }
    }
  
      return session;
    },
  },
};

export default NextAuth(authOptions);
