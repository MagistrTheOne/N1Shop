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
  { id:'p18', slug:'iphone-18-pro', name:'iPhone 18 Pro', category:'iphone', label:'Новинка 2026', detail:'Конфигурации и цвета уточняются', price:null, available:null, tone:'graphite', shape:'phone', featured:true },
  { id:'pduo', slug:'iphone-duo', name:'iPhone Duo', category:'iphone', label:'Складной iPhone', detail:'Конфигурации и цвета уточняются', price:null, available:null, tone:'graphite', shape:'phone', featured:true },
  { id:'pair', slug:'iphone-air', name:'iPhone Air', category:'iphone', label:'Ультратонкий iPhone', detail:'Конфигурации и цвета уточняются', price:null, available:null, tone:'graphite', shape:'phone', featured:true },
  { id:'p17', slug:'iphone-17', name:'iPhone 17', category:'iphone', label:'iPhone', detail:'Конфигурации и цвета уточняются', price:null, available:null, tone:'graphite', shape:'phone', featured:true },
  { id:'p17e', slug:'iphone-17e', name:'iPhone 17e', category:'iphone', label:'iPhone', detail:'Конфигурации и цвета уточняются', price:null, available:null, tone:'graphite', shape:'phone' },
  { id:'p16', slug:'iphone-16', name:'iPhone 16', category:'iphone', label:'iPhone', detail:'Конфигурации и цвета уточняются', price:null, available:null, tone:'graphite', shape:'phone' },
  { id:'p2', slug:'macbook-pro', name:'MacBook Pro', category:'mac', label:'Ноутбуки', detail:'Конфигурации уточняются', price:null, available:null, tone:'graphite', shape:'laptop' },
  { id:'p3', slug:'ipad-pro', name:'iPad Pro', category:'ipad', label:'Планшеты', detail:'Конфигурации уточняются', price:null, available:null, tone:'silver', shape:'tablet' },
  { id:'p4', slug:'apple-watch', name:'Apple Watch', category:'watch', label:'Часы', detail:'Конфигурации уточняются', price:null, available:null, tone:'graphite', shape:'watch' },
  { id:'p5', slug:'airpods-pro', name:'AirPods Pro', category:'airpods', label:'Наушники', detail:'Конфигурации уточняются', price:null, available:null, tone:'white', shape:'buds' },
  { id:'p6', slug:'apple-tv', name:'Apple TV', category:'tv', label:'Для дома', detail:'Конфигурации уточняются', price:null, available:null, tone:'graphite', shape:'tv' },
  { id:'p7', slug:'accessory', name:'Аксессуары Apple', category:'accessories', label:'Аксессуары', detail:'Ассортимент уточняется', price:null, available:null, tone:'silver', shape:'accessory' },
];
export const findProduct = (slug: string) => products.find((p) => p.slug === slug);
export const formatRub = (price: number | null) => price === null ? 'Цена по запросу' : `${new Intl.NumberFormat('ru-RU').format(price)} ₽`;
