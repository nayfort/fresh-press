import { usePreferences } from '../../../context/PreferencesContext.js';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../../lib/api.js';
export default function OrderConfirmation() {
  const { t, dateLocale } = usePreferences();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    setOrder(null);
    setError('');
    api(`/orders/${id}`)
      .then((result) => {
        if (active) setOrder(result.order);
      })
      .catch((error) => {
        if (active) setError(error.message);
      });
    return () => {
      active = false;
    };
  }, [id]);
  return (
    <main id="main-content" tabIndex={-1} className="page">
      <section className="panel confirmation">
        {error ? (
          <p role="alert" className="message error">
            {t(error)}
          </p>
        ) : !order ? (
          <p role="status">{t('Завантаження…')}</p>
        ) : (
          <>
            <div className="success-icon" aria-hidden="true">
              ✓
            </div>
            <span className="eyebrow">{t('Дякуємо за ваш вибір')}</span>
            <h1>{t('Замовлення збережено')}</h1>
            <p className="order-number">{order.number}</p>
            <p className="muted">
              {new Date(order.createdAt).toLocaleString(dateLocale)} ·{' '}
              {t(order.status)}
            </p>
            <div className="receipt-items">
              {order.items.map((item, index) => (
                <div className="summary-line" key={index}>
                  <span>
                    {t(item.name)}
                    <small>
                      {t(item.selectedSize)} · {item.quantity} {t('шт.')}
                    </small>
                    {Object.entries(item.designs).map(([view, design]) => (
                      <a
                        key={view}
                        className="artwork-link"
                        href={design.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {design.name}
                      </a>
                    ))}
                  </span>
                  <strong>${item.price * item.quantity}</strong>
                </div>
              ))}
              <div className="summary-total">
                <span>{t('Разом')}</span>
                <strong>${order.total}</strong>
              </div>
            </div>
            <div className="delivery-details">
              <h2>{t('Доставка')}</h2>
              <p>{order.fullName}</p>
              <p>{order.phone}</p>
              <p>{order.address}</p>
              {order.comment && <p className="muted">{order.comment}</p>}
            </div>
          </>
        )}
        <Link className="button" to="/">
          {t('До каталогу')}
        </Link>
      </section>
    </main>
  );
}
