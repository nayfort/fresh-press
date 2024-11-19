import { tshirtFront, tshirtBack } from "../assets/imgs/png/tshirt/index.jsx";
import { hoodieFront, hoodieLeft, hoodieRight, hoodieBack } from "../assets/imgs/png/hoodie/index.jsx";
import { hatFront, hatBack, hatRight, hatLeft } from "../assets/imgs/png/hat/index.jsx";
import { capFront, capBack } from "../assets/imgs/png/cap/index.jsx";
import { bagFront, bagBack } from "../assets/imgs/png/bag/index.jsx";
import { cupFront, cupBack } from "../assets/imgs/png/cup/index.jsx";
import { stickerFront } from "../assets/imgs/png/sticker/index.jsx";
import { bottleFront } from "../assets/imgs/png/bottle/index.jsx";

export const productsData = [
    { id: 1, name: 'Футболка', price: 50, type: 'apparel' },
    { id: 2, name: 'Худі', price: 60, type: 'apparel' },
    { id: 3, name: 'Шапка', price: 25, type: 'accessory' },
    { id: 4, name: 'Кепка', price: 20, type: 'accessory' },
    { id: 5, name: 'Шопер', price: 15, type: 'accessory' },
    { id: 6, name: 'Стакан', price: 10, type: 'accessory' },
    { id: 7, name: 'Стікер', price: 5, type: 'accessory' },
    { id: 8, name: 'Пляшка', price: 12, type: 'accessory' },
];

export const productImages = {
    1: { front: tshirtFront, back: tshirtBack },
    2: { front: hoodieFront, back: hoodieBack, left_sleeve: hoodieLeft, right_sleeve: hoodieRight },
    3: { front: hatFront, back: hatBack, left_sleeve: hatLeft, right_sleeve: hatRight },
    4: { front: capFront, back: capBack },
    5: { front: bagFront, back: bagBack },
    6: { front: cupFront, back: cupBack },
    7: { front: stickerFront },
    8: { front: bottleFront },
};
