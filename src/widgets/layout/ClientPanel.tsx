import React from "react";
import "./appShell.css";

import mailIcon from "../../assets/communication/e-mail.svg";
import maxIcon from "../../assets/communication/max.svg";
import smsIcon from "../../assets/communication/sms.svg";
import telegramIcon from "../../assets/communication/telegram.svg";
import whatsappIcon from "../../assets/communication/whatsapp.svg";
import {
  clientTabs,
  clientMainFields,
  clientContactFields,
  clientAddressFields,
  type ClientTabId,
  type ClientField,
} from "../../data/client";

const communicationIcons = [
  { id: "wa", label: "WhatsApp", icon: whatsappIcon },
  { id: "tg", label: "Telegram", icon: telegramIcon },
  { id: "sms", label: "СМС", icon: smsIcon },
  { id: "mail", label: "Почта", icon: mailIcon },
  { id: "max", label: "MAX", icon: maxIcon },
];

const initialCommState = communicationIcons.reduce((acc, item) => {
  acc[item.id] = true;
  return acc;
}, {} as Record<string, boolean>);

const renderField = (field: ClientField) => {
  const isInline = field.id === "client-tier" || field.id === "client-code";

  if (isInline) {
    return (
      <div key={field.id} className="wcc-clientField wcc-clientField--inline">
        <span className="wcc-clientField__label">{field.label}:</span>
        <span className="wcc-clientField__valueInline">{field.value || "—"}</span>
      </div>
    );
  }

  return (
    <div key={field.id} className="wcc-clientField">
      <span className="wcc-clientField__label">{field.label}</span>
      <div className="wcc-clientValue">{field.value || "—"}</div>
    </div>
  );
};

export const ClientPanel = React.memo(function ClientPanel() {
  const [activeTab, setActiveTab] = React.useState<ClientTabId>("main");
  const [commActive, setCommActive] = React.useState<Record<string, boolean>>(initialCommState);
  const [now, setNow] = React.useState(() => new Date());
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const toggleComm = React.useCallback((id: string) => {
    setCommActive((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const formatDateTime = (value: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = clientTabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex < 0) return;

    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (currentIndex + direction + clientTabs.length) % clientTabs.length;
      const nextTab = clientTabs[nextIndex];
      if (nextTab) {
        setActiveTab(nextTab.id);
        tabRefs.current[nextIndex]?.focus();
      }
    }
  };

  return (
    <section className="wcc-panel">
      <div
        className="wcc-tabs"
        role="tablist"
        aria-label="Клиентские вкладки"
        onKeyDown={handleTabKeyDown}
      >
        {clientTabs.map((tab, index) => {
          const tabId = `client-tab-${tab.id}`;
          const panelId = `client-panel-${tab.id}`;

          return (
            <button
              key={tab.id}
              id={tabId}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              className={`wcc-tab ${activeTab === tab.id ? "is-active" : ""}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={panelId}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        id={`client-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`client-tab-${activeTab}`}
        className="wcc-panel__body wcc-muted"
      >
        {activeTab === "main" ? (
          <div className="wcc-clientCompact">
            <div className="wcc-clientCompact__grid">
              <div className="wcc-clientCompact__col">
                <div className="wcc-clientSection">
                  <div className="wcc-clientFields wcc-clientFields--2">
                    {clientMainFields.map(renderField)}
                  </div>
                  <div className="wcc-clientInline">
                    <span className="wcc-clientInline__label">Пол:</span>
                    <label className="wcc-radio">
                      <input type="radio" name="gender" defaultChecked />
                      <span>Жен.</span>
                    </label>
                    <label className="wcc-radio">
                      <input type="radio" name="gender" />
                      <span>Муж.</span>
                    </label>
                  </div>
                </div>

                <div className="wcc-clientSection">
                  <div className="wcc-clientFields wcc-clientFields--2">
                    {clientContactFields.map(renderField)}
                  </div>
                  <div className="wcc-clientInline">
                    <span className="wcc-clientInline__label">Время клиента:</span>
                    <span>{formatDateTime(now)}</span>
                  </div>
                </div>

                <div className="wcc-clientSection">
                  <div className="wcc-commRow" role="list">
                    {communicationIcons.map((item) => (
                      <button
                        key={item.id}
                        className={`wcc-commBtn ${commActive[item.id] ? "is-active" : ""}`}
                        type="button"
                        aria-label={item.label}
                        title={item.label}
                        role="listitem"
                        onClick={() => toggleComm(item.id)}
                      >
                        <img src={item.icon} alt="" className="wcc-commBtn__icon" />
                      </button>
                    ))}
                  </div>
                  <div className="wcc-chipRow">
                    <button className="wcc-pillBtn" type="button">Отказ от рассылок</button>
                    <button className="wcc-pillBtn" type="button">Сотрудник</button>
                    <button className="wcc-pillBtn wcc-pillBtn--danger" type="button">Сбросить анкету</button>
                  </div>
                </div>
              </div>

              <div className="wcc-clientCompact__col">
                <div className="wcc-clientSection">
                  <div className="wcc-clientFields wcc-clientFields--3">
                    {clientAddressFields.map(renderField)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          "Тут будет анкета клиента."
        )}
      </div>
    </section>
  );
});
