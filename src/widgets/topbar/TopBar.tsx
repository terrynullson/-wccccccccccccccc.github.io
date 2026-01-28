import React from "react";
import "./topbar.css";

import { IconButton } from "../../shared/ui/IconButton";
import { SettingsModal } from "../modals/SettingsModal";

import brandUrl from "../../assets/brand.svg";

// telephony icons 1..8
import p1 from "../../assets/telephony/phone_1.svg";
import p2 from "../../assets/telephony/phone_2.svg";
import p3 from "../../assets/telephony/phone_3.svg";
import p4 from "../../assets/telephony/phone_4.svg";
import p5 from "../../assets/telephony/phone_5.svg";
import p6 from "../../assets/telephony/phone_6.svg";
import p7 from "../../assets/telephony/phone_7.svg";
import p8 from "../../assets/telephony/phone_8.svg";

const STR = {
  searchPlaceholder: "Поиск…",
  searchAria: "Поиск: телефон, заказ, клиент",
  clearSearch: "Очистить поиск",
  telephonyPanel: "Панель звонка",
  callTimer: "Таймер звонка",
  shiftBlock: "Смена и таймер",
  startShift: "Начать смену",
  endShift: "Закончить смену",
  pause: "Пауза",
  play: "Возобновить",
  shiftTimer: "Таймер смены",
  messages: "Сообщения",
  favorites: "Избранное",
  notifyCount: "0 уведомлений",
  favoritesCount: "0 избранных",
  profile: "Профиль",
  operator: "Иосиф Александрович Бродский",
  operatorShort: "ИАБ",
  themeToggle: "Тема",
  themeLight: "Светлая тема",
  themeDark: "Тёмная тема",
  settings: "Настройки",
  settingsTitle: "Настройки пользователя",
  volume: "Громкость",
  dialer: "Набор номера",
  pauseReasons: "Причина паузы",
  reasonRestroom: "В туалет",
  reasonFamily: "Семейные дела",
  reasonLunch: "Обед",
  reasonSick: "Стало плохо",
  reasonCustom: "Свой вариант",
  ok: "Ок",
} as const;

const pauseReasons = [
  STR.reasonRestroom,
  STR.reasonFamily,
  STR.reasonLunch,
  STR.reasonSick,
  STR.reasonCustom,
] as const;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatHMS(totalSeconds: number) {
  const hh = Math.floor(totalSeconds / 3600);
  const mm = Math.floor((totalSeconds % 3600) / 60);
  const ss = totalSeconds % 60;
  return `${pad2(hh)}:${pad2(mm)}:${pad2(ss)}`;
}

function formatMS(totalSeconds: number) {
  const mm = Math.floor(totalSeconds / 60);
  const ss = totalSeconds % 60;
  return `${pad2(mm)}:${pad2(ss)}`;
}

type TopBarProps = {
  initialWorking?: boolean;
};

const THEME_KEY = "wcc-theme";

type ThemeMode = "light" | "dark";
type ActivePanel = "volume" | "dial" | "pause" | null;

export function TopBar({ initialWorking = false }: TopBarProps) {
  const topbarRef = React.useRef<HTMLElement | null>(null);
  // shift (toggle)
  const [working, setWorking] = React.useState(initialWorking);
  const [paused, setPaused] = React.useState(false);
  const [shiftSeconds, setShiftSeconds] = React.useState(0);

  // theme
  const [theme, setTheme] = React.useState<ThemeMode>(() => {
    try {
      const saved = window.localStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") {
        return saved;
      }
    } catch {
      // ignore storage errors
    }
    return "light";
  });

  // call (demo)
  const [inCall, setInCall] = React.useState(false);
  const [callSeconds, setCallSeconds] = React.useState(0);

  // call badge
  const [showCallBadge, setShowCallBadge] = React.useState(false);

  // search
  const [query, setQuery] = React.useState("");

  // panels
  const [activePanel, setActivePanel] = React.useState<ActivePanel>(null);
  const [volume, setVolume] = React.useState(50);
  const [dialNumber, setDialNumber] = React.useState("");
  const [telephony4Active, setTelephony4Active] = React.useState(false);

  // pause reasons
  const [pauseReason, setPauseReason] = React.useState("");
  const [customReason, setCustomReason] = React.useState("");

  // profile menu + modal
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  // shift timer
  React.useEffect(() => {
    if (!working || paused) return;
    const t = window.setInterval(() => setShiftSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [working, paused]);

  // call timer
  React.useEffect(() => {
    if (!inCall) return;
    const t = window.setInterval(() => setCallSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [inCall]);

  // reset call timer
  React.useEffect(() => {
    if (!inCall) setCallSeconds(0);
  }, [inCall]);

  // call badge animation
  React.useEffect(() => {
    if (inCall) {
      setShowCallBadge(true);
      return;
    }
    const t = window.setTimeout(() => setShowCallBadge(false), 180);
    return () => window.clearTimeout(t);
  }, [inCall]);

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      if (activePanel) {
        if (target.closest(".wcc-popover")) return;
        if (target.closest(`[data-popover-trigger="${activePanel}"]`)) return;
        setActivePanel(null);
      }

      if (profileOpen && !target.closest(".wcc-profileWrap")) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [activePanel, profileOpen]);

  const telephony = [
    { id: 1, title: "Звонок", icon: p1 },
    { id: 2, title: "Телефония 2", icon: p2 },
    { id: 3, title: "Телефония 3", icon: p3 },
    { id: 4, title: "Телефония 4", icon: p4 },
    { id: 5, title: "Телефония 5", icon: p5 },
    { id: 6, title: "Телефония 6", icon: p6 },
    { id: 7, title: "Телефония 7", icon: p7 },
    { id: 8, title: "Телефония 8", icon: p8 },
  ] as const;

  const handleTelephonyClick = (id: number) => {
    if (id === 1) {
      setInCall((v) => !v);
      setActivePanel(null);
      return;
    }
    if (id === 3) {
      setActivePanel((p) => (p === "dial" ? null : "dial"));
      return;
    }
    if (id === 4) {
      setTelephony4Active((v) => !v);
      setActivePanel(null);
      return;
    }
    if (id === 7) {
      setActivePanel((p) => (p === "volume" ? null : "volume"));
      return;
    }
    setActivePanel(null);
  };

  const appendDigit = (digit: string) => {
    setDialNumber((prev) => {
      const next = `${prev}${digit}`.slice(0, 20);
      setQuery(next);
      return next;
    });
  };

  const removeDigit = () => {
    setDialNumber((prev) => {
      const next = prev.slice(0, -1);
      setQuery(next);
      return next;
    });
  };

  const clearDigits = () => {
    setDialNumber("");
    setQuery("");
  };

  const applyPause = () => {
    if (!pauseReason) return;
    if (pauseReason === STR.reasonCustom && customReason.trim().length === 0) return;
    setPaused(true);
    setActivePanel(null);
  };

  const pauseButtonLabel = paused ? STR.play : STR.pause;
  const volumePopoverId = "wcc-popover-volume";
  const dialPopoverId = "wcc-popover-dial";
  const pausePopoverId = "wcc-popover-pause";
  const profileMenuId = "wcc-profile-menu";

  return (
    <header className="wcc-topbar" role="banner" ref={topbarRef}>
      <div className="wcc-topbar__left">
        <div className="wcc-brand" aria-hidden="true">
          <span className="wcc-brand__icon">
            <img src={brandUrl} alt="" className="wcc-brand__img" />
          </span>
          <span className="wcc-brand__label">WCC</span>
        </div>
      </div>

      <div className="wcc-topbar__center">
        <div className="wcc-search" role="search">
          <svg className="wcc-search__icon" width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
            <path
              d="M8 14a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm4.7-1.3L16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="wcc-search__input"
            placeholder={STR.searchPlaceholder}
            aria-label={STR.searchAria}
          />

          {query.length > 0 && (
            <button
              className="wcc-search__clear"
              type="button"
              aria-label={STR.clearSearch}
              onClick={() => setQuery("")}
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="wcc-topbar__telephony" aria-label={STR.telephonyPanel}>
        <div className="wcc-telephony">
          {telephony.map((b) => {
            const isCallButton = b.id === 1;
            const isActiveCall = isCallButton && inCall;
            const isVolume = b.id === 7;
            const isDial = b.id === 3;
            const isTelephony4 = b.id === 4;
            const isToggleButton = isCallButton || isTelephony4;
            const isPressed = isToggleButton ? isActiveCall || (isTelephony4 && telephony4Active) : undefined;
            const isPopoverButton = isVolume || isDial;
            const isPopoverOpen =
              (isVolume && activePanel === "volume") || (isDial && activePanel === "dial");

            return (
              <div
                key={b.id}
                className={[
                  "wcc-telephony__item",
                  isCallButton ? "is-call" : "",
                  isActiveCall ? "is-calling" : "",
                ].join(" ")}
                data-popover-trigger={isVolume ? "volume" : isDial ? "dial" : undefined}
              >
                <IconButton
                  title={b.title}
                  active={Boolean(isPressed)}
                  onClick={() => handleTelephonyClick(b.id)}
                  aria-pressed={isPressed}
                  aria-expanded={isPopoverButton ? isPopoverOpen : undefined}
                  aria-controls={
                    isVolume
                      ? volumePopoverId
                      : isDial
                      ? dialPopoverId
                      : undefined
                  }
                  aria-haspopup={isPopoverButton ? "dialog" : undefined}
                >
                  <img src={b.icon} alt="" className="wcc-telephony__img" />
                </IconButton>

                {isCallButton && showCallBadge && (
                  <span
                    className={`wcc-callBadge ${inCall ? "is-visible" : "is-hidden"}`}
                    aria-label={STR.callTimer}
                    role="timer"
                    aria-live="off"
                  >
                    {formatMS(callSeconds)}
                  </span>
                )}

                {isVolume && activePanel === "volume" && (
                  <div
                    id={volumePopoverId}
                    className="wcc-popover wcc-popover--volume"
                    role="dialog"
                    aria-label={STR.volume}
                  >
                    <div className="wcc-popover__row">
                      <span className="wcc-popover__title">{STR.volume}</span>
                      <span className="wcc-popover__value">{volume}%</span>
                    </div>
                    <input
                      className="wcc-volume"
                      type="range"
                      min={0}
                      max={100}
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                    />
                  </div>
                )}

                {isDial && activePanel === "dial" && (
                  <div
                    id={dialPopoverId}
                    className="wcc-popover wcc-popover--dial"
                    role="dialog"
                    aria-label={STR.dialer}
                  >
                    <div className="wcc-popover__title">{STR.dialer}</div>
                    <div className="wcc-dialer__display">{dialNumber || "_"}</div>
                    <div className="wcc-dialer__grid">
                      {[
                        "1",
                        "2",
                        "3",
                        "4",
                        "5",
                        "6",
                        "7",
                        "8",
                        "9",
                        "*",
                        "0",
                        "#",
                      ].map((d) => (
                        <button
                          key={d}
                          type="button"
                          className="wcc-dialer__key"
                          onClick={() => appendDigit(d)}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                    <div className="wcc-dialer__actions">
                      <button type="button" className="wcc-dialer__btn" onClick={removeDigit}>
                        ←
                      </button>
                      <button type="button" className="wcc-dialer__btn" onClick={clearDigits}>
                        Очистить
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="wcc-topbar__right">
        <div className="wcc-topbar__group wcc-topbar__group--shift">
          <div className={`wcc-shiftCombo ${working ? "is-on" : ""}`} aria-label={STR.shiftBlock}>
            <button
              type="button"
              className={`wcc-shiftToggle ${working ? "is-on" : ""}`}
              onClick={() =>
                setWorking((v) => {
                  const next = !v;
                  if (!next) {
                    setPaused(false);
                    setActivePanel(null);
                  }
                  return next;
                })
              }
              aria-label={working ? STR.endShift : STR.startShift}
              title={working ? STR.endShift : STR.startShift}
              role="switch"
              aria-checked={working}
            >
              <span className="wcc-shiftToggle__label">
                {working ? STR.endShift : STR.startShift}
              </span>
              <span className="wcc-switch" aria-hidden="true">
                <span className="wcc-switch__thumb" />
              </span>
            </button>
            <div className="wcc-shiftPauseWrap" data-popover-trigger="pause">
              <button
                type="button"
                className={`wcc-shiftPause ${paused ? "is-on" : ""}`}
                onClick={() => {
                  if (!working) return;
                  if (paused) {
                    setPaused(false);
                    setActivePanel(null);
                    return;
                  }
                  setActivePanel((p) => (p === "pause" ? null : "pause"));
                }}
                aria-disabled={!working}
                disabled={!working}
                aria-pressed={paused}
                aria-expanded={activePanel === "pause"}
                aria-controls={pausePopoverId}
                aria-haspopup="dialog"
                title={pauseButtonLabel}
                aria-label={pauseButtonLabel}
              >
                <span className="wcc-shiftPause__icon" aria-hidden="true">
                  {paused ? (
                    <svg width="14" height="14" viewBox="0 0 18 18">
                      <path d="M6 4l8 5-8 5V4Z" fill="currentColor" />
                    </svg>
                  ) : (
                    <>
                      <span />
                      <span />
                    </>
                  )}
                </span>
              </button>

              {activePanel === "pause" && (
                <div
                  id={pausePopoverId}
                  className="wcc-popover wcc-popover--pause"
                  role="dialog"
                  aria-label={STR.pauseReasons}
                >
                  <div className="wcc-popover__title">{STR.pauseReasons}</div>
                  <div className="wcc-pause__list">
                    {pauseReasons.map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        className={`wcc-pause__item ${pauseReason === reason ? "is-active" : ""}`}
                        onClick={() => {
                          setPauseReason(reason);
                          if (reason !== STR.reasonCustom) {
                            setCustomReason("");
                          }
                        }}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                  {pauseReason === STR.reasonCustom && (
                    <input
                      className="wcc-pause__input"
                      placeholder="Введите причину"
                      aria-label="Свой вариант"
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                    />
                  )}
                  <div className="wcc-pause__actions">
                    <button
                      type="button"
                      className="wcc-pause__ok"
                      onClick={applyPause}
                      disabled={!pauseReason || (pauseReason === STR.reasonCustom && customReason.trim().length === 0)}
                    >
                      {STR.ok}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <span className="wcc-shiftTimerInline" title={STR.shiftTimer} role="timer" aria-live="off">
              {formatHMS(shiftSeconds)}
            </span>
          </div>
        </div>

        <div className="wcc-topbar__group wcc-topbar__group--meta">
          <button
            type="button"
            className="wcc-themeToggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? STR.themeLight : STR.themeDark}
            title={theme === "dark" ? STR.themeLight : STR.themeDark}
            aria-pressed={theme === "dark"}
          >
            <span className="wcc-themeToggle__icon" aria-hidden="true">
              {theme === "dark" ? (
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path
                    d="M21 14.5A9 9 0 1 1 9.5 3a7 7 0 1 0 11.5 11.5Z"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path
                    d="M12 4.5a7.5 7.5 0 1 0 7.5 7.5A7.5 7.5 0 0 0 12 4.5Zm0-3v2.4M12 20.1v2.4M4.5 12H2.1M21.9 12h-2.4M5.1 5.1 3.4 3.4M20.6 20.6l-1.7-1.7M18.9 5.1l1.7-1.7M3.4 20.6l1.7-1.7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
          </button>

          <div className="wcc-notify">
            <IconButton title={STR.messages}>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path
                  d="M3 5.5h12v8H6l-3 2V5.5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </IconButton>
            <span className="wcc-badge" aria-label={STR.notifyCount}>0</span>
          </div>

          <div className="wcc-notify">
            <IconButton title={STR.favorites}>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path
                  d="M9 15s-6-3.4-6-8a3.4 3.4 0 0 1 6-2 3.4 3.4 0 0 1 6 2c0 4.6-6 8-6 8Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </IconButton>
            <span className="wcc-badge" aria-label={STR.favoritesCount}>0</span>
          </div>

          <div className="wcc-profileWrap">
            <button
              className="wcc-profile"
              type="button"
              aria-label={STR.profile}
              onClick={() => setProfileOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              aria-controls={profileMenuId}
            >
              <span className="wcc-profile__avatar" aria-hidden="true">{STR.operatorShort}</span>
              <span className="wcc-profile__name">{STR.operator}</span>
              <svg width="14" height="14" viewBox="0 0 18 18" aria-hidden="true">
                <path d="m5 7 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            {profileOpen && (
              <div className="wcc-profileMenu" role="menu" id={profileMenuId}>
                <button
                  type="button"
                  className="wcc-profileMenu__item"
                  onClick={() => {
                    setSettingsOpen(true);
                    setProfileOpen(false);
                  }}
                >
                  {STR.settings}
                </button>
              </div>
            )}
          </div>

          <div className="wcc-logout">
            <IconButton title="Выход из системы">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M14 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M10 16l4-4-4-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 12h9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </IconButton>
          </div>
        </div>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </header>
  );
}







