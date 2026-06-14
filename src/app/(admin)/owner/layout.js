import AdminLayout from "@/components/admin/AdminLayout";

export default function OwnerLayout({ children }) {
  return <AdminLayout requiredRole="owner">{children}</AdminLayout>;
}
