import React from "react";
import "./appShell.css";

import mailIcon from "../../assets/communication/e-mail.svg";
import maxIcon from "../../assets/communication/max.svg";
import smsIcon from "../../assets/communication/sms.svg";
import telegramIcon from "../../assets/communication/telegram.svg";
import whatsappIcon from "../../assets/communication/whatsapp.svg";
import { clientTabs, type ClientTabId } from "../../data/client";

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

type EditableFieldProps = {
  label: string;
  value: string;
  saved: string;
  focused: boolean;
  span?: 1 | 2;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  priority?: boolean;
  onChange: (next: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  onFocus: () => void;
  onBlur: () => void;
};

const EditableField = ({
  label,
  value,
  saved,
  focused,
  span,
  type = "text",
  inputMode,
  priority = false,
  onChange,
  onConfirm,
  onCancel,
  onFocus,
  onBlur,
}: EditableFieldProps) => {
  const showActions = focused || value !== saved;
  const spanClass = span === 2 ? "wcc-clientField--span-2" : "";
  const priorityClass = priority ? "wcc-clientField--primary" : "";

  return (
    <div className={`wcc-clientField ${spanClass} ${priorityClass}`.trim()}>
      <span className="wcc-clientField__label">{label}</span>
      <div className="wcc-clientEdit">
        <input
          className="wcc-clientInput"
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {showActions && (
          <div className="wcc-clientEdit__actions">
            <button
              type="button"
              className="wcc-clientEditBtn wcc-clientEditBtn--ok"
              aria-label="Подтвердить"
              onClick={onConfirm}
            >
              ✓
            </button>
            <button
              type="button"
              className="wcc-clientEditBtn wcc-clientEditBtn--cancel"
              aria-label="Отменить"
              onClick={onCancel}
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const ClientPanel = React.memo(function ClientPanel() {
  const [activeTab, setActiveTab] = React.useState<ClientTabId>("main");
  const [commActive, setCommActive] = React.useState<Record<string, boolean>>(initialCommState);
  const [now, setNow] = React.useState(() => new Date());
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const [nameDrafts, setNameDrafts] = React.useState(() => ({
    last: "Иванова",
    first: "Мария",
    middle: "Сергеевна",
  }));
  const [nameSaved, setNameSaved] = React.useState(() => ({ ...nameDrafts }));
  const [nameFocus, setNameFocus] = React.useState<{ last: boolean; first: boolean; middle: boolean }>({
    last: false,
    first: false,
    middle: false,
  });
  const [tierInfoOpen, setTierInfoOpen] = React.useState(false);
  const [isEmployee, setIsEmployee] = React.useState(true);
  const [gender, setGender] = React.useState<"female" | "male">("female");
  const [contactDrafts, setContactDrafts] = React.useState({
    phoneMain: "+7 909 953-75-59",
    phoneWork: "+7 909 953-75-59",
    phoneAlt: "+7 909 953-75-59",
    email: "dableev@ves-contact.com",
  });
  const [contactSaved, setContactSaved] = React.useState({ ...contactDrafts });
  const [contactFocus, setContactFocus] = React.useState({
    phoneMain: false,
    phoneWork: false,
    phoneAlt: false,
    email: false,
  });
  const [addressDrafts, setAddressDrafts] = React.useState({
    country: "Россия",
    index: "127521",
    city: "Москва",
    town: "Москва",
    district: "",
    street: "Веткина",
    house: "",
    corpus: "",
    flat: "",
  });

  const toggleComm = React.useCallback((id: string) => {
    setCommActive((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const formatPhone = React.useCallback((value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (!digits.length) return "";
    const normalized = digits.startsWith("7") ? digits.slice(1) : digits;
    const parts = normalized.padEnd(10, "_").split("");
    const formatted = `+7 ${parts.slice(0, 3).join("")}-${parts.slice(3, 6).join("")}-${parts.slice(6, 8).join("")}-${parts.slice(8, 10).join("")}`;
    return formatted.replace(/_+/g, "");
  }, []);

  const handleContactChange = (key: keyof typeof contactDrafts, value: string) => {
    if (key !== "email") {
      setContactDrafts((prev) => ({ ...prev, [key]: formatPhone(value) }));
      return;
    }
    setContactDrafts((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddressChange = (key: keyof typeof addressDrafts, value: string) => {
    setAddressDrafts((prev) => ({ ...prev, [key]: value }));
  };

  const clearProfile = () => {
    setNameDrafts({ last: "", first: "", middle: "" });
    setNameSaved({ last: "", first: "", middle: "" });
    setContactDrafts({ phoneMain: "", phoneWork: "", phoneAlt: "", email: "" });
    setContactSaved({ phoneMain: "", phoneWork: "", phoneAlt: "", email: "" });
    setAddressDrafts({
      country: "",
      index: "",
      city: "",
      town: "",
      district: "",
      street: "",
      house: "",
      corpus: "",
      flat: "",
    });
    setCommActive(
      communicationIcons.reduce((acc, item) => {
        acc[item.id] = false;
        return acc;
      }, {} as Record<string, boolean>)
    );
  };

  const resetComm = () => {
    setCommActive(
      communicationIcons.reduce((acc, item) => {
        acc[item.id] = false;
        return acc;
      }, {} as Record<string, boolean>)
    );
  };

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  React.useEffect(() => {
    if (!tierInfoOpen) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(".wcc-infoBtn") || target.closest(".wcc-infoPopover")) return;
      setTierInfoOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [tierInfoOpen]);

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
        className="wcc-panel__body"
      >
        {activeTab === "main" ? (
          <div className="wcc-clientCompact">
            <div className="wcc-clientCompact__grid">
              <div className="wcc-clientCompact__col">
                <div className="wcc-clientSection">
                  <div className="wcc-clientHeader">
                    <div className="wcc-clientHeaderLabelRow">
                      <div className="wcc-clientHeaderLabelCell">
                        <span className="wcc-clientHeaderLabel">Класс клиента</span>
                        <button
                          type="button"
                          className="wcc-infoBtn"
                          aria-label="Информация о классе клиента"
                          onClick={() => setTierInfoOpen((v) => !v)}
                        >
                          i
                        </button>
                        {tierInfoOpen && (
                          <div className="wcc-infoPopover">
                            Здесь будет информация о классе клиента.
                          </div>
                        )}
                      </div>
                      <div className="wcc-clientHeaderLabelCell">
                        <span className="wcc-clientHeaderLabel">Код клиента</span>
                      </div>
                    </div>
                    <div className="wcc-clientHeaderValueRow">
                      <div className="wcc-clientHeaderValue">ААА</div>
                      <div className="wcc-clientHeaderValue">000000-000000</div>
                    </div>
                  </div>
                  {isEmployee && <div className="wcc-clientBadge">Сотрудник</div>}
                  <div className="wcc-clientFields wcc-clientFields--1">
                    <EditableField
                      label="Фамилия"
                      value={nameDrafts.last}
                      saved={nameSaved.last}
                      focused={nameFocus.last}
                      onChange={(next) => setNameDrafts((prev) => ({ ...prev, last: next }))}
                      onConfirm={() => setNameSaved((prev) => ({ ...prev, last: nameDrafts.last }))}
                      onCancel={() => setNameDrafts((prev) => ({ ...prev, last: nameSaved.last }))}
                      onFocus={() => setNameFocus((prev) => ({ ...prev, last: true }))}
                      onBlur={() => setNameFocus((prev) => ({ ...prev, last: false }))}
                    />
                    <EditableField
                      label="Имя"
                      value={nameDrafts.first}
                      saved={nameSaved.first}
                      focused={nameFocus.first}
                      onChange={(next) => setNameDrafts((prev) => ({ ...prev, first: next }))}
                      onConfirm={() => setNameSaved((prev) => ({ ...prev, first: nameDrafts.first }))}
                      onCancel={() => setNameDrafts((prev) => ({ ...prev, first: nameSaved.first }))}
                      onFocus={() => setNameFocus((prev) => ({ ...prev, first: true }))}
                      onBlur={() => setNameFocus((prev) => ({ ...prev, first: false }))}
                    />
                    <EditableField
                      label="Отчество"
                      value={nameDrafts.middle}
                      saved={nameSaved.middle}
                      focused={nameFocus.middle}
                      onChange={(next) => setNameDrafts((prev) => ({ ...prev, middle: next }))}
                      onConfirm={() => setNameSaved((prev) => ({ ...prev, middle: nameDrafts.middle }))}
                      onCancel={() => setNameDrafts((prev) => ({ ...prev, middle: nameSaved.middle }))}
                      onFocus={() => setNameFocus((prev) => ({ ...prev, middle: true }))}
                      onBlur={() => setNameFocus((prev) => ({ ...prev, middle: false }))}
                    />
                  </div>
                  <div className="wcc-clientInline">
                    <span className="wcc-clientInline__label">Пол</span>
                    <label className="wcc-radio wcc-radio--custom">
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === "female"}
                        onChange={() => setGender("female")}
                      />
                      <span>Женский</span>
                    </label>
                    <label className="wcc-radio wcc-radio--custom">
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === "male"}
                        onChange={() => setGender("male")}
                      />
                      <span>Мужской</span>
                    </label>
                  </div>
                </div>

                <div className="wcc-clientSection">
                  <div className="wcc-clientFields wcc-clientFields--1">
                    <EditableField
                      label="Основной телефон"
                      value={contactDrafts.phoneMain}
                      saved={contactSaved.phoneMain}
                      focused={contactFocus.phoneMain}
                      type="tel"
                      inputMode="tel"
                      onChange={(next) => handleContactChange("phoneMain", next)}
                      onConfirm={() => setContactSaved((prev) => ({ ...prev, phoneMain: contactDrafts.phoneMain }))}
                      onCancel={() => setContactDrafts((prev) => ({ ...prev, phoneMain: contactSaved.phoneMain }))}
                      onFocus={() => setContactFocus((prev) => ({ ...prev, phoneMain: true }))}
                      onBlur={() => setContactFocus((prev) => ({ ...prev, phoneMain: false }))}
                    />
                    <EditableField
                      label="Рабочий телефон"
                      value={contactDrafts.phoneWork}
                      saved={contactSaved.phoneWork}
                      focused={contactFocus.phoneWork}
                      type="tel"
                      inputMode="tel"
                      onChange={(next) => handleContactChange("phoneWork", next)}
                      onConfirm={() => setContactSaved((prev) => ({ ...prev, phoneWork: contactDrafts.phoneWork }))}
                      onCancel={() => setContactDrafts((prev) => ({ ...prev, phoneWork: contactSaved.phoneWork }))}
                      onFocus={() => setContactFocus((prev) => ({ ...prev, phoneWork: true }))}
                      onBlur={() => setContactFocus((prev) => ({ ...prev, phoneWork: false }))}
                    />
                    <EditableField
                      label="Дополнительный телефон"
                      value={contactDrafts.phoneAlt}
                      saved={contactSaved.phoneAlt}
                      focused={contactFocus.phoneAlt}
                      type="tel"
                      inputMode="tel"
                      onChange={(next) => handleContactChange("phoneAlt", next)}
                      onConfirm={() => setContactSaved((prev) => ({ ...prev, phoneAlt: contactDrafts.phoneAlt }))}
                      onCancel={() => setContactDrafts((prev) => ({ ...prev, phoneAlt: contactSaved.phoneAlt }))}
                      onFocus={() => setContactFocus((prev) => ({ ...prev, phoneAlt: true }))}
                      onBlur={() => setContactFocus((prev) => ({ ...prev, phoneAlt: false }))}
                    />
                    <EditableField
                      label="E-mail"
                      value={contactDrafts.email}
                      saved={contactSaved.email}
                      focused={contactFocus.email}
                      type="email"
                      onChange={(next) => handleContactChange("email", next)}
                      onConfirm={() => setContactSaved((prev) => ({ ...prev, email: contactDrafts.email }))}
                      onCancel={() => setContactDrafts((prev) => ({ ...prev, email: contactSaved.email }))}
                      onFocus={() => setContactFocus((prev) => ({ ...prev, email: true }))}
                      onBlur={() => setContactFocus((prev) => ({ ...prev, email: false }))}
                    />
                  </div>
                </div>
              </div>

              <div className="wcc-clientCompact__col">
                <div className="wcc-clientSection">
                  <div className="wcc-clientFields wcc-clientFields--2">
                    <div className="wcc-clientField wcc-clientField--span-2">
                      <span className="wcc-clientField__label">Страна</span>
                      <input
                        className="wcc-clientInput"
                        value={addressDrafts.country}
                        onChange={(e) => handleAddressChange("country", e.target.value)}
                      />
                    </div>
                    <div className="wcc-clientField">
                      <span className="wcc-clientField__label">Индекс</span>
                      <input
                        className="wcc-clientInput"
                        value={addressDrafts.index}
                        onChange={(e) => handleAddressChange("index", e.target.value)}
                      />
                    </div>
                    <div className="wcc-clientField">
                      <span className="wcc-clientField__label">Населённый пункт</span>
                      <input
                        className="wcc-clientInput"
                        value={addressDrafts.city}
                        onChange={(e) => handleAddressChange("city", e.target.value)}
                      />
                    </div>
                    <div className="wcc-clientField">
                      <span className="wcc-clientField__label">Город</span>
                      <input
                        className="wcc-clientInput"
                        value={addressDrafts.town}
                        onChange={(e) => handleAddressChange("town", e.target.value)}
                      />
                    </div>
                    <div className="wcc-clientField">
                      <span className="wcc-clientField__label">Район</span>
                      <input
                        className="wcc-clientInput"
                        value={addressDrafts.district}
                        onChange={(e) => handleAddressChange("district", e.target.value)}
                      />
                    </div>
                    <div className="wcc-clientField wcc-clientField--span-2">
                      <span className="wcc-clientField__label">Улица</span>
                      <input
                        className="wcc-clientInput"
                        value={addressDrafts.street}
                        onChange={(e) => handleAddressChange("street", e.target.value)}
                      />
                    </div>
                    <div className="wcc-clientField">
                      <span className="wcc-clientField__label">Дом</span>
                      <input
                        className="wcc-clientInput"
                        value={addressDrafts.house}
                        onChange={(e) => handleAddressChange("house", e.target.value)}
                      />
                    </div>
                    <div className="wcc-clientField">
                      <span className="wcc-clientField__label">Корпус</span>
                      <input
                        className="wcc-clientInput"
                        value={addressDrafts.corpus}
                        onChange={(e) => handleAddressChange("corpus", e.target.value)}
                      />
                    </div>
                    <div className="wcc-clientField">
                      <span className="wcc-clientField__label">Квартира</span>
                      <input
                        className="wcc-clientInput"
                        value={addressDrafts.flat}
                        onChange={(e) => handleAddressChange("flat", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="wcc-clientSection">
                  <div className="wcc-clientInline">
                    <span className="wcc-clientInline__label">Время клиента:</span>
                    <span>{formatDateTime(now)}</span>
                  </div>
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
                    <button className="wcc-pillBtn" type="button" onClick={resetComm}>
                      Отказ от рассылок
                    </button>
                    <button className="wcc-pillBtn wcc-pillBtn--danger" type="button" onClick={clearProfile}>
                      Сбросить анкету
                    </button>
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
