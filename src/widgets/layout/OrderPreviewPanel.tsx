import React from "react";
import type { OrderItem } from "../../data/order";
import "./appShell.css";

type Props = {
  items: OrderItem[];
  crossSell: Record<string, boolean>;
  onToggleCrossSell: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onOpenOrder: () => void;
};

export const OrderPreviewPanel = React.memo(function OrderPreviewPanel({
  items,
  crossSell,
  onToggleCrossSell,
  onUpdateQty,
  onOpenOrder,
}: Props) {
  const lotHeight = 78;
  const lotGap = 10;
  const minLotsHeight = lotHeight;
  const maxLotsHeight =
    items.length > 0 ? items.length * lotHeight + (items.length - 1) * lotGap : minLotsHeight;
  const panelRef = React.useRef<HTMLElement | null>(null);
  const lotsWrapRef = React.useRef<HTMLDivElement | null>(null);
  const dragState = React.useRef<{ startY: number; startH: number } | null>(null);
  const [panelHeight, setPanelHeight] = React.useState<number>(() => minLotsHeight + 110);
  const [minPanelHeight, setMinPanelHeight] = React.useState<number>(() => minLotsHeight + 110);
  const [maxPanelHeight, setMaxPanelHeight] = React.useState<number>(() => minLotsHeight + 110);
  const [lotsScrollable, setLotsScrollable] = React.useState<boolean>(true);

  React.useLayoutEffect(() => {
    const panel = panelRef.current;
    const lotsWrap = lotsWrapRef.current;
    if (!panel || !lotsWrap) return;
    const prevHeight = panel.style.height;
    panel.style.height = "auto";
    const panelRect = panel.getBoundingClientRect();
    const lotsRect = lotsWrap.getBoundingClientRect();
    panel.style.height = prevHeight;
    const chrome = Math.max(0, panelRect.height - lotsRect.height);
    const maxHeight = chrome + lotsWrap.scrollHeight;
    const minHeight = chrome + minLotsHeight;
    setMinPanelHeight(minHeight);
    setMaxPanelHeight(maxHeight);
    setPanelHeight((prev) => {
      if (prev < minHeight) return minHeight;
      if (prev > maxHeight) return maxHeight;
      return prev;
    });
  }, [items.length, maxLotsHeight, minLotsHeight]);

  React.useEffect(() => {
    if (!panelRef.current || !lotsWrapRef.current) return;
    const maxHeight = maxPanelHeight;
    setLotsScrollable(panelHeight < maxHeight - 1);
  }, [panelHeight, maxPanelHeight]);

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!panelRef.current) return;
    dragState.current = {
      startY: event.clientY,
      startH: panelRef.current.getBoundingClientRect().height,
    };
    window.addEventListener("pointermove", handleDrag);
    window.addEventListener("pointerup", stopDrag);
    window.addEventListener("pointercancel", stopDrag);
  };

  const handleDrag = (event: PointerEvent) => {
    const panel = panelRef.current;
    const state = dragState.current;
    if (!panel || !state) return;
    const next = Math.min(
      maxPanelHeight,
      Math.max(minPanelHeight, state.startH + (event.clientY - state.startY))
    );
    setPanelHeight(next);
  };

  const stopDrag = () => {
    dragState.current = null;
    window.removeEventListener("pointermove", handleDrag);
    window.removeEventListener("pointerup", stopDrag);
    window.removeEventListener("pointercancel", stopDrag);
  };

  return (
    <section
      className="wcc-panel wcc-panel--order"
      ref={panelRef}
      style={{
        minHeight: `${minPanelHeight}px`,
        maxHeight: `${maxPanelHeight}px`,
        height: `${panelHeight}px`,
      }}
    >
      <div className="wcc-panel__head">Оформление заказа</div>
      <div className="wcc-panel__body wcc-muted">
        {items.length === 0 ? (
          "Добавьте товары, чтобы начать оформление."
        ) : (
          <div
            className="wcc-orderLotsWrap"
            ref={lotsWrapRef}
            style={{ overflowY: lotsScrollable ? "auto" : "hidden" }}
          >
            <div className="wcc-orderLots">
              {items.map((item, index) => (
                <div key={item.id} className="wcc-orderLot">
                  <div className="wcc-orderLot__media">
                    <div className="wcc-orderLot__thumb" />
                    <span className="wcc-orderLot__index">{index + 1}</span>
                  </div>
                  <div className="wcc-orderLot__info">
                    <div className="wcc-orderLot__title">{item.title}</div>
                    <div className="wcc-orderLot__meta">{item.meta}</div>
                    <label className="wcc-orderLot__cross">
                      <input
                        type="checkbox"
                        checked={Boolean(crossSell[item.id])}
                        onChange={() => onToggleCrossSell(item.id)}
                      />
                      <span>Кросс продажа</span>
                    </label>
                  </div>
                  <div className="wcc-orderLot__qty">
                    <div className="wcc-orderLot__qtyLabel">Кол-во</div>
                    <div className="wcc-orderLot__qtyControl">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, -1)}
                        aria-label="Уменьшить количество"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, 1)}
                        aria-label="Увеличить количество"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="wcc-orderLot__price">
                    {item.price.toLocaleString("ru-RU")} ₽
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="wcc-panel__actions wcc-panel__actions--sticky">
        <button
          className="wcc-action-btn wcc-action-btn--order"
          type="button"
          onClick={onOpenOrder}
        >
          Оформить
        </button>
      </div>
      <div
        className="wcc-panel__resize"
        role="separator"
        aria-orientation="horizontal"
        onPointerDown={startDrag}
        onDoubleClick={() => setPanelHeight(maxPanelHeight)}
      />
    </section>
  );
});
