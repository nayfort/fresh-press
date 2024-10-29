import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css';
import { Download, Cart, Heart } from "../../assets/imgs/svg/index.js";
import SizeChart from "../../assets/imgs/png/tshirt-size.png";
import * as fabric from "fabric";

const productsData = [
    { id: 1, name: 'Футболка', price: 50 },
    { id: 2, name: 'Худі', price: 60 },
    { id: 3, name: 'Шапка', price: 25 },
    { id: 4, name: 'Кепка', price: 20 },
    { id: 5, name: 'Шопер', price: 15 },
    { id: 6, name: 'Стакан', price: 10 },
    { id: 7, name: 'Стікер', price: 5 },
    { id: 8, name: 'Пляшка', price: 12 }
];

const ProductDetail = () => {
    const { id } = useParams();
    const product = productsData.find((item) => item.id === parseInt(id));

    const [selectedSize, setSelectedSize] = useState('XS');
    const [selectedView, setSelectedView] = useState('front');
    const [textInput, setTextInput] = useState('');
    const [canvas, setCanvas] = useState(null);

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const views = [
        { name: 'Вид спереду', value: 'front' },
        { name: 'Вид ззаду', value: 'back' },
        { name: 'Лівий рукав', value: 'left_sleeve' },
        { name: 'Правий рукав', value: 'right_sleeve' }
    ];

    const handleSizeClick = (size) => {
        setSelectedSize(size);
    };

    const handleViewClick = (view) => {
        setSelectedView(view);
    };

    useEffect(() => {
        const newCanvas = new fabric.Canvas('designCanvas');
        setCanvas(newCanvas);

        return () => {
            newCanvas.dispose();
        };
    }, [selectedView]);

    const addText = () => {
        if (textInput && canvas) {
            const text = new fabric.Text(textInput, {
                left: 100,
                top: 100,
                fill: '#000',
                fontSize: 24,
            });
            canvas.add(text);
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && canvas) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const imgSrc = e.target.result;

                console.log("Image source loaded:", imgSrc);

                fabric.Image.fromURL(imgSrc, (img) => {
                    if (img) {
                        img.set({
                            left: 50,
                            top: 50,
                            scaleX: 0.5,
                            scaleY: 0.5,
                        });

                        console.log("Image object created and ready to add to canvas:", img);

                        canvas.add(img);
                        canvas.renderAll();

                        console.log("Image successfully added to canvas.");
                    } else {
                        console.error("Failed to create image object.");
                    }
                }, { crossOrigin: 'anonymous' }); //CORS
            };

            reader.onerror = (error) => console.error("Error reading file:", error);

            reader.readAsDataURL(file);
        } else {
            console.error("No file selected or canvas not initialized");
        }
    };

    return (
        <div className="product-detail">
            <div className="product-view">
                {views.map((view) => (
                    <div
                        key={view.value}
                        className={`view-item ${selectedView === view.value ? 'selected-view' : ''}`}
                        onClick={() => handleViewClick(view.value)}
                    >
                        {view.name}
                    </div>
                ))}
            </div>
            <div className="product-detail-content">
                <div className="product-detail-pic">
                    <div className="product-detail-picture">
                        <div className='product-favorite'><Heart /></div>
                        <canvas id="designCanvas" width="450" height="500"></canvas>
                    </div>
                    <button className='download-pic-btn'>Завантажити фото<Download /></button>
                    <div className='download-description'>
                        Щоб нанести фото по всій ширині області друку, потрібен розмір не менше 1000x1000 px, бажано у форматі .png з прозорим фоном.
                        Мінімальна роздільна здатність 200 dpi, розмір зображення 1:1.
                    </div>
                </div>
                <div className="product-detail-info">
                    <div className="product-detail-info-title">
                        <div className='product-name'>{product.name}</div>
                        <div className='product-price'>${product.price}</div>
                        <div className='product-description'>
                            Ваше замовлення буде виготовлено і передано в службу доставки після уточнень деталей замовлення з менеджером або автоматичної обробки
                        </div>
                        <div>Вкажіть розмір:</div>
                    </div>
                    <div>
                        {sizes.map((size) => (
                            <button
                                key={size}
                                className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                                onClick={() => handleSizeClick(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    <button className='buy-el-btn'>Купити<Cart /></button>
                    <div className='product-size'>Розмірна сітка:</div>
                    <img src={SizeChart} alt="SizeChart" className='size-chart-pic' />
                </div>
                <div className="customization-controls">
                    <input
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Введите текст"
                    />
                    <button onClick={addText}>Добавить текст</button>

                    <input type="file" onChange={handleImageUpload} />
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
