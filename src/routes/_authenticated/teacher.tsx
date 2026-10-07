import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { dashboardPath, primaryRole, type AppRole } from "@/lib/auth";

const ALLOWED: AppRole[] = ["teacher", "admin"];

export const Route = createFileRoute("/_authenticated/teacher")({
  beforeLoad: ({ context }) => {
    if (!context.roles.some((r) => ALLOWED.includes(r))) {
      throw redirect({ to: dashboardPath(primaryRole(context.roles)) });
    }
  },
  component: () => <Outlet />,
});
