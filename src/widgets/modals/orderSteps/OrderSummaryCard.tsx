type Props = {
  totalItems: number;
  itemsAmount: number;
  deliveryPrice: number;
  totalWithDelivery: number;
  formatCurrency: (value: number) => string;
};

export function OrderSummaryCard({
  totalItems,
  itemsAmount,
  deliveryPrice,
  totalWithDelivery,
  formatCurrency,
}: Props) {
  return (
    <div className="wcc-orderModal__card wcc-orderModal__card--summary">
      <div className="wcc-orderModal__sectionTitle">Итого</div>
      <div className="wcc-orderModal__summary">
        <div className="wcc-orderModal__summaryRow">
          <span>Состав заказа</span>
          <span>{totalItems === 0 ? "нет позиций" : `${totalItems} товаров`}</span>
        </div>
        <div className="wcc-orderModal__summaryRow">
          <span>Сумма товаров</span>
          <span>{formatCurrency(itemsAmount)}</span>
        </div>
        <div className="wcc-orderModal__summaryRow">
          <span>Доставка</span>
          <span>{formatCurrency(deliveryPrice)}</span>
        </div>
        <div className="wcc-orderModal__summaryRow wcc-orderModal__summaryRow--total">
          <span>Итого к оплате</span>
          <span>{formatCurrency(totalWithDelivery)}</span>
        </div>
      </div>
    </div>
  );
}
