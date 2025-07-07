import { ReactNode } from "react";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata = {
  title: "Brian Kaine – Fullstack Dev",
  description: "I build fluid, fast, and fearless experiences.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body">
        <TRPCReactProvider>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <div>
            <NuqsAdapter>{children}</NuqsAdapter>
          </div>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
