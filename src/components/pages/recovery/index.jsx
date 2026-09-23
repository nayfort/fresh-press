import { usePreferences } from '../../../context/PreferencesContext.js';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.js';
import { api } from '../../../lib/api.js';
import Field from '../../ui/Field.jsx';
import RecoveryCode from '../../ui/RecoveryCode.jsx';
export default function RecoveryPage() {
  const { t } = usePreferences();
  const { setUser, loading } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
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
      const result = await api('/recover', {
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
  if (code)
    return (
      <main id="main-content" tabIndex={-1} className="page auth-page">
        <RecoveryCode code={code} />
      </main>
    );
  return (
    <main id="main-content" tabIndex={-1} className="page auth-page">
      <form className="form-card" onSubmit={submit}>
        <span className="eyebrow">{t('Поверніть доступ')}</span>
        <h1>{t('Відновлення пароля')}</h1>
        <p className="muted">
          {t(
            'Введіть код, збережений під час реєстрації. Після відновлення ви отримаєте новий код.',
          )}
        </p>
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
        />
        <Field
          label={t('Код відновлення')}
          name="code"
          autoComplete="off"
          maxLength={48}
          required
        />
        <Field
          label={t('Новий пароль')}
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          maxLength={128}
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
        <button className="button" disabled={busy || loading}>
          {busy ? t('Зберігаємо…') : t('Відновити доступ')}
        </button>
        <Link to="/login">{t('Повернутися до входу')}</Link>
      </form>
    </main>
  );
}
