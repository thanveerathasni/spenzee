import {
  LayoutDashboard,
  Users,
  CreditCard,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

/**
 *  ADMIN SECTIONS
 */
export type AdminSection =
  | "dashboard"
  | "users"
  | "finance"
  | "security"
  | "analytics";

/**
 * Sidebar item shape
 */
export interface SidebarItemConfig {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number }>;
}

/**
 *  SIDEBAR CONFIG (SECTION → ITEMS)
 */
export const sidebarConfig: Record<AdminSection, SidebarItemConfig[]> = {
  dashboard: [
    {
      label: "Overview",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
  ],

  users: [
    {
      label: "Customers",
      path: "/admin/users",
      icon: Users,
    },
  ],

  finance: [
    {
      label: "Transactions",
      path: "/admin/transactions",
      icon: CreditCard,
    },
  ],

  security: [
    {
      label: "Security",
      path: "/admin/security",
      icon: ShieldCheck,
    },
  ],

  analytics: [
    {
      label: "Analytics",
      path: "/admin/analytics",
      icon: BarChart3,
    },
  ],
};
