import {
  Home,
  Route as RouteIcon,
  BookOpen,
  FileText,
  MessagesSquare,
  Sparkles,
  ClipboardList,
  FolderOpen,
  BarChart3,
  User,
  Users,
  Settings,
  Layers,
  GraduationCap,
} from "lucide-react";
import type { NavItem } from "./AppShell";
import type { I18nContent } from "@/lib/i18n";

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

export function getStudentNav(t: I18nContent): NavItem[] {
  return [
    { to: "/student/dashboard", label: t.app.studentNav.dashboard, icon: Home },
    { to: "/student/yol", label: t.app.studentNav.path, icon: RouteIcon },
    { to: "/student/soz", label: t.app.studentNav.soz, icon: BookOpen, dot: "bg-soz" },
    { to: "/student/matn", label: t.app.studentNav.matn, icon: FileText, dot: "bg-matn" },
    {
      to: "/student/munozara",
      label: t.app.studentNav.munozara,
      icon: MessagesSquare,
      dot: "bg-munozara",
    },
    { to: "/student/oyna", label: t.app.studentNav.oyna, icon: Sparkles, dot: "bg-oyna" },
    { to: "/student/topshiriqlar", label: t.app.studentNav.tasks, icon: ClipboardList },
    { to: "/student/portfolio", label: t.app.studentNav.portfolio, icon: FolderOpen },
    { to: "/student/natijalar", label: t.app.studentNav.results, icon: BarChart3 },
    { to: "/profil", label: t.app.studentNav.profile, icon: User },
  ];
}

export function getTeacherNav(t: I18nContent): NavItem[] {
  return [
    { to: "/teacher/dashboard", label: t.app.teacherNav.dashboard, icon: Home },
    { to: "/teacher/kontent", label: t.app.teacherNav.content, icon: Settings },
    { to: "/profil", label: t.app.teacherNav.profile, icon: User },
  ];
}

export function getAdminNav(t: I18nContent): NavItem[] {
  return [
    { to: "/admin/dashboard", label: t.app.adminNav.dashboard, icon: Home },
    { to: "/admin/foydalanuvchilar", label: t.app.adminNav.users, icon: Users },
    { to: "/teacher/dashboard", label: t.app.adminNav.teacherPanel, icon: GraduationCap },
    { to: "/student/dashboard", label: t.app.adminNav.studentPanel, icon: Layers },
    { to: "/profil", label: t.app.adminNav.profile, icon: User },
  ];
}
