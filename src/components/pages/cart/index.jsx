import { usePreferences } from '../../../context/PreferencesContext.js';
import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext.js';
import './styles.css';
export default function CartPage() {
  const { t } = usePreferences();
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  return (
    <main id="main-content" tabIndex={-1} className="page cart-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">{t('Ваш вибір')}</span>
          <h1>{t('Кошик')}</h1>
        </div>
        <Link className="text-link" to="/">
          {t('Продовжити покупки →')}
        </Link>
      </div>
      {cartItems.length ? (
        <div className="cart-layout">
          <div className="cart-content">
            {cartItems.map((item) => (
              <article key={item.key} className="cart-item">
                <Link to={`/product/${item.id}`} className="cart-image-link">
                  <img
                    src={item.img}
                    alt={t(item.name)}
                    className="cart-item-image"
                  />
                </Link>
                <div className="cart-item-info">
                  <div className="cart-item-title">
                    <Link to={`/product/${item.id}`}>{t(item.name)}</Link>
                    <strong>${item.price * item.quantity}</strong>
                  </div>
                  <p className="muted">
                    {t('Розмір:')} {t(item.selectedSize)}
                  </p>
                  {Object.entries(item.designs || {}).map(([view, design]) => (
                    <a
                      className="artwork-link"
                      href={design.url}
                      target="_blank"
                      rel="noreferrer"
                      key={view}
                    >
                      <img src={design.url} alt="" />
                      {design.name}
                    </a>
                  ))}
                  <div className="cart-item-quantity">
                    <label>
                      {t('Кількість')}{' '}
                      <select
                        aria-label={`${t('Кількість')}: ${t(item.name)}, ${t(item.selectedSize)}`}
                        value={item.quantity}
                        onChange={(event) =>
                          updateQuantity(item.key, event.target.value)
                        }
                      >
                        {Array.from(
                          {
                            length: 99,
                          },
                          (_, index) => index + 1,
                        ).map((value) => (
                          <option key={value}>{value}</option>
                        ))}
                      </select>
                    </label>
                    <button
                      className="text-button"
                      onClick={() => removeFromCart(item.key)}
                    >
                      {t('Видалити')}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <aside className="panel order-summary">
            <h2>{t('Підсумок')}</h2>
            <div className="summary-line">
              <span>{t('Товарів')}</span>
              <strong>
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </strong>
            </div>
            <div className="summary-total">
              <span>{t('Разом')}</span>
              <strong>${total}</strong>
            </div>
            <Link to="/order" className="button">
              {t('Замовити')}
            </Link>
          </aside>
        </div>
      ) : (
        <div className="empty-state panel">
          <div className="empty-symbol" aria-hidden="true">
            ＋
          </div>
          <h2>{t('Кошик порожній')}</h2>
          <p>{t('Почніть із речі, яка вам до вподоби.')}</p>
          <Link className="button" to="/">
            {t('До каталогу')}
          </Link>
        </div>
      )}
    </main>
  );
}
