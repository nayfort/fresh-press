import { usePreferences } from '../../context/PreferencesContext.js';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
export default function RecoveryCode({ code }) {
  const { t } = usePreferences();
  return (
    <section className="form-card recovery-card">
      <span className="eyebrow">{t('Збережіть у надійному місці')}</span>
      <h1>{t('Ваш код відновлення')}</h1>
      <p>
        {t(
          'Цей особистий код допоможе відновити доступ, якщо ви забудете пароль. Він показується лише зараз. Не передавайте його іншим.',
        )}
      </p>
      <code className="recovery-code">{code}</code>
      <a
        className="button button-secondary"
        href={`data:text/plain;charset=utf-8,${encodeURIComponent(`Fresh Press — ${t('Ваш код відновлення')}\n${code}\n`)}`}
        download="fresh-press-recovery-code.txt"
      >
        {t('Завантажити код')}
      </a>
      <Link className="button" to="/account">
        {t('Код збережено — до акаунту')}
      </Link>
    </section>
  );
}
RecoveryCode.propTypes = {
  code: PropTypes.string.isRequired,
};
