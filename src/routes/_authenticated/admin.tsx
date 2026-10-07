import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { dashboardPath, primaryRole, type AppRole } from "@/lib/auth";

const ALLOWED: AppRole[] = ["admin"];

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: ({ context }) => {
    if (!context.roles.some((r) => ALLOWED.includes(r))) {
      throw redirect({ to: dashboardPath(primaryRole(context.roles)) });
    }
  },
  component: () => <Outlet />,
});
