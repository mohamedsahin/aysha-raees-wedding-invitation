import { getStats, DEFAULT_FILTERS } from "@/lib/stats";
import { Dashboard } from "./Dashboard";
import "./admin.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const initialStats = await getStats(DEFAULT_FILTERS);
  return <Dashboard initialStats={initialStats} />;
}
