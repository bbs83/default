/* ============================================================
   Dashboard Layout — wraps all /dashboard/* pages
   ============================================================
   Simple layout that just renders children. The auth check
   is handled by middleware + individual page components.
   ============================================================ */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
