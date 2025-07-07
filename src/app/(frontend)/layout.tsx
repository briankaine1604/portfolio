import { Footer } from "@/components/footer";
import { Navbar } from "@/components/unused/navbar";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navbar />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
