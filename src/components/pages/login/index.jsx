import { usePreferences } from '../../../context/PreferencesContext.js';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.js';
import { api } from '../../../lib/api.js';
import Field from '../../ui/Field.jsx';
export default function LoginPage() {
  const { t } = usePreferences();
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (loading)
    return (
      <main id="main-content" tabIndex={-1} className="page">
        <p role="status">{t('Завантаження…')}</p>
      </main>
    );
  if (user) return <Navigate to="/account" replace />;
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = Object.fromEntries(new FormData(event.currentTarget));
      const result = await api('/login', {
        method: 'POST',
        body: data,
      });
      setUser(result.user);
      navigate('/account');
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main id="main-content" tabIndex={-1} className="page auth-page">
      <form className="form-card" onSubmit={submit}>
        <span className="eyebrow">{t('Раді бачити знову')}</span>
        <h1>{t('Увійти в акаунт')}</h1>
        <p className="muted">{t('Ваші дані та замовлення в одному місці.')}</p>
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="example@gmail.com"
          autoComplete="email"
          maxLength={254}
          required
        />
        <Field
          label={t('Пароль')}
          name="password"
          type="password"
          placeholder="password"
          autoComplete="current-password"
          maxLength={128}
          required
        />
        {error && (
          <p role="alert" className="message error">
            {t(error)}
          </p>
        )}
        <button className="button" disabled={busy}>
          {busy ? t('Входимо…') : t('Увійти')}
        </button>
        <div className="form-links">
          <Link to="/recovery">{t('Забули пароль?')}</Link>
          <Link to="/signup">{t('Створити акаунт')}</Link>
        </div>
      </form>
    </main>
  );
}
