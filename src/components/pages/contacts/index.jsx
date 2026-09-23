import { usePreferences } from '../../../context/PreferencesContext.js';
import { Link } from 'react-router-dom';
export default function Contacts() {
  const { t } = usePreferences();
  return (
    <main id="main-content" tabIndex={-1} className="page">
      <article className="panel prose">
        <span className="eyebrow">{t('Будьмо на зв’язку')}</span>
        <h1>{t('Контакти щодо замовлення')}</h1>
        <p>
          {t(
            'Залиште актуальний номер телефону та побажання під час оформлення — ці дані збережуться разом із замовленням.',
          )}
        </p>
        <h2>{t('Перевірити замовлення')}</h2>
        <p>
          {t(
            'Деталі оформлених замовлень можна переглянути в особистому акаунті. Для замовлення без входу збережіть посилання на сторінку підтвердження в цьому браузері.',
          )}
        </p>
        <div className="inline-actions">
          <Link className="button" to="/account">
            {t('Мій акаунт')}
          </Link>
          <Link className="button button-secondary" to="/delivery">
            {t('Про доставку')}
          </Link>
        </div>
      </article>
    </main>
  );
}
