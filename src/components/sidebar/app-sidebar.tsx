"use client"

import * as React from "react"
import { Link } from "react-router-dom"
import {
  CameraIcon,
  Newspaper,
  Warehouse,
  Cross,
  FlagTriangleRight,
  FileCodeIcon,
  FileTextIcon,
  Hospital,
  UsersIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Assuming NavUser is a component you have defined elsewhere
import { NavUser } from "@/components/sidebar/nav-user"

const data = {
  navMain: [
    {
      title: "Emergency Requests",
      url: "/",
      icon: Hospital,
    },
    {
      title: "Donations",
      url: "/donation",
      icon: Cross,
    },
    {
      title: "Campaign",
      url: "/campaign",
      icon: FlagTriangleRight ,
    },
    {
      title: "Donors Register",
      url: "#",
      icon: UsersIcon,
    },
    {
      title: "Recipient Register",
      url: "#",
      icon: UsersIcon,
    },
    {
      title: "Blood Stock",
      url: "/bloodstock",
      icon: Warehouse,
    },
    {
      title: "Blog List",
      url: "#",
      icon: Newspaper,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "/capture",
      items: [
        {
          title: "Active Proposals",
          url: "/capture/active-proposals",
        },
        {
          title: "Archived",
          url: "/capture/archived",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "/proposal",
      items: [
        {
          title: "Active Proposals",
          url: "/proposal/active-proposals",
        },
        {
          title: "Archived",
          url: "/proposal/archived",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "/prompts",
      items: [
        {
          title: "Active Proposals",
          url: "/prompts/active-proposals",
        },
        {
          title: "Archived",
          url: "/prompts/archived",
        },
      ],
    },
  ],
}

// New NavMain component to handle navigation
function NavMain({ items }: { items: typeof data.navMain }) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild tooltip={item.title}>
            <Link to={item.url} className="flex items-center gap-2">
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/" className="flex items-center space-x-2">
                <Cross className="h-5 w-5 text-red-500" />
                <span className="text-base font-semibold">BloodLink</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}