"use client";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const isMediumScreen = useMediaQuery({ maxWidth: 1024 });

  useEffect(() => {
    setIsCollapsed(isMediumScreen);
  }, [isMediumScreen]);

  // Navigation items
  const navItems = [
    { href: "/admin", icon: "📊", label: "Dashboard" },
    { href: "/admin/blog", icon: "✍️", label: "Blog" },
    { href: "/admin/projects", icon: "🛠️", label: "Projects" },
    { href: "/admin/settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <aside
      className={`bg-black text-white border-r-4 border-black h-screen sticky top-0 transition-all ${
        isCollapsed ? "w-18 " : "w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div className="border-b-4 border-black relative w-full p-4">
        <div className="flex items-center justify-between ">
          {!isCollapsed && (
            <Link
              href={"/admin"}
              className="font-mono font-black text-xl tracking-wider"
            >
              ADMIN
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "bg-lime-400 text-black border-2 border-white hover:bg-lime-300 p-2 ",
              isCollapsed && " mx-auto"
            )}
          >
            {isCollapsed ? "→ " : "←"}
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 font-mono border-2 ${
              isCollapsed ? "p-2 justify-center" : "p-3" // Less padding when collapsed
            } ${
              pathname === item.href
                ? "bg-lime-400 text-black border-black"
                : "border-transparent hover:border-lime-400 hover:bg-gray-900"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t-4 border-black">
        <div className="flex justify-center">
          <Link
            href="/"
            className="w-fit px-2 py-1 text-lime-400 border-2 border-black"
          >
            <Home />
          </Link>
        </div>
      </div>
    </aside>
  );
};
