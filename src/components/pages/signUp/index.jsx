import { usePreferences } from '../../../context/PreferencesContext.js';
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.js';
import { api } from '../../../lib/api.js';
import Field from '../../ui/Field.jsx';
import RecoveryCode from '../../ui/RecoveryCode.jsx';
export default function SignUp() {
  const { t } = usePreferences();
  const { user, setUser, loading } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (loading)
    return (
      <main id="main-content" tabIndex={-1} className="page">
        <p role="status">{t('Завантаження…')}</p>
      </main>
    );
  if (code)
    return (
      <main id="main-content" tabIndex={-1} className="page auth-page">
        <RecoveryCode code={code} />
      </main>
    );
  if (user) return <Navigate to="/account" replace />;
  async function submit(event) {
    event.preventDefault();
    setError('');
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (data.password !== data.confirmPassword) {
      setError('Паролі не збігаються.');
      return;
    }
    setBusy(true);
    try {
      const result = await api('/signup', {
        method: 'POST',
        body: data,
      });
      setUser(result.user);
      setCode(result.recoveryCode);
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main id="main-content" tabIndex={-1} className="page auth-page">
      <form className="form-card" onSubmit={submit}>
        <span className="eyebrow">{t('Знайомство починається тут')}</span>
        <h1>{t('Створити акаунт')}</h1>
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="example@gmail.com"
          maxLength={254}
          required
        />
        <Field
          label={t('Пароль')}
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          maxLength={128}
          hint={t('Від 10 символів.')}
          required
        />
        <Field
          label={t('Підтвердьте пароль')}
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={10}
          maxLength={128}
          required
        />
        {error && (
          <p role="alert" className="message error">
            {t(error)}
          </p>
        )}
        <button className="button" disabled={busy}>
          {busy ? t('Створюємо…') : t('Зареєструватися')}
        </button>
        <p className="muted">
          {t('Уже маєте акаунт?')} <Link to="/login">{t('Увійти')}</Link>
        </p>
      </form>
    </main>
  );
}
