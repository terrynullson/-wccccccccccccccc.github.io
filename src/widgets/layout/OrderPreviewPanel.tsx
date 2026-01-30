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
  return (
    <section className="wcc-panel wcc-panel--order">
      <div className="wcc-panel__head">Оформление заказа</div>
      <div className="wcc-panel__body wcc-muted">
        {items.length === 0 ? (
          "Добавьте товары, чтобы начать оформление."
        ) : (
          <div className="wcc-orderLotsWrap">
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
    </section>
  );
});
