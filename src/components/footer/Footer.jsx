import { usePreferences } from '../../context/PreferencesContext.js';
import { Link } from 'react-router-dom';
import './styles.css';
export default function Footer() {
  const { t } = usePreferences();
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div>
          <Link to="/" className="footer-brand">
            Fresh Press<span>®</span>
          </Link>
          <p>{t('Речі з вашим характером.')}</p>
        </div>
        <nav aria-label={t('Інформація')}>
          <Link to="/">{t('Каталог')}</Link>
          <Link to="/about-us">{t('Про нас')}</Link>
          <Link to="/delivery">{t('Доставка')}</Link>
          <Link to="/contacts">{t('Контакти')}</Link>
        </nav>
        <p className="footer-copyright">
          © {new Date().getFullYear()} Fresh Press
        </p>
      </div>
    </footer>
  );
}
