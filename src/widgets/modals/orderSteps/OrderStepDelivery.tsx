type CarrierOption = {
  value: string;
  label: string;
};

type Props = {
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
  addressError: boolean;
  visibleCarriers: CarrierOption[];
  pvzEnabled: boolean;
  onOpenPvz: () => void;
  onChange: (key: string, value: string) => void;
  onChangeNumber: (key: string, value: number) => void;
  onCarrierChange: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function OrderStepDelivery({
  fullName,
  phone,
  country,
  region,
  postalCode,
  city,
  street,
  house,
  apartment,
  carrier,
  deliveryDate,
  deliveryTime,
  deliveryDeferral,
  carrierComment,
  addressError,
  visibleCarriers,
  pvzEnabled,
  onOpenPvz,
  onChange,
  onChangeNumber,
  onCarrierChange,
  onBack,
  onNext,
}: Props) {
  return (
    <div className="wcc-orderModal__card">
      <div className="wcc-orderModal__section">
        <div className="wcc-grid wcc-grid--2">
          <div className="wcc-field">
            <label>ФИО получателя</label>
            <input className="wcc-input" value={fullName} onChange={(e) => onChange("fullName", e.target.value)} />
          </div>
          <div className="wcc-field">
            <label>Телефон</label>
            <input className="wcc-input" value={phone} onChange={(e) => onChange("phone", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="wcc-orderModal__section">
        <div className="wcc-grid wcc-grid--3">
          <div className="wcc-field">
            <label>Страна</label>
            <input className="wcc-input" value={country} onChange={(e) => onChange("country", e.target.value)} />
          </div>
          <div className="wcc-field">
            <label>Регион</label>
            <input className="wcc-input" value={region} onChange={(e) => onChange("region", e.target.value)} />
          </div>
          <div className="wcc-field">
            <label>Индекс</label>
            <input className="wcc-input" value={postalCode} onChange={(e) => onChange("postalCode", e.target.value)} />
          </div>
        </div>
        <div className="wcc-field">
          <label>Город</label>
          <input className="wcc-input" value={city} onChange={(e) => onChange("city", e.target.value)} />
        </div>
        <div className="wcc-field">
          <label>Улица</label>
          <input className="wcc-input" value={street} onChange={(e) => onChange("street", e.target.value)} />
        </div>
        <div className="wcc-grid wcc-grid--2">
          <div className="wcc-field">
            <label>Дом / корпус</label>
            <input className="wcc-input" value={house} onChange={(e) => onChange("house", e.target.value)} />
          </div>
          <div className="wcc-field">
            <label>Квартира</label>
            <input className="wcc-input" value={apartment} onChange={(e) => onChange("apartment", e.target.value)} />
          </div>
        </div>
        {addressError && (
          <div className="wcc-error">Пожалуйста, заполните данные адреса и доставки перед переходом к оплате.</div>
        )}
      </div>

      <div className="wcc-orderModal__section">
        <div className="wcc-orderModal__sectionTitle">Перевозчик</div>
        <div className="wcc-options">
          {visibleCarriers.map((option) => (
            <label key={option.value} className="wcc-option">
              <input
                type="radio"
                name="carrier"
                checked={carrier === option.value}
                onChange={() => onCarrierChange(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>

        {pvzEnabled && (
          <button className="wcc-secondaryBtn" type="button" onClick={onOpenPvz}>
            Выбрать точку доставки (ПВЗ)
          </button>
        )}

        {city.trim() && (
          <div className="wcc-grid wcc-grid--2 wcc-grid--gap-sm">
            <input
              className="wcc-input"
              type="date"
              value={deliveryDate}
              onChange={(e) => onChange("deliveryDate", e.target.value)}
            />
            <select
              className="wcc-input"
              value={deliveryTime}
              onChange={(e) => onChange("deliveryTime", e.target.value)}
            >
              <option value="">Выберите время</option>
              <option value="09:00-12:00">09:00 - 12:00</option>
              <option value="12:00-15:00">12:00 - 15:00</option>
              <option value="15:00-18:00">15:00 - 18:00</option>
              <option value="18:00-21:00">18:00 - 21:00</option>
            </select>
          </div>
        )}

        {city.trim() && (
          <div className="wcc-field wcc-field--inline">
            <label>Отсрочка сбора (дни)</label>
            <input
              className="wcc-input wcc-input--small"
              type="number"
              value={deliveryDeferral}
              min={0}
              max={30}
              onChange={(e) => onChangeNumber("deliveryDeferral", Number(e.target.value))}
            />
          </div>
        )}
      </div>

      <div className="wcc-orderModal__section">
        <textarea
          className="wcc-input wcc-input--textarea"
          rows={3}
          placeholder="Комментарий для перевозчика"
          value={carrierComment}
          onChange={(e) => onChange("carrierComment", e.target.value)}
        />
      </div>

      <div className="wcc-orderModal__actions wcc-orderModal__actions--between">
        <button className="wcc-arrowBtn" type="button" onClick={onBack}>
          ←
        </button>
        <button className="wcc-arrowBtn" type="button" onClick={onNext}>
          →
        </button>
      </div>
    </div>
  );
}
