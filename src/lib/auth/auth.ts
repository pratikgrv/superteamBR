import { env } from "@/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import { admin } from "better-auth/plugins";
import { siws } from "./siws/server";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg", // Postgres provider for Supabase integration
	}),
	socialProviders: {
		github: {
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		},
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
	},
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	plugins: [
		admin(),
		siws({
			domain: env.BETTER_AUTH_URL ? new URL(env.BETTER_AUTH_URL).hostname : "localhost",
		}),
	],
});
