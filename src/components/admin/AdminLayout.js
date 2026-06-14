"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { LogOut, Menu } from "lucide-react";
import styles from "./AdminLayout.module.css";
import Link from "next/link";
import { useState } from "react";

export default function AdminLayout({ children, requiredRole }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/");
      } else if (role !== requiredRole && role !== null) {
        // If role is null, we might be in first-time setup or fetching.
        // Wait until it's loaded, or redirect if it's explicitly wrong.
        if (role) {
          router.push(role === "owner" ? "/owner" : "/teacher");
        }
      }
    }
  }, [user, role, loading, requiredRole, router]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/");
  };

  if (loading || (!user && !loading) || (role !== requiredRole && role !== null)) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Verifying access...</p>
      </div>
    );
  }

  const ownerLinks = [
    { name: "Dashboard", path: "/owner" },
    { name: "Website Content", path: "/owner/website" },
    { name: "Manage Notices", path: "/owner/notices" },
    { name: "Register Student", path: "/owner/students/register" },
    { name: "All Students", path: "/owner/students" },
    { name: "Promote / Delete", path: "/owner/students/promote" },
    { name: "Post Marks", path: "/owner/marks" },
    { name: "Fee Structure", path: "/owner/fees/structure" },
    { name: "Collect Fee", path: "/owner/fees/collect" },
    { name: "Fee Reports", path: "/owner/fees/reports" },
    { name: "Teacher Cash", path: "/owner/fees/settlements" },
    { name: "Attendance", path: "/owner/attendance" },
    { name: "Expenses", path: "/owner/expenses" },
    { name: "Class Management", path: "/owner/classes" },
    { name: "Teacher Accounts", path: "/owner/teachers" },
    { name: "Change Password", path: "/owner/settings/password" },
  ];

  const teacherLinks = [
    { name: "My Class Dashboard", path: "/teacher" },
    { name: "My Students", path: "/teacher/students" },
    { name: "Mark Attendance", path: "/teacher/attendance" },
    { name: "Submit Marks", path: "/teacher/marks" },
    { name: "Collect Fee", path: "/teacher/fees" },
  ];

  const links = requiredRole === "owner" ? ownerLinks : teacherLinks;

  return (
    <div className={styles.adminWrapper}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <h2 className="font-heading">SD Champs</h2>
          <span className={styles.roleBadge}>{requiredRole}</span>
        </div>
        <nav className={styles.nav}>
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`${styles.navLink} ${pathname === link.path ? styles.active : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/" className={styles.navLink} style={{ marginTop: "auto", color: "var(--gold-light)" }}>
            Back to Website
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </button>
          
          <div className={styles.topbarTitle}>
            {links.find((l) => l.path === pathname)?.name || "Dashboard"}
          </div>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </header>

        {/* Page Content */}
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className={styles.mobileOverlay} onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
