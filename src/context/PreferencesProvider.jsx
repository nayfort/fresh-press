import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { PreferencesContext } from './PreferencesContext.js';
import { translate, productCount } from '../i18n/translate.js';

function savedPreference(key, options, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return options.includes(saved) ? saved : fallback;
  } catch {
    return fallback;
  }
}

export default function PreferencesProvider({ children }) {
  const [locale, setLocale] = useState(() =>
    savedPreference('freshpress.language', ['uk', 'en'], 'uk'),
  );
  const [preferredTheme, setPreferredTheme] = useState(() =>
    savedPreference('freshpress.theme', ['light', 'dark'], null),
  );
  const [systemTheme, setSystemTheme] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
  );
  const theme = preferredTheme || systemTheme;
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setSystemTheme(media.matches ? 'dark' : 'light');
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      localStorage.setItem('freshpress.language', locale);
    } catch {
      /* Preferences remain available in memory. */
    }
  }, [locale]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#211e1c' : '#443d3a');
    try {
      if (preferredTheme)
        localStorage.setItem('freshpress.theme', preferredTheme);
    } catch {
      /* Preferences remain available in memory. */
    }
  }, [theme, preferredTheme]);
  const value = useMemo(
    () => ({
      locale,
      setLocale,
      theme,
      toggleTheme: () =>
        setPreferredTheme(theme === 'light' ? 'dark' : 'light'),
      t: (source) => translate(locale, source),
      productCount: (count) => productCount(locale, count),
      dateLocale: locale === 'uk' ? 'uk-UA' : 'en-GB',
    }),
    [locale, theme],
  );
  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}
PreferencesProvider.propTypes = { children: PropTypes.node.isRequired };
