import { BarChart3, ClipboardList, Share2, MessageSquareText, Users } from "lucide-react";

export const managerNavItems = [
  { label: "Dashboard",          icon: BarChart3,         path: "/manager-dashboard" },
  { label: "Goal Approvals",     icon: ClipboardList,     path: "/manager/approvals" },
  { label: "Shared Goals",       icon: Share2,            path: "/manager/shared-goals" },
  { label: "Quarterly Check-ins",icon: MessageSquareText, path: "/manager/checkins" },
  { label: "Team Analytics",     icon: BarChart3,         path: "/manager/analytics" },
];