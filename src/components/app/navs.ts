import {
  Home, Route as RouteIcon, BookOpen, FileText, MessagesSquare, Sparkles,
  ClipboardList, FolderOpen, BarChart3, User, Users, Settings, Layers, GraduationCap,
} from "lucide-react";
import type { NavItem } from "./AppShell";

export const STUDENT_NAV: NavItem[] = [
  { to: "/student/dashboard", label: "Bosh sahifa", icon: Home },
  { to: "/student/yol", label: "O‘quv yo‘li", icon: RouteIcon },
  { to: "/student/soz", label: "SO‘Z", icon: BookOpen, dot: "bg-soz" },
  { to: "/student/matn", label: "MATN", icon: FileText, dot: "bg-matn" },
  { to: "/student/munozara", label: "MUNOZARA", icon: MessagesSquare, dot: "bg-munozara" },
  { to: "/student/oyna", label: "OYNA", icon: Sparkles, dot: "bg-oyna" },
  { to: "/student/topshiriqlar", label: "Topshiriqlar", icon: ClipboardList },
  { to: "/student/portfolio", label: "Portfolio", icon: FolderOpen },
  { to: "/student/natijalar", label: "Natijalar", icon: BarChart3 },
  { to: "/profil", label: "Profil", icon: User },
];

export const TEACHER_NAV: NavItem[] = [
  { to: "/teacher/dashboard", label: "Bosh sahifa", icon: Home },
  { to: "/teacher/kontent", label: "Kontent", icon: Settings },
  { to: "/profil", label: "Profil", icon: User },
];

export const ADMIN_NAV: NavItem[] = [
  { to: "/admin/dashboard", label: "Bosh sahifa", icon: Home },
  { to: "/admin/foydalanuvchilar", label: "Foydalanuvchilar", icon: Users },
  { to: "/teacher/dashboard", label: "O‘qituvchi paneli", icon: GraduationCap },
  { to: "/student/dashboard", label: "Talaba paneli", icon: Layers },
  { to: "/profil", label: "Profil", icon: User },
];
