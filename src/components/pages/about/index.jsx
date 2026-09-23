import { usePreferences } from '../../../context/PreferencesContext.js';
import { Link } from 'react-router-dom';
export default function AboutUs() {
  const { t } = usePreferences();
  return (
    <main id="main-content" tabIndex={-1} className="page">
      <article className="panel prose">
        <span className="eyebrow">Fresh Press</span>
        <h1>{t('Речі з вашим характером')}</h1>
        <p>
          {t(
            'Улюблене фото, власна ілюстрація або проста ідея — перетворіть її на принт для одягу та аксесуарів.',
          )}
        </p>
        <h2>{t('Від ідеї до замовлення')}</h2>
        <ol>
          <li>{t('Оберіть річ у каталозі.')}</li>
          <li>
            {t('Завантажте зображення на потрібну сторону та оберіть розмір.')}
          </li>
          <li>{t('Додайте товар у кошик і заповніть дані доставки.')}</li>
        </ol>
        <Link className="button" to="/">
          {t('Знайти свою річ')}
        </Link>
      </article>
    </main>
  );
}
