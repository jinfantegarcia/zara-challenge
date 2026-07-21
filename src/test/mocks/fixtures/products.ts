import type { ProductDetail, ProductListItem } from '@/types/product';

const IMAGE_HOST = 'http://prueba-tecnica-api-tienda-moviles.onrender.com/images';

// Mirrors the live API payload, including two real quirks the app must survive:
// duplicated product ids in the list and http:// image urls.
export const productListFixture: ProductListItem[] = [
  {
    id: 'SMG-S24U',
    brand: 'Samsung',
    name: 'Galaxy S24 Ultra',
    basePrice: 1329,
    imageUrl: `${IMAGE_HOST}/SMG-S24U-titanium-violet.webp`,
  },
  {
    id: 'APL-I15PM',
    brand: 'Apple',
    name: 'iPhone 15 Pro Max',
    basePrice: 1319,
    imageUrl: `${IMAGE_HOST}/APL-I15PM-titanio-azul.webp`,
  },
  {
    id: 'XMI-RN13P5G',
    brand: 'Xiaomi',
    name: 'Redmi Note 13 Pro 5G',
    basePrice: 399,
    imageUrl: `${IMAGE_HOST}/XMI-RN13P5G-midnight-black.webp`,
  },
  {
    id: 'XMI-RN13P5G',
    brand: 'Xiaomi',
    name: 'Redmi Note 13 Pro 5G',
    basePrice: 399,
    imageUrl: `${IMAGE_HOST}/XMI-RN13P5G-midnight-black.webp`,
  },
  {
    id: 'GPX-8A',
    brand: 'Google',
    name: 'Pixel 8a',
    basePrice: 549,
    imageUrl: `${IMAGE_HOST}/GPX-8A-obsidiana.webp`,
  },
  {
    id: 'MTO-G24',
    brand: 'Motorola',
    name: 'g24',
    basePrice: 119,
    imageUrl: `${IMAGE_HOST}/MTO-G24-gris.webp`,
  },
];

export const productDetailFixture: ProductDetail = {
  id: 'SMG-S24U',
  brand: 'Samsung',
  name: 'Galaxy S24 Ultra',
  description:
    'El Samsung Galaxy S24 Ultra es un smartphone de gama alta con una pantalla Dynamic AMOLED 2X de 6.8 pulgadas, procesador Qualcomm Snapdragon 8 Gen 3 for Galaxy, y un avanzado sistema de cámara con inteligencia artificial.',
  basePrice: 1329,
  rating: 4.6,
  specs: {
    screen: '6.8" Dynamic AMOLED 2X',
    resolution: '3120 x 1440 pixels',
    processor: 'Qualcomm Snapdragon 8 Gen 3 for Galaxy Octa-Core',
    mainCamera:
      '200 MP (F1.7) Principal, OIS + 10 MP (F2.4) Zoom x3, OIS + 12 MP (F2.2) Ultra gran angular + 50 MP (F3.4) Zoom x5, OIS',
    selfieCamera: '12 MP',
    battery: '5000 mAh',
    os: 'Android 14',
    screenRefreshRate: '120 Hz',
  },
  colorOptions: [
    {
      name: 'Titanium Violet',
      hexCode: '#8E6F96',
      imageUrl: `${IMAGE_HOST}/SMG-S24U-titanium-violet.webp`,
    },
    {
      name: 'Titanium Black',
      hexCode: '#000000',
      imageUrl: `${IMAGE_HOST}/SMG-S24U-titanium-black.webp`,
    },
    {
      name: 'Titanium Gray',
      hexCode: '#8D8D8D',
      imageUrl: `${IMAGE_HOST}/SMG-S24U-titanium-gray.webp`,
    },
    {
      name: 'Titanium Yellow',
      hexCode: '#F0E5C1',
      imageUrl: `${IMAGE_HOST}/SMG-S24U-titanium-yellow.webp`,
    },
  ],
  storageOptions: [
    { capacity: '256 GB', price: 1229 },
    { capacity: '512 GB', price: 1329 },
    { capacity: '1 TB', price: 1529 },
  ],
  similarProducts: [
    {
      id: 'APL-I15PM',
      brand: 'Apple',
      name: 'iPhone 15 Pro Max',
      basePrice: 1319,
      imageUrl: `${IMAGE_HOST}/APL-I15PM-titanio-azul.webp`,
    },
    {
      id: 'GPX-8A',
      brand: 'Google',
      name: 'Pixel 8a',
      basePrice: 549,
      imageUrl: `${IMAGE_HOST}/GPX-8A-obsidiana.webp`,
    },
    {
      id: 'MTO-G24',
      brand: 'Motorola',
      name: 'g24',
      basePrice: 119,
      imageUrl: `${IMAGE_HOST}/MTO-G24-gris.webp`,
    },
  ],
};
