import { usePreferences } from '../../../context/PreferencesContext.js';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext.js';
import { useAuth } from '../../../context/AuthContext.js';
import { api } from '../../../lib/api.js';
import Field from '../../ui/Field.jsx';
export default function OrderPage() {
  const { t } = usePreferences();
  const { cartItems, clearCart } = useCart();
  const { user, loading } = useAuth();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const requestKey = useRef(crypto.randomUUID());
  const navigate = useNavigate();
  if (loading)
    return (
      <main id="main-content" tabIndex={-1} className="page">
        <p role="status">{t('Завантаження…')}</p>
      </main>
    );
  if (!cartItems.length)
    return (
      <main id="main-content" tabIndex={-1} className="page">
        <div className="empty-state panel">
          <h1>{t('Кошик порожній')}</h1>
          <p>{t('Оберіть товари, щоб оформити замовлення.')}</p>
          <Link to="/" className="button">
            {t('До каталогу')}
          </Link>
        </div>
      </main>
    );
  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const result = await api('/orders', {
        method: 'POST',
        body: {
          ...data,
          terms: data.terms === 'on',
          items: cartItems,
          requestKey: requestKey.current,
        },
      });
      clearCart();
      navigate(`/orders/${result.order.id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main id="main-content" tabIndex={-1} className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">{t('Майже готово')}</span>
          <h1>{t('Оформлення замовлення')}</h1>
        </div>
        <Link to="/cart" className="text-link">
          {t('← До кошика')}
        </Link>
      </div>
      <div className="checkout-grid">
        <form className="form-card" onSubmit={submit}>
          <h2>{t('Інформація про доставку')}</h2>
          <Field
            label={t('Ім’я та прізвище')}
            name="fullName"
            autoComplete="name"
            defaultValue={
              user ? `${user.firstName} ${user.lastName}`.trim() : ''
            }
            maxLength={160}
            required
          />
          <Field
            label={t('Номер телефону')}
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={user?.phone || ''}
            minLength={7}
            maxLength={40}
            required
          />
          <Field
            label={t('Адреса доставки')}
            name="address"
            autoComplete="street-address"
            placeholder={t('Місто, вулиця, будинок, індекс')}
            minLength={5}
            maxLength={500}
            required
          />
          <label className="field">
            <span>{t('Коментар до замовлення')}</span>
            <textarea
              name="comment"
              rows={3}
              maxLength={2000}
              placeholder={t('Побажання до друку або доставки')}
            />
          </label>
          <label className="checkbox-field">
            <input type="checkbox" name="terms" required />
            <span>
              {t('Я погоджуюся з')}{' '}
              <Link to="/delivery" target="_blank" rel="noopener noreferrer">
                {t('умовами замовлення')}
              </Link>
            </span>
          </label>
          {error && (
            <p role="alert" className="message error">
              {t(error)}
            </p>
          )}
          <button className="button" disabled={busy}>
            {busy ? t('Оформлюємо…') : t('Оформити замовлення')}
          </button>
        </form>
        <aside className="panel order-summary">
          <h2>{t('Ваше замовлення')}</h2>
          {cartItems.map((item) => (
            <div className="summary-line" key={item.key}>
              <span>
                {t(item.name)}{' '}
                <small>
                  {t(item.selectedSize)} · {item.quantity} {t('шт.')}
                </small>
              </span>
              <strong>${item.price * item.quantity}</strong>
            </div>
          ))}
          <div className="summary-total">
            <span>{t('Разом')}</span>
            <strong>
              $
              {cartItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0,
              )}
            </strong>
          </div>
          <p className="muted">
            {t('Вартість товарів. Умови доставки — на сторінці доставки.')}
          </p>
        </aside>
      </div>
    </main>
  );
}
