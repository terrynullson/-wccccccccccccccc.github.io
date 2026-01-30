type PaymentOption = {
  value: string;
  label: string;
};

type Props = {
  payment: string;
  visiblePayments: ReadonlyArray<PaymentOption>;
  finalMessage: boolean;
  onPaymentChange: (value: string) => void;
  onBack: () => void;
  onConfirm: () => void;
};

export function OrderStepPayment({
  payment,
  visiblePayments,
  finalMessage,
  onPaymentChange,
  onBack,
  onConfirm,
}: Props) {
  return (
    <>
      <div className="wcc-orderModal__card">
        <div className="wcc-orderModal__section">
          <div className="wcc-orderModal__sectionTitle">Способ оплаты</div>
          <div className="wcc-options">
            {visiblePayments.map((option) => (
              <label key={option.value} className="wcc-option">
                <input
                  type="radio"
                  name="payment"
                  checked={payment === option.value}
                  onChange={() => onPaymentChange(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="wcc-orderModal__actions wcc-orderModal__actions--between">
        <button className="wcc-arrowBtn" type="button" onClick={onBack}>
          ←
        </button>
        <button className="wcc-action-btn wcc-action-btn--primary" type="button" onClick={onConfirm}>
          Подтвердить заказ
        </button>
      </div>

      {finalMessage && (
        <div className="wcc-orderModal__message">
          Заказ успешно оформлен (демо)! Данные никуда не отправляются, это только наглядный пример интерфейса.
        </div>
      )}
    </>
  );
}
