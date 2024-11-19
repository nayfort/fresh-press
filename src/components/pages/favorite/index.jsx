import { useFavorites } from "../../../context/FavoriteContext";
import {productImages} from "../../../staticData/productData.js";
import './styles.css';
import {FullHeart} from "../../../assets/imgs/svg/index.js";

const FavoriteItemPage = () => {
    const { favorites, removeFavorite } = useFavorites();

    return (
        <div className="favorite-page">
            <p className='favorite-title'>Обране</p>
            <div className="favorite-items">
                {favorites.length > 0 ? (
                    favorites.map((product) => (
                        <div key={product.id} className="favorite-item">
                            <img
                                src={productImages[product.id].front}
                                alt={product.name}
                                className="favorite-item-image"
                            />
                            <div className='favorite-item-info'>
                                <div className="favorite-item-name">
                                    <p>{product.name}</p>
                                    <p>${product.price}</p>
                                </div>
                                <FullHeart onClick={() => removeFavorite(product.id)}/>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Немає товарів</p>
                )}
            </div>
        </div>
    );
};

export default FavoriteItemPage;
