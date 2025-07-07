// app/admin/layout.tsx
import { Sidebar } from "@/modules/admin/ui/components/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-[auto_1fr] min-h-screen">
      <Sidebar />
      <main className="overflow-auto p-8 bg-gray-100">{children}</main>
    </div>
  );
};

export default Layout;
