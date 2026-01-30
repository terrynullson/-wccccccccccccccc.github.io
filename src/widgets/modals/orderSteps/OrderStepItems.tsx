import type { OrderItem } from "../OrderModal";

type Props = {
  items: OrderItem[];
  itemsAmount: number;
  totalWithoutDelivery: number;
  source: string;
  sourceError: boolean;
  orderComment: string;
  onUpdateItem: (id: string, updater: (item: OrderItem) => OrderItem) => void;
  onRemoveItem: (id: string) => void;
  onSourceChange: (value: string) => void;
  onOrderCommentChange: (value: string) => void;
  onNext: () => void;
  formatCurrency: (value: number) => string;
};

export function OrderStepItems({
  items,
  itemsAmount,
  totalWithoutDelivery,
  source,
  sourceError,
  orderComment,
  onUpdateItem,
  onRemoveItem,
  onSourceChange,
  onOrderCommentChange,
  onNext,
  formatCurrency,
}: Props) {
  return (
    <div className="wcc-orderModal__card">
      <div className="wcc-orderModal__section">
        <div className="wcc-orderModal__sectionTitle">Корзина</div>
        <div className="wcc-orderModal__list">
          {items.map((item) => (
            <div key={item.id} className="wcc-orderItem">
              <div>
                <div className="wcc-orderItem__title">{item.title}</div>
                <div className="wcc-orderItem__meta">{item.meta}</div>
              </div>
              <div className="wcc-orderItem__qty">
                <button
                  type="button"
                  className="wcc-orderItem__qtyBtn"
                  onClick={() =>
                    onUpdateItem(item.id, (it) => ({
                      ...it,
                      quantity: Math.max(1, (it.quantity || 1) - 1),
                    }))
                  }
                >
                  −
                </button>
                <span>{item.quantity || 1}</span>
                <button
                  type="button"
                  className="wcc-orderItem__qtyBtn"
                  onClick={() =>
                    onUpdateItem(item.id, (it) => ({
                      ...it,
                      quantity: (it.quantity || 1) + 1,
                    }))
                  }
                >
                  +
                </button>
              </div>
              <div className="wcc-orderItem__price">{formatCurrency(item.price * (item.quantity || 1))}</div>
              <button className="wcc-orderItem__remove" type="button" onClick={() => onRemoveItem(item.id)}>
                Убрать
              </button>
            </div>
          ))}
        </div>
        <div className="wcc-orderSummary">
          <div className="wcc-orderSummary__row">
            <span>Товары</span>
            <span>{formatCurrency(itemsAmount)}</span>
          </div>
          <div className="wcc-orderSummary__row wcc-orderSummary__row--total">
            <span>Сумма заказа</span>
            <span>{formatCurrency(totalWithoutDelivery)}</span>
          </div>
        </div>
      </div>

      <div className="wcc-orderModal__section">
        <div className="wcc-orderModal__sectionTitle">Источник</div>
        <select className="wcc-input" value={source} onChange={(e) => onSourceChange(e.target.value)}>
          <option value="">Выберите источник</option>
          <option value="one">Источник один</option>
          <option value="two">Источник два</option>
          <option value="three">Источник три</option>
        </select>
        {sourceError && (
          <div className="wcc-error">Пожалуйста, выберите источник перед переходом к следующему этапу.</div>
        )}
      </div>

      <div className="wcc-orderModal__section">
        <textarea
          className="wcc-input wcc-input--textarea"
          rows={3}
          placeholder="Комментарий к заказу"
          value={orderComment}
          onChange={(e) => onOrderCommentChange(e.target.value)}
        />
      </div>

      <div className="wcc-orderModal__actions wcc-orderModal__actions--between">
        <div />
        <button className="wcc-arrowBtn" type="button" onClick={onNext}>
          →
        </button>
      </div>
    </div>
  );
}
