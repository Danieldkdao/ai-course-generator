import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import type { ReactNode } from "react";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full flex h-screen">
      <Sidebar />
      <div className="flex-1 flex-col">
        <Navbar />
        <div className="flex-1 p-5">{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
