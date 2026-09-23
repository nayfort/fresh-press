import en from './en.js';

export function translate(locale, source) {
  if (locale === 'en') return en[source] ?? source;
  return source === 'One size' ? 'Універсальний' : source;
}

export function productCount(locale, count) {
  const form = new Intl.PluralRules(locale).select(count);
  const word =
    locale === 'en'
      ? form === 'one'
        ? 'product'
        : 'products'
      : { one: 'товар', few: 'товари', many: 'товарів', other: 'товару' }[form];
  return `${count} ${word}`;
}
