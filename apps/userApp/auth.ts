import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcrypt";
import { validate } from "@repo/validate/client";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        number: {
          label: "Phone No",
          type: "text",
          placeholder: "1234567890",
          required: true,
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "**********",
          required: true,
        },
      },
      async authorize(credentials: any) {
        if (!validate(credentials)) return null;
        //OTP validation
        const hash = await bcrypt.hash(credentials?.password, 10);
        const user = await db.user.findFirst({
          where: {
            number: credentials?.number,
          },
        });
        if (user) {
          const passwordValidate = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (passwordValidate) {
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
            };
          }
          return null;
        }
        try {
          const user = await db.user.create({
            data: {
              number: credentials.number,
              password: hash,
              Balances: {
                create: {
                  amount: 0,
                  locked: 0,
                },
              },
            },
            include: {
              Balances: true,
            },
          });

          console.log(`User created: ${user}`);
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.number,
          };
        } catch (error) {
          console.error(`Error in validation: ${error}`);
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ token, session }: any) {
      session.user.id = token.sub;
      return session;
    },
  },
};
