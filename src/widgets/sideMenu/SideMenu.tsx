import React from "react";
import "./sideMenu.css";

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

type Section = {
  id: string;
  label: string;
  icon: React.ReactNode;
  children?: { id: string; label: string }[];
};

const sections: Section[] = [
  {
    id: "cart",
    label: "Корзина",
    icon: (
      <svg className="wcc-side__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M7 7h12l-1.2 7.2a2 2 0 0 1-2 1.7H9.2a2 2 0 0 1-2-1.6L6 4.5H4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="18" r="1.6" fill="currentColor" />
        <circle cx="16" cy="18" r="1.6" fill="currentColor" />
      </svg>
    ),
    children: [
      { id: "cart-main", label: "Корзина" },
      { id: "cart-lots", label: "Лоты в корзине" },
    ],
  },
  {
    id: "listen-okk",
    label: "Прослушка от ОКК",
    icon: (
      <svg className="wcc-side__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 11c0-3.9 3.1-7 7-7s7 3.1 7 7" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <rect x="3.5" y="11" width="4" height="7" rx="2" fill="currentColor" opacity="0.25" />
        <rect x="16.5" y="11" width="4" height="7" rx="2" fill="currentColor" opacity="0.25" />
      </svg>
    ),
  },
  {
    id: "listen-okk-sv",
    label: "Прослушка ОКК СВ",
    icon: (
      <svg className="wcc-side__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7" fill="currentColor" opacity="0.18" />
        <path d="M9.5 8.5l6 3.5-6 3.5z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "alerts",
    label: "Уведомления",
    icon: (
      <svg className="wcc-side__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5a4 4 0 0 1 4 4v3.2l1.6 2.8H6.4L8 12.2V9a4 4 0 0 1 4-4Z" fill="currentColor" opacity="0.2" />
        <path d="M9.5 18a2.5 2.5 0 0 0 5 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "orders",
    label: "Заказы",
    icon: (
      <svg className="wcc-side__icon" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="4.5" width="14" height="15" rx="3" fill="currentColor" opacity="0.18" />
        <path d="M8 9h8M8 13h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "tm",
    label: "Телемаркетолог",
    icon: (
      <svg className="wcc-side__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 17h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M7 7h10l-1 6H8l-1-6Z" fill="currentColor" opacity="0.2" />
        <path d="M9 5h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    children: [
      { id: "tm-park-request", label: "Запрос на перепарковку" },
      { id: "tm-unpark-mass", label: "Массовая отпарковка" },
      { id: "tm-task-mass", label: "Массовая постановка задач" },
      { id: "tm-park-settings", label: "Настройки парковки" },
      { id: "tm-segments", label: "Панель управления Сегментами" },
      { id: "tm-profile", label: "Профиль ТМ" },
      { id: "tm-refusals", label: "Управление категорическими отказами" },
    ],
  },
  {
    id: "blacklist",
    label: "Чёрный список",
    icon: (
      <svg className="wcc-side__icon" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7" fill="currentColor" opacity="0.18" />
        <path d="M9 9l6 6M15 9l-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

export const SideMenu = React.memo(function SideMenu({ collapsed, onToggle }: Props) {
  const [openId, setOpenId] = React.useState<string>("cart");

  const handleSectionClick = (id: string, hasChildren: boolean) => {
    if (!hasChildren) {
      setOpenId(id);
      return;
    }
    setOpenId((prev) => (prev === id ? "" : id));
  };

  return (
    <aside className={`wcc-side ${collapsed ? "is-collapsed" : "is-open"}`}>
      <button
        className={`wcc-side__burger ${collapsed ? "is-collapsed" : "is-open"}`}
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? "Открыть меню" : "Свернуть меню"}
        aria-expanded={!collapsed}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className="wcc-side__menu" aria-label="Разделы">
        {sections.map((section) => {
          const isOpen = openId === section.id;
          const hasChildren = Boolean(section.children?.length);

          return (
            <div className="wcc-side__section" key={section.id}>
              <button
                className={`wcc-side__item ${isOpen ? "is-active" : ""}`}
                type="button"
                title={section.label}
                aria-expanded={hasChildren ? isOpen : undefined}
                onClick={() => handleSectionClick(section.id, hasChildren)}
              >
                {section.icon}
                <span className="wcc-side__label">{section.label}</span>
                {hasChildren ? (
                  <span className={`wcc-side__chevron ${isOpen ? "is-open" : ""}`} aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M8 10l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                ) : null}
              </button>

              {hasChildren ? (
                <div className={`wcc-side__sub ${isOpen ? "is-open" : ""}`}>
                  {section.children?.map((child) => (
                    <button
                      key={child.id}
                      className="wcc-side__subItem"
                      type="button"
                      title={child.label}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
});



