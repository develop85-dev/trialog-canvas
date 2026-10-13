import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MODULES, type ModuleKey } from "@/lib/modules";

export type ModuleStatus = "Boshlanmagan" | "Jarayonda" | "Tugallangan";

export function statusOf(p: number): ModuleStatus {
  return p >= 100 ? "Tugallangan" : p > 0 ? "Jarayonda" : "Boshlanmagan";
}

export const progressQuery = (userId: string) =>
  queryOptions({
    queryKey: ["progress", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("module_progress")
        .select("module, percent, updated_at")
        .eq("user_id", userId);
      if (error) throw error;
      const map = Object.fromEntries((data ?? []).map((r) => [r.module, r.percent])) as Partial<
        Record<ModuleKey, number>
      >;
      const modules = MODULES.map((m) => ({ ...m, percent: map[m.key] ?? 0 }));
      const overall = Math.round(modules.reduce((a, m) => a + m.percent, 0) / modules.length);
      return { modules, overall };
    },
  });

export const activityQuery = (userId: string) =>
  queryOptions({
    queryKey: ["activity", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_log")
        .select("id, module, title, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data ?? [];
    },
  });
