
import React from "react";
import "./modalBase.css";
import "./orderModal.css";

export type OrderItem = {
  id: string;
  title: string;
  meta?: string;
  price: number;
  quantity: number;
};

type OrderModalProps = {
  open: boolean;
  items: OrderItem[];
  onItemsChange: (items: OrderItem[]) => void;
  onClose: () => void;
};

const deliveryPrices: Record<string, number> = {
  logsis: 200,
  integral: 150,
  cdek: 350,
  dalli: 250,
  uvi: 300,
  "yandex-express": 500,
};

const pvzCarriers = ["cdek", "integral", "dalli"];


const carriers = [
  { value: "logsis", label: "Логсис" },
  { value: "integral", label: "Интеграл" },
  { value: "cdek", label: "СДЭК" },
  { value: "dalli", label: "Далли" },
  { value: "uvi", label: "Доставка ЮВИ" },
  { value: "yandex-express", label: "Яндекс.Экспресс" },
];

const payments = [
  { value: "sbp", label: "СБП" },
  { value: "prepay", label: "Предоплата" },
  { value: "prepay-requisites", label: "Предоплата по реквизитам" },
  { value: "postpay", label: "Постоплата" },
  { value: "yandex-split", label: "Яндекс Сплит" },
  { value: "tinkoff-parts", label: "Тинькофф Долями" },
];

const pvzList = [
  {
    id: "pvz-1",
    name: "ПВЗ №1 - Центр города",
    address: "ул. Главная, дом 1",
    time: "Пн-Пт: 09:00-20:00, Сб-Вс: 10:00-18:00",
  },
  {
    id: "pvz-2",
    name: "ПВЗ №2 - Восток",
    address: "пр. Восточный, дом 50",
    time: "Пн-Пт: 10:00-21:00, Сб-Вс: 11:00-19:00",
  },
  {
    id: "pvz-3",
    name: "ПВЗ №3 - Запад",
    address: "ул. Западная, дом 100",
    time: "Пн-Вс: 08:00-22:00",
  },
];

function formatCurrency(value: number) {
  return value.toLocaleString("ru-RU") + " ₽";
}

export function OrderModal({ open, items, onItemsChange, onClose }: OrderModalProps) {
  const [activeStep, setActiveStep] = React.useState<1 | 2 | 3>(1);
  const [source, setSource] = React.useState("");
  const [sourceError, setSourceError] = React.useState(false);
  const [addressError, setAddressError] = React.useState(false);
  const [orderComment, setOrderComment] = React.useState("");

  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [region, setRegion] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");
  const [city, setCity] = React.useState("");
  const [street, setStreet] = React.useState("");
  const [house, setHouse] = React.useState("");
  const [apartment, setApartment] = React.useState("");
  const [carrier, setCarrier] = React.useState("logsis");
  const [deliveryDate, setDeliveryDate] = React.useState("");
  const [deliveryTime, setDeliveryTime] = React.useState("");
  const [deliveryDeferral, setDeliveryDeferral] = React.useState(0);
  const [carrierComment, setCarrierComment] = React.useState("");

  const [payment, setPayment] = React.useState("sbp");
  const [finalMessage, setFinalMessage] = React.useState(false);

  const [pvzOpen, setPvzOpen] = React.useState(false);
  const [pvzTab, setPvzTab] = React.useState<"addresses" | "map">("addresses");
  const [pvzSearch, setPvzSearch] = React.useState("");
  const [selectedPvz, setSelectedPvz] = React.useState<string | null>(null);

  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
  const dragRef = React.useRef({ dragging: false, startX: 0, startY: 0, baseX: 0, baseY: 0 });
  const modalBodyRef = React.useRef<HTMLDivElement | null>(null);
  const pvzBodyRef = React.useRef<HTMLDivElement | null>(null);
  const titleId = "wcc-order-modal-title";

  const itemsAmount = React.useMemo(
    () => items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
    [items]
  );

  const deliveryPrice = deliveryPrices[carrier] ?? 0;
  const totalWithoutDelivery = Math.max(0, itemsAmount);
  const totalWithDelivery = totalWithoutDelivery + deliveryPrice;

  const totalItems = React.useMemo(
    () => items.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [items]
  );

  const visibleCarriers = React.useMemo(() => {
    if (!city.trim()) return [];
    return carriers.filter((c) => c.value !== "yandex-express" || city.trim().toLowerCase() === "москва");
  }, [city]);

  const visiblePayments = React.useMemo(() => {
    if (carrier === "yandex-express") {
      const allowed = new Set(["sbp", "prepay", "prepay-requisites"]);
      return payments.filter((p) => allowed.has(p.value));
    }
    return payments;
  }, [carrier]);
  React.useEffect(() => {
    if (!open) return;
    setDragOffset({ x: 0, y: 0 });
    setActiveStep(1);
    setFinalMessage(false);
    setSourceError(false);
    setAddressError(false);
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
    if (!pvzOpen) return;
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
        setPvzOpen(false);
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
  }, [pvzOpen]);

  React.useEffect(() => {
    if (!visibleCarriers.length) return;
    if (!visibleCarriers.find((c) => c.value === carrier)) {
      setCarrier(visibleCarriers[0].value);
    }
  }, [visibleCarriers, carrier]);

  React.useEffect(() => {
    if (!visiblePayments.find((p) => p.value === payment)) {
      setPayment(visiblePayments[0]?.value ?? "sbp");
    }
  }, [visiblePayments, payment]);

  React.useEffect(() => {
    if (source) setSourceError(false);
  }, [source]);

  React.useEffect(() => {
    const empty =
      !fullName.trim() &&
      !phone.trim() &&
      !postalCode.trim() &&
      !country.trim() &&
      !region.trim() &&
      !city.trim() &&
      !street.trim() &&
      !house.trim() &&
      !apartment.trim();
    if (!empty) setAddressError(false);
  }, [
    fullName,
    phone,
    postalCode,
    country,
    region,
    city,
    street,
    house,
    apartment,
  ]);

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


  const isAddressEmpty =
    !fullName.trim() &&
    !phone.trim() &&
    !postalCode.trim() &&
    !country.trim() &&
    !region.trim() &&
    !city.trim() &&
    !street.trim() &&
    !house.trim() &&
    !apartment.trim();

  const setStepSafe = (step: 1 | 2 | 3) => {
    if (step === 2 || step === 3) {
      if (!source) {
        setSourceError(true);
        setActiveStep(1);
        return;
      }
    }
    if (step === 3 && isAddressEmpty) {
      setAddressError(true);
      setActiveStep(2);
      return;
    }
    setActiveStep(step);
  };

  const filteredPvz = pvzList.filter((item) => {
    const q = pvzSearch.trim().toLowerCase();
    if (!q) return true;
    return item.name.toLowerCase().includes(q) || item.address.toLowerCase().includes(q);
  });

  if (!open) return null;

  const summaryCard = (
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
  return (
    <div
      className="wcc-modal wcc-orderModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
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
            <div className="wcc-orderModal__title" id={titleId}>Оформление заказа</div>
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
              className={`wcc-stepIndicator ${activeStep === step ? "wcc-stepIndicator--active" : ""}`}
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

        {activeStep === 1 && (
          <div className="wcc-orderModal__content">
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
                            updateItem(item.id, (it) => ({
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
                            updateItem(item.id, (it) => ({
                              ...it,
                              quantity: (it.quantity || 1) + 1,
                            }))
                          }
                        >
                          +
                        </button>
                      </div>
                      <div className="wcc-orderItem__price">{formatCurrency(item.price * (item.quantity || 1))}</div>
                      <button className="wcc-orderItem__remove" type="button" onClick={() => removeItem(item.id)}>
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
                <select className="wcc-input" value={source} onChange={(e) => setSource(e.target.value)}>
                  <option value="">Выберите источник</option>
                  <option value="one">Источник один</option>
                  <option value="two">Источник два</option>
                  <option value="three">Источник три</option>
                </select>
                {sourceError && <div className="wcc-error">Пожалуйста, выберите источник перед переходом к следующему этапу.</div>}
              </div>

              <div className="wcc-orderModal__section">
                <textarea
                  className="wcc-input wcc-input--textarea"
                  rows={3}
                  placeholder="Комментарий к заказу"
                  value={orderComment}
                  onChange={(e) => setOrderComment(e.target.value)}
                />
              </div>

              <div className="wcc-orderModal__actions wcc-orderModal__actions--between">
                <div />
                <button className="wcc-arrowBtn" type="button" onClick={() => setStepSafe(2)}>
                  →
                </button>
              </div>
            </div>
            {summaryCard}
          </div>
        )}
        {activeStep === 2 && (
          <div className="wcc-orderModal__content">
            <div className="wcc-orderModal__card">
              <div className="wcc-orderModal__section">
                <div className="wcc-grid wcc-grid--2">
                  <div className="wcc-field">
                    <label>ФИО получателя</label>
                    <input className="wcc-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div className="wcc-field">
                    <label>Телефон</label>
                    <input className="wcc-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="wcc-orderModal__section">
                <div className="wcc-grid wcc-grid--3">
                  <div className="wcc-field">
                    <label>Страна</label>
                    <input className="wcc-input" value={country} onChange={(e) => setCountry(e.target.value)} />
                  </div>
                  <div className="wcc-field">
                    <label>Регион</label>
                    <input className="wcc-input" value={region} onChange={(e) => setRegion(e.target.value)} />
                  </div>
                  <div className="wcc-field">
                    <label>Индекс</label>
                    <input className="wcc-input" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                  </div>
                </div>
                <div className="wcc-field">
                  <label>Город</label>
                  <input className="wcc-input" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="wcc-field">
                  <label>Улица</label>
                  <input className="wcc-input" value={street} onChange={(e) => setStreet(e.target.value)} />
                </div>
                <div className="wcc-grid wcc-grid--2">
                  <div className="wcc-field">
                    <label>Дом / корпус</label>
                    <input className="wcc-input" value={house} onChange={(e) => setHouse(e.target.value)} />
                  </div>
                  <div className="wcc-field">
                    <label>Квартира</label>
                    <input className="wcc-input" value={apartment} onChange={(e) => setApartment(e.target.value)} />
                  </div>
                </div>
                {addressError && (
                  <div className="wcc-error">
                    Пожалуйста, заполните данные адреса и доставки перед переходом к оплате.
                  </div>
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
                        onChange={() => setCarrier(option.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>

                {pvzCarriers.includes(carrier) && (
                  <button className="wcc-secondaryBtn" type="button" onClick={() => setPvzOpen(true)}>
                    Выбрать точку доставки (ПВЗ)
                  </button>
                )}

                {city.trim() && (
                  <div className="wcc-grid wcc-grid--2 wcc-grid--gap-sm">
                    <input
                      className="wcc-input"
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                    />
                    <select
                      className="wcc-input"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
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
                      onChange={(e) => setDeliveryDeferral(Number(e.target.value))}
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
                  onChange={(e) => setCarrierComment(e.target.value)}
                />
              </div>

              <div className="wcc-orderModal__actions wcc-orderModal__actions--between">
                <button className="wcc-arrowBtn" type="button" onClick={() => setStepSafe(1)}>
                  ←
                </button>
                <button className="wcc-arrowBtn" type="button" onClick={() => setStepSafe(3)}>
                  →
                </button>
              </div>
            </div>
            {summaryCard}
          </div>
        )}

        {activeStep === 3 && (
          <div className="wcc-orderModal__content">
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
                        onChange={() => setPayment(option.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            {summaryCard}

            <div className="wcc-orderModal__actions wcc-orderModal__actions--between">
              <button className="wcc-arrowBtn" type="button" onClick={() => setStepSafe(2)}>
                ←
              </button>
              <button
                className="wcc-action-btn wcc-action-btn--primary"
                type="button"
                onClick={() => setFinalMessage(true)}
              >
                Подтвердить заказ
              </button>
            </div>

            {finalMessage && (
              <div className="wcc-orderModal__message">
                Заказ успешно оформлен (демо)! Данные никуда не отправляются, это только наглядный пример интерфейса.
              </div>
            )}
          </div>
        )}
      </div>

      {pvzOpen && (
        <div className="wcc-modal wcc-orderSubModal" role="dialog" aria-modal="true" aria-label="Выбор ПВЗ">
          <div className="wcc-modal__backdrop" onClick={() => setPvzOpen(false)} />
          <div className="wcc-modal__body wcc-orderSubModal__body" ref={pvzBodyRef} tabIndex={-1}>
            <div className="wcc-orderSubModal__head">
              <div>Выбор точки доставки</div>
              <button className="wcc-orderModal__close" type="button" onClick={() => setPvzOpen(false)}>
                ×
              </button>
            </div>
            <div className="wcc-subTabs">
              <button
                className={`wcc-subTab ${pvzTab === "addresses" ? "is-active" : ""}`}
                type="button"
                onClick={() => setPvzTab("addresses")}
              >
                Список адресов
              </button>
              <button
                className={`wcc-subTab ${pvzTab === "map" ? "is-active" : ""}`}
                type="button"
                onClick={() => setPvzTab("map")}
              >
                Карта
              </button>
            </div>
            {pvzTab === "addresses" && (
              <>
                <input
                  className="wcc-input"
                  placeholder="Поиск по адресу..."
                  value={pvzSearch}
                  onChange={(e) => setPvzSearch(e.target.value)}
                />
                <div className="wcc-pvzList">
                  {filteredPvz.map((item) => (
                    <label key={item.id} className="wcc-pvzItem">
                      <input
                        type="radio"
                        name="pvz"
                        checked={selectedPvz === item.id}
                        onChange={() => setSelectedPvz(item.id)}
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
            {pvzTab === "map" && (
              <div className="wcc-pvzMap">
                Очень красивая и подробная карта
                <span>г. {city || "Не указан"}</span>
              </div>
            )}
            <div className="wcc-orderSubModal__actions">
              <button className="wcc-action-btn" type="button" onClick={() => setPvzOpen(false)}>
                Отменить
              </button>
              <button
                className="wcc-action-btn wcc-action-btn--primary"
                type="button"
                onClick={() => setPvzOpen(false)}
                disabled={!selectedPvz}
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
