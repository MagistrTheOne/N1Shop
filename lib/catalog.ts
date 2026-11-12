export type CategorySlug = 'iphone' | 'mac' | 'ipad' | 'watch' | 'airpods' | 'tv' | 'accessories';
export type Product = { id: string; slug: string; name: string; category: CategorySlug; label: string; detail: string; price: number | null; available: boolean | null; tone: string; shape: 'phone' | 'laptop' | 'tablet' | 'watch' | 'buds' | 'tv' | 'accessory'; featured?: boolean };
export const categories: { slug: CategorySlug; name: string; shape: Product['shape']; tone: string }[] = [
  { slug: 'iphone', name: 'iPhone', shape: 'phone', tone: 'graphite' },
  { slug: 'mac', name: 'Mac', shape: 'laptop', tone: 'silver' },
  { slug: 'ipad', name: 'iPad', shape: 'tablet', tone: 'graphite' },
  { slug: 'watch', name: 'Apple Watch', shape: 'watch', tone: 'graphite' },
  { slug: 'airpods', name: 'AirPods', shape: 'buds', tone: 'white' },
  { slug: 'tv', name: 'Apple TV', shape: 'tv', tone: 'graphite' },
  { slug: 'accessories', name: 'Аксессуары', shape: 'accessory', tone: 'silver' },
];
export const products: Product[] = [
  { id: 'p1', slug: 'iphone-pro-concept', name: 'iPhone Pro', category: 'iphone', label: 'Смартфоны', detail: 'Графит · конфигурации уточняются', price: null, available: null, tone: 'graphite', shape: 'phone', featured: true },
  { id: 'p2', slug: 'macbook-pro', name: 'MacBook Pro', category: 'mac', label: 'Ноутбуки', detail: 'Тёмный корпус · конфигурации уточняются', price: null, available: null, tone: 'graphite', shape: 'laptop', featured: true },
  { id: 'p3', slug: 'ipad-pro', name: 'iPad Pro', category: 'ipad', label: 'Планшеты', detail: 'Тёмный корпус · конфигурации уточняются', price: null, available: null, tone: 'silver', shape: 'tablet', featured: true },
  { id: 'p4', slug: 'apple-watch', name: 'Apple Watch', category: 'watch', label: 'Часы', detail: 'Конфигурации уточняются', price: null, available: null, tone: 'graphite', shape: 'watch', featured: true },
  { id: 'p5', slug: 'airpods-pro', name: 'AirPods Pro', category: 'airpods', label: 'Наушники', detail: 'Конфигурации уточняются', price: null, available: null, tone: 'white', shape: 'buds' },
  { id: 'p6', slug: 'apple-tv', name: 'Apple TV', category: 'tv', label: 'Для дома', detail: 'Конфигурации уточняются', price: null, available: null, tone: 'graphite', shape: 'tv' },
  { id: 'p7', slug: 'accessory', name: 'Аксессуары Apple', category: 'accessories', label: 'Аксессуары', detail: 'Ассортимент уточняется', price: null, available: null, tone: 'silver', shape: 'accessory' },
];
export const findProduct = (slug: string) => products.find((p) => p.slug === slug);
export const formatRub = (price: number | null) => price === null ? 'Цена по запросу' : `${new Intl.NumberFormat('ru-RU').format(price)} ₽`;
