"use client";

import {
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  StarIcon,
  CreditCardIcon,
  LogOutIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter , usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {authClient} from "@/lib/auth-client"

const menuItems = [
  {
    title: "Home",
    items: [
      {
        title: "Workflows",
        icon: FolderOpenIcon,
        url: "/workflows",
      },
      {
        title: "Credentials",
        icon: KeyIcon,
        url: "/credentials",
      },
      {
        title: "Executions",
        icon: HistoryIcon,
        url: "/executions",
      },
    ],
  },
];

export function AppSidebar() {
    const router = useRouter();
    const pathname = usePathname();
  return (
    <Sidebar collapsible="icon">
        <SidebarHeader>
            <SidebarMenuItem>
                <SidebarMenuButton asChild className="gap-x-4 h-10 px-4">
                    <Link prefetch href="/workflows" className="flex items-center gap-x-2">
                    <Image src="/logo.svg" alt="Logo" width={32} height={32} ></Image>
                    <span className="text-lg font-semibold">NodeFrog</span>
                    </Link>

                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.url} prefetch>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={
                            item.url === "/"
                            ?pathname === "/"
                            : pathname.startsWith(item.url)
                        }
                        asChild
                        className="h-10 w-full gap-4 px-4"
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
            <SidebarMenuButton
            tooltip = "Upgrade to Pro"
            className="h-10 w-full gap-4 px-4"
            OnClick={()=>{}}
            >
                <StarIcon className="h-4 w-4" />
                <span>Upgrade to Pro</span>

            </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <SidebarMenuButton
            tooltip = "Billing Portal"
            className="h-10 w-full gap-4 px-4"
            OnClick={()=>{}}
            >
                <CreditCardIcon className="h-4 w-4" />
                <span>Billing Portal</span>

            </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <SidebarMenuButton
            tooltip = "Logout"
            className="h-10 w-full gap-4 px-4"
            OnClick={()=> authClient.signOut({
                fetchOptions: {
                    onSuccess:()=>{
                        router.push("/sign-in")
                    }
                }
            })}
            >
                <LogOutIcon className="h-4 w-4" />
                <span>Logout</span>

            </SidebarMenuButton>
        </SidebarMenuItem>
        </SidebarFooter>
    </Sidebar>
  );
}