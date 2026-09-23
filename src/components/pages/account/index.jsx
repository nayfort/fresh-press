import { usePreferences } from '../../../context/PreferencesContext.js';
import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.js';
import { api } from '../../../lib/api.js';
import Field from '../../ui/Field.jsx';
export default function AccPage() {
  const { t, dateLocale } = usePreferences();
  const { user, setUser, loading, error: sessionError } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersError, setOrdersError] = useState('');
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!user) return;
    let active = true;
    api('/orders')
      .then((result) => {
        if (active) setOrders(result.orders);
      })
      .catch((error) => {
        if (active) setOrdersError(error.message);
      })
      .finally(() => {
        if (active) setOrdersLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);
  if (loading)
    return (
      <main id="main-content" tabIndex={-1} className="page">
        <p role="status">{t('Завантаження…')}</p>
      </main>
    );
  if (sessionError)
    return (
      <main id="main-content" tabIndex={-1} className="page">
        <p role="alert">{t(sessionError)}</p>
      </main>
    );
  if (!user) return <Navigate to="/login" replace />;
  async function save(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (data.password !== data.confirmPassword) {
      setError('Паролі не збігаються.');
      return;
    }
    setBusy(true);
    try {
      const result = await api('/account', {
        method: 'PATCH',
        body: data,
      });
      setUser(result.user);
      setMessage('Зміни збережено.');
      for (const name of ['currentPassword', 'password', 'confirmPassword'])
        form.elements[name].value = '';
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    setBusy(true);
    setError('');
    try {
      await api('/logout', {
        method: 'POST',
      });
      setUser(null);
      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main id="main-content" tabIndex={-1} className="page account-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">{t('Особистий простір')}</span>
          <h1>{t('Мій акаунт')}</h1>
        </div>
        <button
          className="button button-secondary"
          onClick={logout}
          disabled={busy}
        >
          {t('Вийти')}
        </button>
      </div>
      <div className="account-grid">
        <form className="form-card" onSubmit={save}>
          <h2>{t('Мої дані')}</h2>
          <div className="field-row">
            <Field
              label={t('Ім’я')}
              name="firstName"
              autoComplete="given-name"
              defaultValue={user.firstName}
              maxLength={80}
              required
            />
            <Field
              label={t('Прізвище')}
              name="lastName"
              autoComplete="family-name"
              defaultValue={user.lastName}
              maxLength={80}
              required
            />
          </div>
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={user.email}
            maxLength={254}
            required
          />
          <Field
            label={t('Телефон')}
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={user.phone}
            maxLength={40}
          />
          <hr />
          <h2>{t('Безпека')}</h2>
          <Field
            label={t('Поточний пароль')}
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            maxLength={128}
            hint={t('Потрібен лише для зміни email або пароля.')}
          />
          <Field
            label={t('Новий пароль')}
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={10}
            maxLength={128}
          />
          <Field
            label={t('Підтвердьте пароль')}
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={10}
            maxLength={128}
          />
          {error && (
            <p role="alert" className="message error">
              {t(error)}
            </p>
          )}
          {message && (
            <p role="status" className="message success">
              {t(message)}
            </p>
          )}
          <button className="button" disabled={busy}>
            {busy ? t('Зберігаємо…') : t('Зберегти зміни')}
          </button>
        </form>
        <section className="panel order-history">
          <h2>{t('Мої замовлення')}</h2>
          {ordersLoading ? (
            <p role="status">{t('Завантаження…')}</p>
          ) : ordersError ? (
            <p role="alert" className="message error">
              {t(ordersError)}
            </p>
          ) : orders.length ? (
            orders.map((order) => (
              <Link
                className="history-item"
                key={order.id}
                to={`/orders/${order.id}`}
              >
                <div>
                  <strong>{order.number}</strong>
                  <small>
                    {new Date(order.createdAt).toLocaleDateString(dateLocale)}
                  </small>
                </div>
                <div>
                  <strong>${order.total}</strong>
                  <small>{t(order.status)}</small>
                </div>
              </Link>
            ))
          ) : (
            <div className="empty-state">
              <p>{t('Тут з’являться ваші замовлення.')}</p>
              <Link to="/" className="text-link">
                {t('До каталогу →')}
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
