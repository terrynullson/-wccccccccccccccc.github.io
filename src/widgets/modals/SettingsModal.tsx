import React from "react";
import { createPortal } from "react-dom";
import "./modalBase.css";
import "./settingsModal.css";

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const modalRoot = typeof document !== "undefined" ? document.body : null;

  if (!open || !modalRoot) return null;

  return createPortal(
    <div className="wcc-modal wcc-settingsModal" role="dialog" aria-label="Настройки пользователя">
      <div className="wcc-modal__backdrop" onClick={onClose} />
      <div className="wcc-modal__body wcc-settingsModal__body">
        <div className="wcc-settingsModal__title">Настройки пользователя</div>
        <div className="wcc-settingsModal__content">Настройки пользователя</div>
        <div className="wcc-settingsModal__actions">
          <button className="wcc-action-btn" type="button" onClick={onClose}>
            Ок
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
}
