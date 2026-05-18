import { BarChart3, Target, ClipboardCheck, UserCircle } from "lucide-react";

export const employeeNavItems = [
  { label: "Dashboard",          icon: BarChart3,      path: "/employee-dashboard" },
  { label: "My Goal Sheet",      icon: Target,         path: "/employee/goals" },
  { label: "Quarterly Check-ins",icon: ClipboardCheck, path: "/employee/checkins" },
//   { label: "My Progress",        icon: BarChart3,      path: "/employee/progress" },
//   { label: "My Profile",         icon: UserCircle,     path: "/employee/profile" },
];