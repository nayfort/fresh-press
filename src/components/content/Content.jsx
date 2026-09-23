import { usePreferences } from '../../context/PreferencesContext.js';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './styles.css';
import { Search, Check } from '../../assets/imgs/svg/index.js';
import { productsData } from '../../staticData/productData.js';
const Content = ({ clickCounts, setClickCounts }) => {
  const { t, productCount } = usePreferences();
  const conditions = ['Новинки', 'Одяг', 'Аксесуари', 'За рейтингом'];
  const [selectedCondition, setSelectedCondition] = useState(conditions[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const handleConditionClick = (condition) => {
    setSelectedCondition(condition);
  };
  const handleProductClick = (productId) => {
    setClickCounts((prevCounts) => ({
      ...prevCounts,
      [productId]: (prevCounts[productId] || 0) + 1,
    }));
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };
  const filteredProducts = productsData
    .filter((product) => {
      if (selectedCondition === 'Одяг') {
        return product.category === 'Одяг';
      } else if (selectedCondition === 'Аксесуари') {
        return product.category === 'Аксесуари';
      }
      return true;
    })
    .filter((product) =>
      [product.name, t(product.name)].some((name) =>
        name.toLowerCase().includes(searchTerm.trim()),
      ),
    )
    .sort((a, b) => {
      if (selectedCondition === 'За рейтингом') {
        const countA = clickCounts[a.id] || 0;
        const countB = clickCounts[b.id] || 0;
        return countB - countA;
      } else if (selectedCondition === 'Новинки') {
        return b.id - a.id;
      }
      return 0;
    });
  return (
    <main id="main-content" tabIndex={-1} className="page content-container">
      <section className="catalog-heading">
        <div>
          <span className="eyebrow">{t('Ваші ідеї. Наші речі.')}</span>
          <h1>{t('Створено бути вашим.')}</h1>
          <p>{t('Одяг та аксесуари, які розкажуть вашу історію.')}</p>
        </div>
        <span className="catalog-count">
          {String(productsData.length).padStart(2, '0')} {t('/ Колекція')}
        </span>
      </section>
      <div className="search-block">
        <div className="search">
          <input
            type="text"
            placeholder={t('Пошук по каталогу...')}
            className="search-input"
            aria-label={t('Пошук по каталогу')}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="search-icon">
            <Search />
          </div>
        </div>
        <div className="search-conditions">
          {conditions.map((condition, index) => (
            <button
              type="button"
              aria-pressed={selectedCondition === condition}
              key={index}
              className={`s-condition ${selectedCondition === condition ? 'selected' : ''}`}
              onClick={() => handleConditionClick(condition)}
            >
              {selectedCondition === condition && <Check />}
              {t(condition)}
            </button>
          ))}
        </div>
      </div>
      <div className="catalog-results" aria-live="polite">
        {productCount(filteredProducts.length)}
      </div>
      {filteredProducts.length === 0 && (
        <div className="empty-state panel">
          <h2>{t('Нічого не знайдено')}</h2>
          <p>{t('Спробуйте іншу назву або категорію.')}</p>
          <button
            className="button button-secondary"
            onClick={() => {
              setSearchTerm('');
              setSelectedCondition(conditions[0]);
            }}
          >
            {t('Скинути пошук')}
          </button>
        </div>
      )}
      <div className="items-block">
        {filteredProducts.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="content-card"
            onClick={() => handleProductClick(product.id)}
          >
            <div className="content-card-element">
              <img
                src={product.img}
                alt={t(product.name)}
                loading="lazy"
                decoding="async"
                className="product-image"
              />
              <div className="card-caption">
                <h2>{t(product.name)}</h2>
                <strong>${product.price}</strong>
              </div>
              <span className="card-category">{t(product.category)}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};
Content.propTypes = {
  clickCounts: PropTypes.object.isRequired,
  setClickCounts: PropTypes.func.isRequired,
};
export default Content;
