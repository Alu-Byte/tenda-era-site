import { redirect } from "next/navigation";
import { checkAdminAuth } from "@/lib/auth";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const authed = await checkAdminAuth();
  if (!authed) redirect("/admin/login");
  return <AdminDashboard />;
}
