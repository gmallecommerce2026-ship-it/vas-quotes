"use client"
import { Home, Package, FilePlus, History, FolderTree } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", height: "100svh", flexDirection: "column", background: "#F5F7FA" }}>
      <main style={{
        flex: 1,
        overflowY: "auto",
        paddingBottom: "96px",
        paddingTop: "env(safe-area-inset-top)",
      }}>
        {children}
      </main>

      <nav style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "0.5px solid rgba(0,0,0,0.09)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-around",
          height: 60,
          padding: "0 6px",
        }}>
          <TabLink href="/" icon={<Home size={21} />} label="Báo giá"   isActive={pathname === "/"} />
          <TabLink href="/products" icon={<Package size={21} />} label="Kho hàng" isActive={pathname === "/products"} />

          {/* FAB nhô lên */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, position: "relative", top: -12, marginBottom: -4 }}>
            <Link href="/create-quote" style={{
              width: 52, height: 52,
              background: "linear-gradient(145deg, #6496FA, #4F7CF6)",
              borderRadius: 18,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 20px rgba(79,124,246,0.38), 0 2px 6px rgba(79,124,246,0.2)",
              color: "white",
            }}>
              <FilePlus size={23} />
            </Link>
            <span style={{ fontSize: 9, fontWeight: 700, color: "#4F7CF6", letterSpacing: "0.2px" }}>
              Tạo phiếu mua
            </span>
          </div>

          <TabLink href="/history"    icon={<History size={21} />}   label="Lịch sử"  isActive={pathname === "/history"} />
          <TabLink href="/categories" icon={<FolderTree size={21} />} label="Danh mục" isActive={pathname === "/categories"} />
        </div>
      </nav>
    </div>
  );
}

function TabLink({ href, icon, label, isActive }: {
  href: string; icon: React.ReactNode; label: string; isActive: boolean;
}) {
  return (
    <Link href={href} style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 3, width: 54, height: 52,
      borderRadius: 13,
      background: isActive ? "#EEF4FF" : "transparent",
      position: "relative",
      textDecoration: "none",
    }}>
      <span style={{ color: isActive ? "#4F7CF6" : "#C0CCDD", transform: isActive ? "scale(1.1)" : "scale(1)", transition: "all 0.15s" }}>
        {icon}
      </span>
      <span style={{ fontSize: 9, fontWeight: 600, color: isActive ? "#4F7CF6" : "#C0CCDD", whiteSpace: "nowrap", letterSpacing: "0.1px" }}>
        {label}
      </span>
      {isActive && (
        <span style={{ position: "absolute", bottom: 4, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: "#4F7CF6" }} />
      )}
    </Link>
  );
}