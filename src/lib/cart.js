import { productsData, productImages } from '../staticData/productData.js';
import { sizes } from '../../shared/catalog.js';

export function cartKey(product) {
  return JSON.stringify([
    product.id,
    product.selectedSize,
    Object.entries(product.designs || {})
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([view, design]) => [view, design.id]),
  ]);
}

export function normalizeCart(items) {
  if (!Array.isArray(items)) return [];
  return items.flatMap((item) => {
    const product = productsData.find((product) => product.id === item?.id);
    if (
      !product ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99
    )
      return [];
    const selectedSize =
      product.type === 'apparel' ? item.selectedSize : 'One size';
    if (product.type === 'apparel' && !sizes.includes(selectedSize)) return [];
    const designs = {};
    for (const [view, design] of Object.entries(item.designs || {})) {
      if (
        !productImages[product.id][view] ||
        typeof design?.id !== 'string' ||
        !/^[a-f0-9]{48}$/.test(design.id)
      )
        continue;
      designs[view] = {
        id: design.id,
        name:
          typeof design.name === 'string'
            ? design.name.slice(0, 160)
            : 'Дизайн',
        url: `/api/uploads/${design.id}`,
      };
    }
    const normalized = {
      ...product,
      quantity: item.quantity,
      selectedSize,
      designs,
    };
    return [{ ...normalized, key: cartKey(normalized) }];
  });
}
