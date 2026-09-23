import { useEffect, useId, useRef, useState } from 'react';
import { usePreferences } from '../../context/PreferencesContext.js';

export default function PreferencesControls() {
  const { locale, setLocale, theme, toggleTheme, t } = usePreferences();
  const [open, setOpen] = useState(false);
  const container = useRef(null);
  const trigger = useRef(null);
  const menu = useRef(null);
  const menuId = useId();
  const themeLabel = t(
    theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему',
  );

  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector('[aria-checked="true"]')?.focus();
    const dismiss = (event) => {
      if (!container.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);

  function closeAndFocus() {
    setOpen(false);
    trigger.current?.focus();
  }
  function handleKeys(event) {
    const options = [
      ...menu.current.querySelectorAll('[role="menuitemradio"]'),
    ];
    const index = options.indexOf(document.activeElement);
    if (event.key === 'Escape') {
      event.preventDefault();
      closeAndFocus();
    } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const next =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? options.length - 1
            : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) %
              options.length;
      options[next].focus();
    }
  }

  return (
    <div
      className="preferences-controls"
      role="group"
      aria-label={t('Налаштування вигляду')}
    >
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={themeLabel}
        title={themeLabel}
      >
        <svg
          key={theme}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {theme === 'dark' ? (
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </>
          ) : (
            <path d="M20.9 13.1A9 9 0 0 1 10.9 3a9 9 0 1 0 10 10.1Z" />
          )}
        </svg>
      </button>
      <div
        className="language-selector"
        ref={container}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setOpen(false);
        }}
      >
        <button
          type="button"
          className="language-trigger"
          ref={trigger}
          aria-label={t('Мова інтерфейсу')}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((current) => !current)}
          onKeyDown={(event) => {
            if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
              event.preventDefault();
              setOpen(true);
            }
            if (event.key === 'Escape') closeAndFocus();
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <ellipse cx="12" cy="12" rx="4" ry="9" />
            <path d="M3 12h18" />
          </svg>
          <span>{locale === 'uk' ? 'УКР' : 'EN'}</span>
          <svg
            className={`language-chevron ${open ? 'is-open' : ''}`}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </button>
        {open && (
          <div
            id={menuId}
            className="language-menu"
            ref={menu}
            role="menu"
            aria-label={t('Мова інтерфейсу')}
            onKeyDown={handleKeys}
          >
            {[
              { code: 'uk', name: 'Українська', short: 'УКР' },
              { code: 'en', name: 'English', short: 'EN' },
            ].map((option) => (
              <button
                type="button"
                key={option.code}
                role="menuitemradio"
                aria-checked={locale === option.code}
                tabIndex={-1}
                lang={option.code}
                onClick={() => {
                  setLocale(option.code);
                  closeAndFocus();
                }}
              >
                <span className="language-code">{option.short}</span>
                <span>{option.name}</span>
                <span className="language-check" aria-hidden="true">
                  {locale === option.code ? '✓' : ''}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
