import AdminLayout from "@/components/admin/AdminLayout";

export default function TeacherLayout({ children }) {
  return <AdminLayout requiredRole="teacher">{children}</AdminLayout>;
}
