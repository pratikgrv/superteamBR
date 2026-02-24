"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { authClient } from "@/lib/auth/client";
import { useWalletSignIn } from "@/hooks/useWalletSignIn";
import { ThemeToggle } from "./ThemeToggle";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Account {
	id: string;
	userId: string;
	providerId: string; // "google" | "github" | "siwx"
	accountId: string; // siwx format: "solana:mainnet:ADDRESS"
}

interface AccountSectionProps {
	accounts: Account[]; // server-fetched, passed as props — no useEffect needed
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseWalletAddress(accountId: string): string | null {
	const parts = accountId.split(":");
	return parts.length === 3 ? parts[2] : null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SocialRow({
	provider,
	isLinked,
	onLink,
}: {
	provider: "google" | "github";
	isLinked: boolean;
	onLink: () => void;
}) {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				padding: "8px 0",
				borderBottom: "1px solid #eee",
			}}
		>
			<span style={{ fontFamily: "monospace", fontSize: 13 }}>{provider}</span>
			{isLinked ?
				<span style={{ fontSize: 12, color: "green" }}>● connected</span>
			:	<button type="button" onClick={onLink} style={{ fontSize: 12 }}>
					connect
				</button>
			}
		</div>
	);
}

function WalletRow({
	address,
	isLinked,
	onLink,
	loading,
}: {
	address: string;
	isLinked: boolean;
	onLink: () => void;
	loading?: boolean;
}) {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				padding: "8px 0",
				borderBottom: "1px solid #eee",
			}}
		>
			<span style={{ fontFamily: "monospace", fontSize: 12 }}>
				{address.slice(0, 6)}...{address.slice(-4)}
			</span>
			{isLinked ?
				<span style={{ fontSize: 12, color: "green" }}>● connected</span>
			:	<button
					type="button"
					onClick={onLink}
					disabled={loading}
					style={{ fontSize: 12 }}
				>
					{loading ? "signing..." : "link"}
				</button>
			}
		</div>
	);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function AccountSection({ accounts }: AccountSectionProps) {
	const { publicKey } = useWallet();
	const { signInWithWallet, isLoading } = useWalletSignIn();

	// Derive everything from props — pure computation, no side effects
	const isGoogleLinked = accounts.some((a) => a.providerId === "google");
	const isGithubLinked = accounts.some((a) => a.providerId === "github");
	const linkedWalletAddresses = accounts
		.filter((a) => a.providerId === "siwx")
		.map((a) => parseWalletAddress(a.accountId))
		.filter((addr): addr is string => addr !== null);

	const hasLinkedWallet = linkedWalletAddresses.length > 0;
	const currentAddress = publicKey?.toBase58() ?? null;
	const isCurrentWalletLinked =
		!!currentAddress && linkedWalletAddresses.includes(currentAddress);

	const handleLinkSocial = (provider: "google" | "github") =>
		authClient.linkSocial({ provider });

	return (
		<div style={{ fontFamily: "sans-serif", maxWidth: 360 }}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: 20,
				}}
			>
				<h2 style={{ fontSize: 18, margin: 0 }}>Account Settings</h2>
				<ThemeToggle />
			</div>

			{/* Social */}
			<section>
				<p
					style={{
						fontSize: 11,
						textTransform: "uppercase",
						color: "#888",
						marginBottom: 4,
					}}
				>
					Social
				</p>
				<SocialRow
					provider="google"
					isLinked={isGoogleLinked}
					onLink={() => handleLinkSocial("google")}
				/>
				<SocialRow
					provider="github"
					isLinked={isGithubLinked}
					onLink={() => handleLinkSocial("github")}
				/>
			</section>

			{/* Wallet */}
			<section style={{ marginTop: 20 }}>
				<p
					style={{
						fontSize: 11,
						textTransform: "uppercase",
						color: "#888",
						marginBottom: 4,
					}}
				>
					Wallet
				</p>

				{hasLinkedWallet ?
					// Already has a linked wallet — show it, no option to add another
					<WalletRow
						address={linkedWalletAddresses[0]}
						isLinked={true}
						onLink={() => {}}
					/>
				: currentAddress ?
					// Browser wallet connected but not linked yet — show link button
					<WalletRow
						address={currentAddress}
						isLinked={isCurrentWalletLinked}
						onLink={signInWithWallet}
						loading={isLoading}
					/>
					// No wallet connected — open wallet picker
				:	<WalletMultiButton />}
			</section>
		</div>
	);
}
