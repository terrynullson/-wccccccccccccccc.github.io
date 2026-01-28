import React from "react";
import { TopBar } from "../topbar/TopBar";
import { SideMenu } from "../sideMenu/SideMenu";
import { OrderModal } from "../modals/OrderModal";
import type { OrderItem } from "../modals/OrderModal";
import { ClientPanel } from "./ClientPanel";
import { OrderPreviewPanel } from "./OrderPreviewPanel";
import "./appShell.css";
import { orderItemsSeed } from "../../data/order";

export function AppShell() {
  const [sideCollapsed, setSideCollapsed] = React.useState(() => {
    if (typeof window === "undefined") return true;
    const params = new URLSearchParams(window.location.search);
    return params.get("menu") === "open" ? false : true;
  });
  const [orderModalOpen, setOrderModalOpen] = React.useState(false);
  const [orderItems, setOrderItems] = React.useState<OrderItem[]>(orderItemsSeed);
  const [crossSell, setCrossSell] = React.useState<Record<string, boolean>>({});
  const sideMenuWidth = sideCollapsed ? "var(--side-w-collapsed)" : "var(--side-w)";
  const toggleSide = React.useCallback(() => setSideCollapsed((v) => !v), []);
  const sideWrapRef = React.useRef<HTMLDivElement>(null);
  const updateItemQty = React.useCallback((id: string, delta: number) => {
    setOrderItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) } : item
      )
    );
  }, []);
  const toggleCrossSell = React.useCallback((id: string) => {
    setCrossSell((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  React.useEffect(() => {
    if (sideCollapsed) return;

    const handleOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      const wrap = sideWrapRef.current;
      if (!wrap) return;
      if (wrap.contains(target)) return;
      setSideCollapsed(true);
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [sideCollapsed]);

  return (
    <div className="wcc-app" style={{ ["--side-menu-w" as string]: sideMenuWidth }}>
      <TopBar />

      <div className="wcc-layout">
        <div ref={sideWrapRef} className="wcc-sideWrap">
          <SideMenu collapsed={sideCollapsed} onToggle={toggleSide} />
        </div>

        <main className="wcc-workspace">
          <div className="wcc-card wcc-card--placeholder">Контент страницы будет здесь...</div>
        </main>

        <aside className="wcc-right">
          <OrderPreviewPanel
            items={orderItems}
            crossSell={crossSell}
            onToggleCrossSell={toggleCrossSell}
            onUpdateQty={updateItemQty}
            onOpenOrder={() => setOrderModalOpen(true)}
          />

          <ClientPanel />
        </aside>
      </div>

      <OrderModal
        open={orderModalOpen}
        items={orderItems}
        onItemsChange={setOrderItems}
        onClose={() => setOrderModalOpen(false)}
      />
    </div>
  );
}
