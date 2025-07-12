import { useState } from "react";
import { AdminSidebar } from "./components/AdminSidebar";
import { DashboardOverview } from "./components/DashboardOverview";
import { ProductManagement } from "./components/ProductManagement";
import { SidebarProvider } from "./components/ui/sidebar";
import { CategoryMangement } from "./components/CategoryMangement";
import { BannerManagement } from "./components/BannerManagement";

export default function App() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />;
      case "products":
        return <ProductManagement />;
      case "category":
        return <CategoryMangement />;
      case "banner":
        return <BannerManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <main className="flex-1 p-6 bg-gray-50">{renderContent()}</main>
      </div>
    </SidebarProvider>
  );
}
