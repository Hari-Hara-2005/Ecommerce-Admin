import {
  BarChart3,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Home,
  Plus,
  FileText,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "./ui/sidebar";
import { Button } from "./ui/button";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    id: "dashboard",
  },
  {
    title: "Products",
    icon: Package,
    id: "products",
  },
  {
    title: "Category",
    icon: Package,
    id: "category",
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    id: "orders",
  },
  {
    title: "Customers",
    icon: Users,
    id: "customers",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    id: "analytics",
  },
  {
    title: "Reports",
    icon: FileText,
    id: "reports",
  },
  {
    title: "Settings",
    icon: Settings,
    id: "settings",
  },
];

export function AdminSidebar({ activeSection, setActiveSection }) {
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="h-4 w-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Admin Panel</span>
            <span className="truncate text-xs text-muted-foreground">
              E-commerce Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeSection === item.id}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Quick Add
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
