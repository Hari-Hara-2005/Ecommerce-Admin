import { useState } from "react";
import {
  Home,
  Inbox,
  Calendar,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ProfileDetail from "./ProfileDetail";

function NavItem({ icon, label, isCollapsed, isSelected, onClick }) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-4 px-4",
        isCollapsed && "justify-center px-2",
        isSelected && "bg-primary text-primary-foreground" // Highlight the selected item
      )}
      onClick={onClick}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </Button>
  );
}

function Sidebar({ isCollapsed, setIsCollapsed }) {
  const [selectedItem, setSelectedItem] = useState("Home"); // Track the selected item

  const handleItemClick = (item) => {
    setSelectedItem(item); // Set the selected item
  };

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col border-r bg-card px-2 py-4 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-2">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold">Aerospace & Defence</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      <Separator className="my-4" />
      <nav className="flex flex-1 flex-col gap-2">
        <NavItem
          icon={<Home size={20} />}
          label="Home"
          isCollapsed={isCollapsed}
          isSelected={selectedItem === "Home"}
          onClick={() => handleItemClick("Home")}
        />
        <NavItem
          icon={<Inbox size={20} />}
          label="Inbox"
          isCollapsed={isCollapsed}
          isSelected={selectedItem === "Inbox"}
          onClick={() => handleItemClick("Inbox")}
        />
        <NavItem
          icon={<Calendar size={20} />}
          label="Calendar"
          isCollapsed={isCollapsed}
          isSelected={selectedItem === "Calendar"}
          onClick={() => handleItemClick("Calendar")}
        />
        <NavItem
          icon={<Search size={20} />}
          label="Search"
          isCollapsed={isCollapsed}
          isSelected={selectedItem === "Search"}
          onClick={() => handleItemClick("Search")}
        />
        <NavItem
          icon={<Settings size={20} />}
          label="Settings"
          isCollapsed={isCollapsed}
          isSelected={selectedItem === "Settings"}
          onClick={() => handleItemClick("Settings")}
        />
      </nav>
    </div>
  );
}

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <Sidebar isCollapsed={false} setIsCollapsed={() => {}} />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4"
        >
          <ChevronLeft />
        </Button>
      </SheetContent>
    </Sheet>
  );
}

function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background ">
      <div className="hidden md:block">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center border-b px-4">
          <MobileNav />
          <h1 className="ml-4 text-xl font-semibold">Dashboard</h1>
          <ProfileDetail />
        </header>
      </div>
    </div>
  );
}

export default Navbar;
