"use client";

import { createContext, useContext, ReactNode } from "react";
import { authClient } from "@/lib/auth/client";

type Session = typeof authClient.$Infer.Session.session;
type User = typeof authClient.$Infer.Session.user;

interface AuthContextType {
	session: Session | null;
	user: User | null;
	isPending: boolean;
}

const AuthContext = createContext<AuthContextType>({
	session: null,
	user: null,
	isPending: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
	const { data, isPending } = authClient.useSession();

	return (
		<AuthContext.Provider
			value={{
				session: data?.session ?? null,
				user: data?.user ?? null,
				isPending,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
