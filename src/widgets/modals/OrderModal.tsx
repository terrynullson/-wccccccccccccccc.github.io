import React from "react";
import "./modalBase.css";
import "./orderModal.css";

import type { OrderItem } from "../../data/order";
import {
  carriers,
  payments,
  pvzList,
  pvzCarriers,
  deliveryPrices,
} from "../../data/order";
import { OrderSummaryCard } from "./orderSteps/OrderSummaryCard";
import { OrderStepItems } from "./orderSteps/OrderStepItems";
import { OrderStepDelivery } from "./orderSteps/OrderStepDelivery";
import { OrderStepPayment } from "./orderSteps/OrderStepPayment";

export type { OrderItem };

type OrderModalProps = {
  open: boolean;
  items: OrderItem[];
  onItemsChange: (items: OrderItem[]) => void;
  onClose: () => void;
};

type OrderFormState = {
  activeStep: 1 | 2 | 3;
  source: string;
  sourceError: boolean;
  addressError: boolean;
  orderComment: string;
  fullName: string;
  phone: string;
  country: string;
  region: string;
  postalCode: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  carrier: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryDeferral: number;
  carrierComment: string;
  payment: string;
  finalMessage: boolean;
  pvzOpen: boolean;
  pvzTab: "addresses" | "map";
  pvzSearch: string;
  selectedPvz: string | null;
};

type Action =
  | { type: "SET_VALUE"; key: keyof OrderFormState; value: OrderFormState[keyof OrderFormState] }
  | { type: "RESET_ON_OPEN" };

const initialState: OrderFormState = {
  activeStep: 1,
  source: "",
  sourceError: false,
  addressError: false,
  orderComment: "",
  fullName: "",
  phone: "",
  country: "",
  region: "",
  postalCode: "",
  city: "",
  street: "",
  house: "",
  apartment: "",
  carrier: "logsis",
  deliveryDate: "",
  deliveryTime: "",
  deliveryDeferral: 0,
  carrierComment: "",
  payment: "sbp",
  finalMessage: false,
  pvzOpen: false,
  pvzTab: "addresses",
  pvzSearch: "",
  selectedPvz: null,
};

function reducer(state: OrderFormState, action: Action): OrderFormState {
  switch (action.type) {
    case "SET_VALUE":
      return { ...state, [action.key]: action.value };
    case "RESET_ON_OPEN":
      return {
        ...state,
        activeStep: 1,
        sourceError: false,
        addressError: false,
        finalMessage: false,
        pvzOpen: false,
      };
    default:
      return state;
  }
}

function formatCurrency(value: number) {
  return value.toLocaleString("ru-RU") + " ₽";
}

export function OrderModal({ open, items, onItemsChange, onClose }: OrderModalProps) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
  const dragRef = React.useRef({ dragging: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });
  const modalBodyRef = React.useRef<HTMLDivElement | null>(null);
  const pvzBodyRef = React.useRef<HTMLDivElement | null>(null);
  const titleId = "wcc-order-modal-title";

  const setValue = <K extends keyof OrderFormState>(key: K, value: OrderFormState[K]) => {
    dispatch({ type: "SET_VALUE", key, value });
  };

  const itemsAmount = React.useMemo(
    () => items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
    [items]
  );

  const deliveryPrice = deliveryPrices[state.carrier] ?? 0;
  const totalWithoutDelivery = Math.max(0, itemsAmount);
  const totalWithDelivery = totalWithoutDelivery + deliveryPrice;

  const totalItems = React.useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [items]
  );

  const isAddressEmpty = React.useMemo(() => {
    return (
      !state.fullName.trim() &&
      !state.phone.trim() &&
      !state.postalCode.trim() &&
      !state.country.trim() &&
      !state.region.trim() &&
      !state.city.trim() &&
      !state.street.trim() &&
      !state.house.trim() &&
      !state.apartment.trim()
    );
  }, [
    state.fullName,
    state.phone,
    state.postalCode,
    state.country,
    state.region,
    state.city,
    state.street,
    state.house,
    state.apartment,
  ]);

  const visibleCarriers = React.useMemo(() => {
    if (!state.city.trim()) return [];
    return carriers.filter(
      (c) => c.value !== "yandex-express" || state.city.trim().toLowerCase() === "москва"
    );
  }, [state.city]);

  const visiblePayments = React.useMemo(() => {
    if (state.carrier === "yandex-express") {
      const allowed = new Set(["sbp", "prepay", "prepay-requisites"]);
      return payments.filter((p) => allowed.has(p.value));
    }
    return payments;
  }, [state.carrier]);

  React.useEffect(() => {
    if (!open) return;
    setDragOffset({ x: 0, y: 0 });
    dispatch({ type: "RESET_ON_OPEN" });
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const move = (event: MouseEvent) => {
      if (!dragRef.current.dragging) return;
      const dx = event.clientX - dragRef.current.startX;
      const dy = event.clientY - dragRef.current.startY;
      setDragOffset({ x: dragRef.current.baseX + dx, y: dragRef.current.baseY + dy });
    };
    const stop = () => {
      dragRef.current.dragging = false;
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const node = modalBodyRef.current;
    if (!node) return;

    const getFocusable = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));

    const focusFirst = () => {
      const focusable = getFocusable();
      const target = focusable[0] ?? node;
      target.focus();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || active === node) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    focusFirst();
    node.addEventListener("keydown", handleKeyDown);
    return () => node.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!state.pvzOpen) return;
    const node = pvzBodyRef.current;
    if (!node) return;

    const getFocusable = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));

    const focusFirst = () => {
      const focusable = getFocusable();
      const target = focusable[0] ?? node;
      target.focus();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setValue("pvzOpen", false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || active === node) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    focusFirst();
    node.addEventListener("keydown", handleKeyDown);
    return () => node.removeEventListener("keydown", handleKeyDown);
  }, [state.pvzOpen]);

  React.useEffect(() => {
    if (state.source) setValue("sourceError", false);
  }, [state.source]);

  React.useEffect(() => {
    if (!isAddressEmpty) setValue("addressError", false);
  }, [isAddressEmpty]);

  React.useEffect(() => {
    if (!visibleCarriers.length) return;
    if (!visibleCarriers.find((c) => c.value === state.carrier)) {
      setValue("carrier", visibleCarriers[0].value);
    }
  }, [visibleCarriers, state.carrier]);

  React.useEffect(() => {
    if (!visiblePayments.find((p) => p.value === state.payment)) {
      setValue("payment", visiblePayments[0]?.value ?? "sbp");
    }
  }, [visiblePayments, state.payment]);

  const handleDragStart = (event: React.MouseEvent) => {
    dragRef.current.dragging = true;
    dragRef.current.startX = event.clientX;
    dragRef.current.startY = event.clientY;
    dragRef.current.baseX = dragOffset.x;
    dragRef.current.baseY = dragOffset.y;
  };

  const updateItem = (id: string, updater: (item: OrderItem) => OrderItem) => {
    onItemsChange(items.map((item) => (item.id === id ? updater(item) : item)));
  };

  const removeItem = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  const setStepSafe = (step: 1 | 2 | 3) => {
    if (step === 2 || step === 3) {
      if (!state.source) {
        setValue("sourceError", true);
        setValue("activeStep", 1);
        return;
      }
    }
    if (step === 3 && isAddressEmpty) {
      setValue("addressError", true);
      setValue("activeStep", 2);
      return;
    }
    setValue("activeStep", step);
  };

  const filteredPvz = pvzList.filter((item) => {
    const q = state.pvzSearch.trim().toLowerCase();
    if (!q) return true;
    return item.name.toLowerCase().includes(q) || item.address.toLowerCase().includes(q);
  });

  if (!open) return null;

  const summaryCard = (
    <OrderSummaryCard
      totalItems={totalItems}
      itemsAmount={itemsAmount}
      deliveryPrice={deliveryPrice}
      totalWithDelivery={totalWithDelivery}
      formatCurrency={formatCurrency}
    />
  );

  return (
    <div className="wcc-modal wcc-orderModal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="wcc-modal__backdrop" />
      <div
        className="wcc-modal__body wcc-orderModal__body"
        ref={modalBodyRef}
        tabIndex={-1}
        style={{
          transform: `translate(-50%, -50%) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
        }}
      >
        <div className="wcc-orderModal__head" onMouseDown={handleDragStart}>
          <div>
            <div className="wcc-orderModal__title" id={titleId}>
              Оформление заказа
            </div>
            <div className="wcc-orderModal__subtitle">Черновик интерфейса — наполним позже.</div>
          </div>
          <button className="wcc-orderModal__close" type="button" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>

        <div className="wcc-orderModal__steps">
          {[1, 2, 3].map((step) => (
            <button
              key={step}
              className={`wcc-stepIndicator ${state.activeStep === step ? "wcc-stepIndicator--active" : ""}`}
              type="button"
              onClick={() => setStepSafe(step as 1 | 2 | 3)}
            >
              <span className="wcc-stepIndicator__num">{step}</span>
              <span className="wcc-stepIndicator__label">
                {step === 1 ? "Товары" : step === 2 ? "Адрес и доставка" : "Способ оплаты"}
              </span>
            </button>
          ))}
        </div>

        {state.activeStep === 1 && (
          <div className="wcc-orderModal__content">
            <OrderStepItems
              items={items}
              itemsAmount={itemsAmount}
              totalWithoutDelivery={totalWithoutDelivery}
              source={state.source}
              sourceError={state.sourceError}
              orderComment={state.orderComment}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
              onSourceChange={(value) => setValue("source", value)}
              onOrderCommentChange={(value) => setValue("orderComment", value)}
              onNext={() => setStepSafe(2)}
              formatCurrency={formatCurrency}
            />
            {summaryCard}
          </div>
        )}

        {state.activeStep === 2 && (
          <div className="wcc-orderModal__content">
            <OrderStepDelivery
              fullName={state.fullName}
              phone={state.phone}
              country={state.country}
              region={state.region}
              postalCode={state.postalCode}
              city={state.city}
              street={state.street}
              house={state.house}
              apartment={state.apartment}
              carrier={state.carrier}
              deliveryDate={state.deliveryDate}
              deliveryTime={state.deliveryTime}
              deliveryDeferral={state.deliveryDeferral}
              carrierComment={state.carrierComment}
              addressError={state.addressError}
              visibleCarriers={visibleCarriers}
              pvzEnabled={pvzCarriers.includes(state.carrier as (typeof pvzCarriers)[number])}
              onOpenPvz={() => setValue("pvzOpen", true)}
              onChange={(key, value) => setValue(key as keyof OrderFormState, value)}
              onChangeNumber={(key, value) => setValue(key as keyof OrderFormState, value)}
              onCarrierChange={(value) => setValue("carrier", value)}
              onBack={() => setStepSafe(1)}
              onNext={() => setStepSafe(3)}
            />
            {summaryCard}
          </div>
        )}

        {state.activeStep === 3 && (
          <div className="wcc-orderModal__content">
            <OrderStepPayment
              payment={state.payment}
              visiblePayments={visiblePayments}
              finalMessage={state.finalMessage}
              onPaymentChange={(value) => setValue("payment", value)}
              onBack={() => setStepSafe(2)}
              onConfirm={() => setValue("finalMessage", true)}
            />
            {summaryCard}
          </div>
        )}
      </div>

      {state.pvzOpen && (
        <div className="wcc-modal wcc-orderSubModal" role="dialog" aria-modal="true" aria-label="Выбор ПВЗ">
          <div className="wcc-modal__backdrop" onClick={() => setValue("pvzOpen", false)} />
          <div className="wcc-modal__body wcc-orderSubModal__body" ref={pvzBodyRef} tabIndex={-1}>
            <div className="wcc-orderSubModal__head">
              <div>Выбор точки доставки</div>
              <button className="wcc-orderModal__close" type="button" onClick={() => setValue("pvzOpen", false)}>
                ×
              </button>
            </div>
            <div className="wcc-subTabs">
              <button
                className={`wcc-subTab ${state.pvzTab === "addresses" ? "is-active" : ""}`}
                type="button"
                onClick={() => setValue("pvzTab", "addresses")}
              >
                Список адресов
              </button>
              <button
                className={`wcc-subTab ${state.pvzTab === "map" ? "is-active" : ""}`}
                type="button"
                onClick={() => setValue("pvzTab", "map")}
              >
                Карта
              </button>
            </div>
            {state.pvzTab === "addresses" && (
              <>
                <input
                  className="wcc-input"
                  placeholder="Поиск по адресу..."
                  value={state.pvzSearch}
                  onChange={(e) => setValue("pvzSearch", e.target.value)}
                />
                <div className="wcc-pvzList">
                  {filteredPvz.map((item) => (
                    <label key={item.id} className="wcc-pvzItem">
                      <input
                        type="radio"
                        name="pvz"
                        checked={state.selectedPvz === item.id}
                        onChange={() => setValue("selectedPvz", item.id)}
                      />
                      <div>
                        <div className="wcc-pvzItem__name">{item.name}</div>
                        <div className="wcc-pvzItem__meta">{item.address}</div>
                        <div className="wcc-pvzItem__meta">{item.time}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </>
            )}
            {state.pvzTab === "map" && (
              <div className="wcc-pvzMap">
                Очень красивая и подробная карта
                <span>г. {state.city || "Не указан"}</span>
              </div>
            )}
            <div className="wcc-orderSubModal__actions">
              <button className="wcc-action-btn" type="button" onClick={() => setValue("pvzOpen", false)}>
                Отменить
              </button>
              <button
                className="wcc-action-btn wcc-action-btn--primary"
                type="button"
                onClick={() => setValue("pvzOpen", false)}
                disabled={!state.selectedPvz}
              >
                Подтвердить выбор
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
