
import{ SidebarTrigger } from "@/components/ui/sidebar";

export const AppHeader = () => {
  return (
    <header className="flex h-14 shrink-0 bg-background items-center gap-2 px-4 border-b"> 
      <SidebarTrigger />
    </header>
  );
};