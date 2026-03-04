export const dynamic = "force-static";

import type { Metadata } from "next";
import type { Viewport } from "next";

export const metadata: Metadata = {
  title: "Sanity Studio",
  description: "A Sanity Studio for this project",
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
