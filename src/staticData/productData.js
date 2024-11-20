import { tshirtFront, tshirtBack } from "../assets/imgs/png/tshirt/index.jsx";
import { hoodieFront, hoodieLeft, hoodieRight, hoodieBack } from "../assets/imgs/png/hoodie/index.jsx";
import { hatFront, hatBack, hatRight, hatLeft } from "../assets/imgs/png/hat/index.jsx";
import { capFront, capBack } from "../assets/imgs/png/cap/index.jsx";
import { bagFront, bagBack } from "../assets/imgs/png/bag/index.jsx";
import { cupFront, cupBack } from "../assets/imgs/png/cup/index.jsx";
import { stickerFront } from "../assets/imgs/png/sticker/index.jsx";
import { bottleFront } from "../assets/imgs/png/bottle/index.jsx";
import {Bag, Bottle, Cap, Cups, Hat, Hoodie, Stickers, Tshirt} from "../assets/imgs/png/index.js";

export const productsData = [
    { id: 1, name: 'Футболка', price: 50, img: Tshirt, type: 'apparel', category: 'Одяг' },
    { id: 2, name: 'Худі', price: 60, img: Hoodie, type: 'apparel', category: 'Одяг' },
    { id: 3, name: 'Шапка', price: 25, img: Hat, type: 'accessory', category: 'Одяг' },
    { id: 4, name: 'Кепка', price: 20, img: Cap, type: 'accessory', category: 'Одяг' },
    { id: 5, name: 'Шопер', price: 15, img: Bag, type: 'accessory', category: 'Аксесуари' },
    { id: 6, name: 'Стакан', price: 10, img: Cups, type: 'accessory', category: 'Аксесуари' },
    { id: 7, name: 'Стікер', price: 5, img: Stickers, type: 'accessory', category: 'Аксесуари' },
    { id: 8, name: 'Пляшка', price: 12, img: Bottle, type: 'accessory', category: 'Аксесуари' },
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
