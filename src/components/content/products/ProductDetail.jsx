import { usePreferences } from '../../../context/PreferencesContext.js';
import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useFavorites } from '../../../context/FavoriteContext.js';
import { useCart } from '../../../context/CartContext.js';
import { useAuth } from '../../../context/AuthContext.js';
import {
  productsData,
  productImages,
} from '../../../staticData/productData.js';
import { sizes } from '../../../../shared/catalog.js';
import { api } from '../../../lib/api.js';
import {
  Download,
  Cart,
  Heart,
  FullHeart,
} from '../../../assets/imgs/svg/index.js';
import './styles.css';
const viewNames = {
  front: 'Вид спереду',
  back: 'Вид ззаду',
  left_sleeve: 'Вид зліва',
  right_sleeve: 'Вид справа',
};
export default function ProductDetail() {
  const { t } = usePreferences();
  const { id } = useParams();
  const product = productsData.find((item) => item.id === Number(id));
  const [selectedSize, setSelectedSize] = useState('XS');
  const [selectedView, setSelectedView] = useState('front');
  const [designs, setDesigns] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const fileInput = useRef(null);
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { loading } = useAuth();
  if (!product)
    return (
      <main id="main-content" tabIndex={-1} className="page">
        <div className="empty-state panel">
          <h1>{t('Товар не знайдено')}</h1>
          <Link to="/" className="button">
            {t('До каталогу')}
          </Link>
        </div>
      </main>
    );
  const isFavorite = favorites.some((item) => item.id === product.id);
  const apparel = product.type === 'apparel';
  async function uploadImage(event) {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file) return;
    setError('');
    setAdded(false);
    if (
      !['image/png', 'image/jpeg', 'image/webp'].includes(file.type) ||
      file.size > 8 * 1024 * 1024
    ) {
      setError('Оберіть PNG, JPEG або WebP до 8 МБ.');
      return;
    }
    const view = selectedView;
    const data = new FormData();
    data.append('image', file);
    setBusy(true);
    try {
      const image = await api('/uploads', {
        method: 'POST',
        body: data,
      });
      setDesigns((current) => ({
        ...current,
        [view]: image,
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }
  function buy() {
    addToCart({
      ...product,
      selectedSize: apparel ? selectedSize : 'One size',
      designs,
    });
    setAdded(true);
  }
  return (
    <main id="main-content" tabIndex={-1} className="page product-detail">
      <nav className="breadcrumbs" aria-label={t('Навігація')}>
        <Link to="/">{t('Каталог')}</Link>
        <span aria-hidden="true">/</span>
        <span>{t(product.name)}</span>
      </nav>
      <div className="product-detail-content">
        <section
          className="product-detail-pic"
          aria-label={t('Зображення та дизайн')}
        >
          <div className="product-detail-picture">
            <button
              className={`product-favorite ${isFavorite ? 'is-favorite' : ''}`}
              onClick={() =>
                isFavorite ? removeFavorite(product.id) : addFavorite(product)
              }
              aria-label={
                isFavorite ? t('Прибрати з обраного') : t('Додати до обраного')
              }
              aria-pressed={isFavorite}
            >
              {isFavorite ? <FullHeart /> : <Heart />}
            </button>
            <img
              src={productImages[product.id][selectedView]}
              alt={`${t(product.name)} — ${t(viewNames[selectedView])}`}
              className="product-image-view"
            />
            {designs[selectedView] && (
              <img
                src={designs[selectedView].url}
                alt={t('Ваш дизайн')}
                className={`design-preview design-product-${product.id}`}
              />
            )}
          </div>
          <div
            className="product-view"
            role="group"
            aria-label={t('Ракурс товару')}
          >
            {Object.keys(productImages[product.id]).map((view) => (
              <button
                key={view}
                className={`view-item ${selectedView === view ? 'selected-view' : ''}`}
                aria-pressed={selectedView === view}
                onClick={() => setSelectedView(view)}
              >
                {t(viewNames[view])}
              </button>
            ))}
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={uploadImage}
            className="visually-hidden"
            aria-label={t('Файл для друку')}
            disabled={busy || loading}
          />
          <button
            className="button button-secondary download-pic-btn"
            disabled={busy || loading}
            onClick={() => fileInput.current.click()}
          >
            <Download />
            {busy ? t('Завантажуємо…') : t('Завантажити фото')}
          </button>
          {designs[selectedView] && (
            <div className="uploaded-file">
              <span>{designs[selectedView].name}</span>
              <button
                className="text-button"
                disabled={busy}
                onClick={() => {
                  setDesigns((current) => {
                    const next = {
                      ...current,
                    };
                    delete next[selectedView];
                    return next;
                  });
                  setAdded(false);
                }}
              >
                {t('Прибрати')}
              </button>
            </div>
          )}
          <p className="download-description">
            {t(
              'PNG, JPEG або WebP до 8 МБ. Для чіткого друку рекомендуємо від 1000 \xD7 1000 px. Оберіть ракурс, щоб додати зображення на відповідну сторону.',
            )}
          </p>
          {error && (
            <p role="alert" className="message error">
              {t(error)}
            </p>
          )}
        </section>
        <section className="product-detail-info">
          <span className="eyebrow">{t(product.category)} · Fresh Press</span>
          <h1 className="product-name">{t(product.name)}</h1>
          <p className="product-price">${product.price}</p>
          <p className="product-description">
            {t(
              'Зробіть річ своєю. Додайте улюблене зображення, оберіть параметри та збережіть товар у кошику.',
            )}
          </p>
          {apparel ? (
            <fieldset className="size-options">
              <legend>{t('Оберіть розмір')}</legend>
              <div>
                {sizes.map((size) => (
                  <button
                    type="button"
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                    aria-pressed={selectedSize === size}
                    onClick={() => {
                      setSelectedSize(size);
                      setAdded(false);
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>
          ) : (
            <p className="size-note">{t('Універсальний розмір')}</p>
          )}
          <button className="button buy-el-btn" disabled={busy} onClick={buy}>
            {t('Купити')}
            <Cart />
          </button>
          {added && (
            <p className="message success" role="status">
              {t('Товар додано в кошик.')}{' '}
              <Link to="/cart">{t('Перейти до кошика →')}</Link>
            </p>
          )}
          <div className="product-note">
            <strong>{t('Ваш задум, ваш принт')}</strong>
            <p>
              {t(
                'Завантажений дизайн зберігається разом із товаром і передається в замовлення.',
              )}
            </p>
          </div>
          {apparel && (
            <details className="size-chart">
              <summary>{t('Розмірна сітка')}</summary>
              <table className="size-table">
                <caption className="visually-hidden">
                  {t('Розмірна сітка')}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{t('Розміри')}</th>
                    <th scope="col">A</th>
                    <th scope="col">B</th>
                  </tr>
                </thead>
                <tbody>
                  {sizes.map((size, index) => (
                    <tr key={size}>
                      <th scope="row">{size}</th>
                      <td>{[45, 50, 52, 55, 58, 61, 64][index]}</td>
                      <td>{[67, 69, 71, 73, 75, 77, 79][index]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          )}
        </section>
      </div>
    </main>
  );
}
