
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, Award, Check, ChevronDown, CreditCard, Menu,
  Minus, Plus, RefreshCcw, Search, ShieldCheck, ShoppingBag,
  SlidersHorizontal, Truck, UserRound, X
} from "lucide-react";
import { categories, products, formatRub, type Product } from "@/lib/catalog";
import { DeviceArt } from "@/components/device-art";

type Cart = Record<string, number>;
const cartKey = "n1-demo-cart";
function readCart(): Cart {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(cartKey) || "{}") as Cart; }
  catch { return {}; }
}
function useCart() {
  const [cart, setCart] = useState<Cart>({});
  useEffect(() => {
    const sync = () => setCart(readCart());
    sync();
    window.addEventListener("n1-cart-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("n1-cart-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  function change(id: string, delta: number) {
    const next = {...readCart()};
    next[id] = Math.max(0, (next[id] || 0) + delta);
    if (!next[id]) delete next[id];
    localStorage.setItem(cartKey, JSON.stringify(next));
    window.dispatchEvent(new Event("n1-cart-change"));
  }
  return {cart, change, count: Object.values(cart).reduce((sum, v) => sum + v, 0)};
}

function Header({count, openCart}: {count: number; openCart: () => void}) {
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const matches = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  return <header className="n1-header">
    <div className="n1-container n1-header-inner">
      <Link href="/" className="n1-brand" aria-label="N1 — на главную">
        <strong>N1</strong><i/><span>Магазин техники Apple<br/>в России</span>
      </Link>
      <nav className="n1-nav" aria-label="Основная навигация">
        <Link href="/catalog">Каталог <ChevronDown size={13}/></Link>
        {categories.map(c => <Link href={"/catalog?category=" + c.slug} key={c.slug}>{c.name}</Link>)}
      </nav>
      <div className="n1-header-actions">
        <button aria-label="Поиск" onClick={() => setSearch(!search)}><Search size={21}/></button>
        <Link href="/contacts" className="n1-account" aria-label="Контакты"><UserRound size={20}/></Link>
        <button aria-label={"Открыть корзину, товаров: " + count} onClick={openCart} className="n1-bag">
          <ShoppingBag size={21}/><span>{count}</span>
        </button>
        <button className="n1-burger" aria-label={mobile ? "Закрыть меню" : "Открыть меню"} onClick={() => setMobile(!mobile)}>{mobile ? <X/> : <Menu/>}</button>
      </div>
    </div>
    {search && <div className="n1-search-panel"><div className="n1-container">
      <div className="n1-search-input"><Search size={20}/><input autoFocus aria-label="Поиск товаров" placeholder="Найти технику Apple..." value={query} onChange={e => setQuery(e.target.value)}/><button aria-label="Закрыть поиск" onClick={() => setSearch(false)}><X size={20}/></button></div>
      {query && <div className="n1-search-results">{matches.length ? matches.map(p => <Link key={p.id} href={"/product/" + p.slug} onClick={() => setSearch(false)}>{p.name}<ArrowRight size={16}/></Link>) : <p>Ничего не найдено</p>}</div>}
    </div></div>}
    {mobile && <nav className="n1-mobile-nav" aria-label="Мобильная навигация">
      <Link href="/catalog" onClick={() => setMobile(false)}>Весь каталог</Link>
      {categories.map(c => <Link href={"/catalog?category=" + c.slug} key={c.slug} onClick={() => setMobile(false)}>{c.name}</Link>)}
    </nav>}
  </header>;
}

function Footer() {
  return <footer className="n1-footer">
    <div className="n1-container n1-footer-main">
      <div className="n1-footer-brand"><div className="n1-brand"><strong>N1</strong><i/><span>Магазин техники Apple<br/>в России</span></div><b>@legko_o</b><small>Независимый магазин. Не является представительством Apple.</small></div>
      <div><h3>Покупателям</h3><Link href="/delivery">Доставка</Link><Link href="/warranty">Гарантия</Link><Link href="/returns">Возврат и обмен</Link><Link href="/cart">Корзина</Link></div>
      <div><h3>О магазине</h3><Link href="/catalog">Каталог</Link><Link href="/contacts">Контакты</Link><Link href="/legal">Правовая информация</Link></div>
      <div><h3>Связаться с нами</h3><p>Актуальные контакты продавца появятся перед запуском.</p><span>@legko_o</span></div>
    </div>
    <div className="n1-container n1-footer-bottom"><span>© 2026 N1. Все права защищены.</span><div><Link href="/legal">Правовая информация</Link><span>Apple — товарный знак Apple Inc.</span></div></div>
  </footer>;
}

function CartDrawer({open, close}: {open: boolean; close: () => void}) {
  const {cart, change} = useCart();
  if (!open) return null;
  const entries = Object.entries(cart).map(([id, qty]) => ({product: products.find(p => p.id === id), qty})).filter(v => v.product);
  return <div className="n1-overlay" onMouseDown={close}><aside className="n1-drawer" role="dialog" aria-modal="true" aria-label="Корзина" onMouseDown={e => e.stopPropagation()}>
    <div className="n1-drawer-title"><h2>Корзина</h2><button aria-label="Закрыть корзину" onClick={close}><X/></button></div>
    {entries.length ? <><div className="n1-drawer-list">{entries.map(v => v.product && <div className="n1-drawer-item" key={v.product.id}><div className="n1-mini-art"><DeviceArt shape={v.product.shape}/></div><div><strong>{v.product.name}</strong><p>{formatRub(v.product.price)}</p><div className="n1-counter"><button aria-label="Уменьшить" onClick={() => change(v.product!.id, -1)}><Minus size={15}/></button>{v.qty}<button aria-label="Увеличить" onClick={() => change(v.product!.id, 1)}><Plus size={15}/></button></div></div></div>)}</div><div className="n1-drawer-foot"><p>Демонстрационная корзина. Оформление заказа пока недоступно.</p><Link className="n1-button n1-button-white" href="/cart" onClick={close}>Открыть корзину <ArrowRight size={17}/></Link></div></>
    : <div className="n1-empty-cart"><ShoppingBag size={43} strokeWidth={1.3}/><h3>Здесь пока пусто</h3><p>Выберите товар из каталога.</p><Link className="n1-button n1-button-white" href="/catalog" onClick={close}>Перейти в каталог</Link></div>}
  </aside></div>;
}

function Shell({children}: {children: React.ReactNode}) {
  const {count} = useCart();
  const [open, setOpen] = useState(false);
  return <><Header count={count} openCart={() => setOpen(true)}/>{children}<Footer/><CartDrawer open={open} close={() => setOpen(false)}/></>;
}

const slides: {title: string; label: string; description: string; type: Product["shape"]; href: string}[] = [
  {title:"iPhone 18 Pro", label:"Новинка 2026", description:"Мощнее. Умнее. Ещё ближе.", type:"phone", href:"/product/iphone-18-pro"},
  {title:"MacBook Pro", label:"Для больших идей", description:"Работай на своих условиях.", type:"laptop", href:"/catalog?category=mac"},
  {title:"Apple Watch", label:"Каждый день", description:"Важное всегда рядом.", type:"watch", href:"/catalog?category=watch"},
];
function Hero() {
  const [index, setIndex] = useState(0);
  const s = slides[index];
  const advance = (delta: number) => setIndex(v => (v + delta + slides.length) % slides.length);
  return <section className="n1-hero" aria-label="Главная коллекция">
    <div className="n1-hero-light"/><div className="n1-hero-orbit"/>
    <div className={"n1-hero-device n1-hero-" + s.type}>{index === 0 ? <Image src="/images/products/iphone-18-pro.webp" alt="iPhone 18 Pro" fill priority unoptimized sizes="(max-width: 640px) 90vw, 48vw" onError={e => {e.currentTarget.src="/images/products/iphone-18-pro.svg";}} style={{objectFit:"contain"}}/> : <DeviceArt shape={s.type} large/>}</div>
    <div className="n1-container n1-hero-content">
      <span className="n1-hero-label">{s.label}</span><h1>{s.title}</h1><p>{s.description}</p>
      <div className="n1-hero-ctas"><Link className="n1-button n1-button-white" href={s.href}>В каталог <ArrowRight size={18}/></Link><Link className="n1-button n1-button-outline" href="/catalog">Подробнее</Link></div>
      <div className="n1-hero-dots" aria-label="Выбор слайда">{slides.map((slide, i) => <button key={slide.title} aria-label={"Слайд " + (i + 1)} aria-current={index === i ? "true" : undefined} className={index === i ? "active" : ""} onClick={() => setIndex(i)}/>)}</div>
    </div>
    <button className="n1-hero-arrow n1-hero-prev" aria-label="Предыдущий слайд" onClick={() => advance(-1)}><ArrowLeft/></button>
    <button className="n1-hero-arrow n1-hero-next" aria-label="Следующий слайд" onClick={() => advance(1)}><ArrowRight/></button>
    <span className="n1-hero-caption"></span>
  </section>;
}

function CategoryStrip() {
  return <section className="n1-container n1-categories">
    <div className="n1-section-heading"><h2>Каталог</h2><Link href="/catalog">Весь каталог <ArrowRight size={17}/></Link></div>
    <div className="n1-category-grid">{categories.map(c => <Link className="n1-category-tile" href={"/catalog?category=" + c.slug} key={c.slug}>
      <span className="n1-category-title">{c.name}</span><span className="n1-category-arrow"><ArrowRight size={19}/></span>
      <div className="n1-category-art">{c.slug === "iphone" ? <Image src="/images/products/iphone-18-pro.svg" alt="" fill unoptimized sizes="180px" onError={e => {e.currentTarget.src="/images/products/iphone-18-pro.svg";}} style={{objectFit:"contain"}}/> : <DeviceArt shape={c.shape} tone={c.tone}/>}</div>
    </Link>)}</div>
  </section>;
}
export function ProductCard({product}: {product: Product}) {
  return <article className="n1-product-card"><Link href={"/product/" + product.slug} aria-label={"Подробнее: " + product.name}>
    <div className="n1-product-art">{product.category === "iphone" ? <Image src={"/images/products/" + product.slug + ".webp"} alt={product.name} fill unoptimized sizes="(max-width:640px) 50vw, 25vw" onError={e => {e.currentTarget.src="/images/products/" + product.slug + ".svg";}} style={{objectFit:"contain"}}/> : <DeviceArt shape={product.shape} tone={product.tone}/>}</div>
    <div className="n1-product-copy"><small>{product.label}</small><h3>{product.name}</h3><p>{product.detail}</p><div>{product.price !== null && <strong>{formatRub(product.price)}</strong>}<span className="n1-product-arrow"><ArrowRight size={17}/></span></div></div>
  </Link></article>;
}
function Featured() {
  return <section className="n1-container n1-featured">
    <div className="n1-section-heading"><div><span className="n1-kicker">N1 / ПОДБОРКА</span><h2>Техника, которую выбирают</h2></div><Link href="/catalog">Смотреть всё <ArrowRight size={17}/></Link></div>
    <div className="n1-products-grid">{products.filter(p => p.featured).map(p => <ProductCard product={p} key={p.id}/>)}</div>
    <p className="n1-disclaimer">Ассортимент и наличие уточняются.</p>
  </section>;
}
function Benefits() {
  const points = [
    {icon:ShieldCheck, title:"Проверка техники", detail:"Перед передачей покупателю"},
    {icon:Award, title:"Гарантия", detail:"Условия уточняются"},
    {icon:Truck, title:"Доставка", detail:"Способы уточняются"},
    {icon:CreditCard, title:"Оплата", detail:"Способы уточняются"},
    {icon:RefreshCcw, title:"Возврат и обмен", detail:"По законодательству РФ"},
  ];
  return <section className="n1-benefits"><div className="n1-container n1-benefits-grid">{points.map(({icon:Icon,title,detail}) => <div className="n1-benefit" key={title}><Icon size={27} strokeWidth={1.35}/><div><b>{title}</b><span>{detail}</span></div></div>)}</div></section>;
}
export function HomePage() {
  return <Shell><main><Hero/><CategoryStrip/><Featured/><Benefits/></main></Shell>;
}
export function CatalogPage({initialCategory}: {initialCategory?: string}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory || "all");
  const [sort, setSort] = useState("default");
  const filtered = useMemo(() => {
    const result = products.filter(p => (category === "all" || p.category === category) && p.name.toLowerCase().includes(query.toLowerCase()));
    return sort === "name" ? [...result].sort((a,b) => a.name.localeCompare(b.name, "ru")) : result;
  }, [query, category, sort]);
  return <Shell><main className="n1-container n1-inner-page">
    <span className="n1-kicker">N1 / КАТАЛОГ</span><h1>Каталог Apple</h1><p className="n1-page-intro">Все категории в одном месте. Ассортимент и цены появятся после загрузки данных магазина.</p>
    <div className="n1-catalog-tools"><label className="n1-catalog-search"><Search size={19}/><input aria-label="Поиск по каталогу" placeholder="Поиск по каталогу" value={query} onChange={e => setQuery(e.target.value)}/></label><label className="n1-sort"><SlidersHorizontal size={18}/><select aria-label="Сортировка" value={sort} onChange={e => setSort(e.target.value)}><option value="default">По умолчанию</option><option value="name">По названию</option></select></label></div>
    <div className="n1-chips"><button className={category === "all" ? "selected" : ""} onClick={() => setCategory("all")}>Все товары</button>{categories.map(c => <button key={c.slug} className={category === c.slug ? "selected" : ""} onClick={() => setCategory(c.slug)}>{c.name}</button>)}</div>
    <p className="n1-result-count">Найдено: {filtered.length}</p>
    {filtered.length ? <div className="n1-products-grid">{filtered.map(p => <ProductCard key={p.id} product={p}/>)}</div> : <div className="n1-empty"><Search size={36}/><h2>Ничего не найдено</h2><p>Измените запрос или категорию.</p><button onClick={() => {setCategory("all");setQuery("");}}>Сбросить фильтры</button></div>}
    <p className="n1-disclaimer">Изображения служат иллюстрацией внешнего вида; комплектации уточняются.</p>
  </main><Benefits/></Shell>;
}
export function ProductPage({product}: {product: Product}) {
  const {change} = useCart();
  const [added, setAdded] = useState(false);
  return <Shell><main className="n1-container n1-inner-page">
    <div className="n1-breadcrumbs"><Link href="/">Главная</Link><span>/</span><Link href="/catalog">Каталог</Link><span>/</span><span>{product.name}</span></div>
    <div className="n1-detail">
      <div className="n1-detail-art">{product.category === "iphone" ? <Image src={"/images/products/" + product.slug + ".svg"} alt={"Иллюстрация " + product.name} fill unoptimized sizes="(max-width:640px) 100vw, 50vw" onError={e => {e.currentTarget.src="/images/products/" + product.slug + ".svg";}} style={{objectFit:"contain"}}/> : <DeviceArt shape={product.shape} tone={product.tone} large/>}</div>
      <div className="n1-detail-info"><span className="n1-kicker">{product.label}</span><h1>{product.name}</h1><p>{product.detail}</p><hr/>{product.price !== null && <h2>{formatRub(product.price)}</h2>}<p>Наличие и конфигурации уточняются.</p>
      <button className="n1-button n1-button-white" onClick={() => {change(product.id,1);setAdded(true);}}>{added ? "Добавлено в демо-корзину" : "Добавить в демо-корзину"} {added ? <Check size={18}/> : <ShoppingBag size={18}/>}</button>
      <p className="n1-detail-note">Заказ и оплата пока недоступны. Карточка создана для демонстрации дизайна.</p>
      <div className="n1-detail-features"><div><ShieldCheck size={20}/>Проверка перед передачей</div><div><Truck size={20}/>Условия доставки будут опубликованы позже</div></div>
      </div>
    </div>
  </main><Benefits/></Shell>;
}
export function CartPage() {
  const {cart, change} = useCart();
  const selected = Object.entries(cart).map(([id, qty]) => ({product: products.find(p => p.id === id), qty})).filter(v => v.product);
  return <Shell><main className="n1-container n1-inner-page n1-cart-page"><span className="n1-kicker">N1 / ПОКУПКИ</span><h1>Корзина</h1>
    {selected.length ? <><div className="n1-cart-items">{selected.map(v => v.product && <div className="n1-cart-item" key={v.product.id}><div className="n1-mini-art"><DeviceArt shape={v.product.shape}/></div><div className="n1-cart-item-copy"><Link href={"/product/" + v.product.slug}>{v.product.name}</Link><p>{formatRub(v.product.price)}</p></div><div className="n1-counter"><button aria-label="Уменьшить количество" onClick={() => change(v.product!.id, -1)}><Minus size={17}/></button>{v.qty}<button aria-label="Увеличить количество" onClick={() => change(v.product!.id, 1)}><Plus size={17}/></button></div></div>)}</div><div className="n1-demo-checkout">Оформление заказа пока недоступно — это демонстрационный интерфейс.</div></> : <div className="n1-empty"><ShoppingBag size={40}/><h2>Корзина пуста</h2><Link className="n1-button n1-button-white" href="/catalog">Перейти в каталог <ArrowRight size={17}/></Link></div>}
  </main></Shell>;
}
const info: Record<string, {title:string; subtitle:string; paragraphs:string[]}> = {
  delivery:{title:"Доставка",subtitle:"Информация о доставке",paragraphs:["Способы, сроки, стоимость и территория доставки будут опубликованы после подтверждения продавцом.","До публикации условий заказы через сайт не принимаются."]},
  warranty:{title:"Гарантия",subtitle:"Условия гарантийного обслуживания",paragraphs:["Условия гарантии будут опубликованы на основании документов продавца и применимого законодательства.","Магазин не заявляет о статусе авторизованного сервисного центра Apple."]},
  returns:{title:"Возврат и обмен",subtitle:"Информация для покупателей",paragraphs:["Порядок возврата и обмена будет опубликован после юридической проверки с учётом законодательства РФ.","До запуска продаж оформление заказа отключено."]},
  contacts:{title:"Контакты",subtitle:"Связь с N1",paragraphs:["Актуальные реквизиты и контакты продавца будут опубликованы перед началом продаж.","Социальный профиль проекта: @legko_o."]},
  legal:{title:"Правовая информация",subtitle:"Информация о проекте",paragraphs:["Сайт находится в разработке. Каталог, изображения, цены и наличие носят демонстрационный характер и не являются публичной офертой.","N1 — независимый ресейлер. Apple и названия продуктов являются товарными знаками Apple Inc.","Условия использования и правила обработки персональных данных будут опубликованы до коммерческого запуска."]}
};
export function InfoPage({type}: {type: string}) {
  const page = info[type] || info.legal;
  return <Shell><main className="n1-container n1-inner-page n1-info"><span className="n1-kicker">N1 / ИНФОРМАЦИЯ</span><h1>{page.title}</h1><h2>{page.subtitle}</h2>{page.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}<Link href="/" className="n1-info-back"><ArrowLeft size={17}/>На главную</Link></main></Shell>;
}
