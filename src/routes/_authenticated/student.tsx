import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { dashboardPath, primaryRole, type AppRole } from "@/lib/auth";

const ALLOWED: AppRole[] = ["student", "admin"];

export const Route = createFileRoute("/_authenticated/student")({
  beforeLoad: ({ context }) => {
    if (!context.roles.some((r) => ALLOWED.includes(r))) {
      throw redirect({ to: dashboardPath(primaryRole(context.roles)) });
    }
  },
  component: () => <Outlet />,
});
