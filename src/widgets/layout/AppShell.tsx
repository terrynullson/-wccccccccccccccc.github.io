import React from "react";
import { TopBar } from "../topbar/TopBar";
import { SideMenu } from "../sideMenu/SideMenu";
import { OrderModal } from "../modals/OrderModal";
import type { OrderItem } from "../../data/order";
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
  const [orderModalReset, setOrderModalReset] = React.useState(0);
  const [activeSection, setActiveSection] = React.useState("cart");
  const sideMenuWidth = sideCollapsed ? "var(--side-w-collapsed)" : "var(--side-w)";
  const sideMenuPad = "var(--side-w-collapsed)";
  const toggleSide = React.useCallback(() => setSideCollapsed((v) => !v), []);
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

  const handleOpenOrder = React.useCallback(() => {
    setOrderModalOpen(true);
    setOrderModalReset((prev) => prev + 1);
  }, []);

  const pageTitles: Record<string, string> = {
    cart: "Корзина",
    "cart-main": "Корзина",
    "cart-lots": "Лоты в корзине",
    "listen-okk": "Прослушка от ОКК",
    "listen-okk-sv": "Прослушка ОКК СВ",
    alerts: "Уведомления",
    orders: "Заказы",
    tm: "Телемаркетолог",
    "tm-park-request": "Запрос на перепарковку",
    "tm-unpark-mass": "Массовая отпарковка",
    "tm-task-mass": "Массовая постановка задач",
    "tm-park-settings": "Настройки парковки",
    "tm-segments": "Панель управления Сегментами",
    "tm-profile": "Профиль ТМ",
    "tm-refusals": "Управление категорическими отказами",
    blacklist: "Чёрный список",
  };

  const activePageTitle = pageTitles[activeSection] ?? "Контент страницы";

  return (
    <div
      className="wcc-app"
      style={{
        ["--side-menu-w" as string]: sideMenuWidth,
        ["--side-menu-pad" as string]: sideMenuPad,
      }}
    >
      <TopBar />

      <div className="wcc-layout">
        <div className="wcc-sideWrap">
          <SideMenu
            collapsed={sideCollapsed}
            onToggle={toggleSide}
            activeId={activeSection}
            onSelect={(id) => setActiveSection(id)}
          />
        </div>

        <main className="wcc-workspace">
          <div className="wcc-card wcc-card--placeholder">{activePageTitle}</div>
        </main>

        <aside className="wcc-right">
          <OrderPreviewPanel
            items={orderItems}
            crossSell={crossSell}
            onToggleCrossSell={toggleCrossSell}
            onUpdateQty={updateItemQty}
            onOpenOrder={handleOpenOrder}
          />

          <ClientPanel />
        </aside>
      </div>

      <OrderModal
        open={orderModalOpen}
        items={orderItems}
        onItemsChange={setOrderItems}
        onClose={() => setOrderModalOpen(false)}
        resetToken={orderModalReset}
      />
    </div>
  );
}
