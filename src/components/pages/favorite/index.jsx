import { usePreferences } from '../../../context/PreferencesContext.js';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../../context/FavoriteContext.js';
import { FullHeart } from '../../../assets/imgs/svg/index.js';
export default function FavoriteItemPage() {
  const { t, productCount } = usePreferences();
  const { favorites, removeFavorite } = useFavorites();
  return (
    <main id="main-content" tabIndex={-1} className="page favorite-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">{t('Збережено для вас')}</span>
          <h1>{t('Обране')}</h1>
        </div>
        <span className="muted">{productCount(favorites.length)}</span>
      </div>
      {favorites.length ? (
        <div className="items-block favorite-items">
          {favorites.map((product) => (
            <article key={product.id} className="favorite-item">
              <Link to={`/product/${product.id}`} className="content-card">
                <img
                  src={product.img}
                  alt={t(product.name)}
                  className="product-image"
                />
                <div className="card-caption">
                  <h2>{t(product.name)}</h2>
                  <strong>${product.price}</strong>
                </div>
              </Link>
              <button
                className="favorite-remove"
                onClick={() => removeFavorite(product.id)}
                aria-label={`${t('Прибрати з обраного')}: ${t(product.name)}`}
              >
                <FullHeart />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state panel">
          <div className="empty-symbol" aria-hidden="true">
            ♡
          </div>
          <h2>{t('Немає товарів')}</h2>
          <p>
            {t('Натисніть на сердечко в картці товару, щоб зберегти його тут.')}
          </p>
          <Link className="button" to="/">
            {t('До каталогу')}
          </Link>
        </div>
      )}
    </main>
  );
}
