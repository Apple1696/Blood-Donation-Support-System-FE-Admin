"use client"

import * as React from "react"
import { Link } from "react-router-dom"
import {
  CameraIcon,
  Newspaper,
  Warehouse,
  Cross,
  FileCodeIcon,
  FileTextIcon,
  FlagTriangleRight,
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
import { StaffNavUser } from "./staff-nav-user"

const data = {
  navMain: [
    {
      title: "Blood Unit Update",
      url: "/staff",
      icon: FlagTriangleRight,
    },
    {
      title: "Donations",
      url: "/staff/donation",
      icon: Cross,
    },
    {
      title: "Blood Unit Management",
      url: "/staff/bloodunitmanagement",
      icon: UsersIcon,
    },
    {
      title: "Blood Unit History",
      url: "/staff/bloodunithistory",
      icon: Warehouse,
    },
    {
      title: "Blog List",
      url: "/staff/bloglist",
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

export function StaffAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <StaffNavUser />
      </SidebarFooter>
    </Sidebar>
  )
}