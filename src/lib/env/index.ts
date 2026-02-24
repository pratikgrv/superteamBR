import { z } from "zod";

const serverSchema = z.object({
	// Database
	DATABASE_URL: z.string(),
	DATABASE_AUTH_TOKEN: z.string().optional(),

	// Auth: GitHub
	GITHUB_CLIENT_ID: z.string().optional(),
	GITHUB_CLIENT_SECRET: z.string().optional(),

	// Auth: Google
	GOOGLE_CLIENT_ID: z.string().optional(),
	GOOGLE_CLIENT_SECRET: z.string().optional(),

	// Node Env
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
});

const clientSchema = z.object({
	// App URL
	NEXT_PUBLIC_APP_URL: z.url(),
});

const _clientEnv = clientSchema.safeParse({
	NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!_clientEnv.success) {
	console.error(
		"❌ Invalid client environment variables:",
		z.treeifyError(_clientEnv.error),
	);
	throw new Error("Invalid client environment variables");
}

let _serverEnvData = {} as z.infer<typeof serverSchema>;

if (typeof window === "undefined") {
	const _serverEnv = serverSchema.safeParse(process.env);
	if (!_serverEnv.success) {
		console.error(
			"❌ Invalid server environment variables:",
			z.treeifyError(_serverEnv.error),
		);
		throw new Error("Invalid server environment variables");
	}
	_serverEnvData = _serverEnv.data;
}

export const env = {
	..._serverEnvData,
	..._clientEnv.data,
};
