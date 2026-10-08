// src/lib/auth.js
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt, bearer } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME);

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.BETTER_AUTH_URL],

  emailAndPassword: { enabled: true },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "user", input: true },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // nobody can self-register as admin
          const role = user.role === "lawyer" ? "lawyer" : "user";
          return { data: { ...user, role } };
        },
      },
        update: {
      before: async (data) => {
        // clients may only switch between user and lawyer, never become admin
        if (data.role && !["user", "lawyer"].includes(data.role)) {
          const { role, ...rest } = data;
          return { data: rest };
        }
        return { data };
      },
    },
    },
  },

  // JWT for your Express API (requirement #5)
  plugins: [jwt(), bearer()],
});