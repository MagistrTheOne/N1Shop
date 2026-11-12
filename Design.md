N1 STORE — CODEX FRONTEND DESIGN & IMPLEMENTATION SPECIFICATION
Version: 1.0 | 12 November 2026 | Status: implementation-ready
Mission
Build a premium Russian-language Apple-product resale storefront, desktop-first, faithfully following the supplied N1 reference screenshot. Frontend only; product catalog powered by local typed data. Do not claim Apple authorization without documentary evidence.
Non-negotiable visual constraints
1. Hero is FULL BLEED, immediately adjacent to header. No outer card, no rounded banner container, no visible gutters between header and hero.
2. Hero visual: dark graphite photographic product composition, phone anchored to right, copy on left. Use a licensed real product image or owner-provided asset; do not use an invented product render as a factual listing. If the reference's iPhone 18 Pro image is unavailable, use a clearly marked concept placeholder until approved assets arrive.
3. No forced one-screen page. Do NOT use height:100vh, max-height:100vh, overflow:hidden on page/root, or scale down sections to make footer visible in a screenshot. Natural vertical scrolling is required.
4. Do not reduce hero below 480px on desktop. Desktop target 520px; use min-height: clamp(480px, 38vw, 620px) with content-dependent mobile adaptation.
5. Layout sections must breathe: 72–104px vertical section spacing where appropriate; category cards ~150–180px high. Footer remains below content, never pinned.
6. No neon, glassmorphism overload, cyan glows, gratuitous gradients, floating blobs, AI-generated generic aesthetics, or decorative gold unless explicitly approved.
Reference hierarchy
Use attached screenshot as primary art direction for visual composition, layout, header, typography and card hierarchy. This specification supersedes screenshot only for legal accuracy, accessibility, mobile responsiveness, and functional behavior. Reference shows the entire page squeezed into one 720px-high screenshot; DO NOT replicate that vertical compression. Preserve proportions and hierarchy while allowing the real page to scroll.
Design tokens
Colors:
- background #08090B
- surface #0D0F12
- elevated #17191D
- border #25282D
- text #F5F5F7
- muted #989BA3
- muted-2 #6E727A
- white-button #F5F5F7, black-button-text #08090B
- success #36B37E, only for stock status
  Fonts: Inter (self-hosted/open-source) with system fallback; do not bundle SF Pro unless licensed.
  Desktop H1 64px/1.05, weight 650–700; H2 36px/1.15; H3 24px/1.2; body 16px/1.55; nav 13–14px/1.4; captions 12px/1.5. On tablet/mobile use fluid clamp sizing.
  Spacing 4px base scale; content max-width 1320px; horizontal gutters 48px desktop, 24px tablet, 16px mobile.
  Radius: button 10px, product/category card 14px, image tile 12px. Shadows subtle or absent.
Page structure
Header
Full-width black header, 64px tall desktop, subtle bottom border, sticky optional only if it does not obscure hero. Left: N1 wordmark + slim divider + neutral reseller descriptor (NOT 'official Apple' unless verified). Center: Catalog dropdown, iPhone, Mac, iPad, Apple Watch, AirPods, Apple TV, Accessories. Right: search, account placeholder, shopping bag with dynamic item count. Functional keyboard-accessible nav, search and mobile menu.
Hero
Full-bleed section under header, black/graphite photographic background. Text column left, product visual right. Left eyebrow 'Apple', H1 'iPhone 18 Pro' ONLY if this is the approved real product being sold; otherwise configurable featured model. Subtitle configurable. Buttons 'Купить' (route to relevant listing/product) and 'Подробнее' (product details). Optional carousel with controls and indicators only if multiple real slides exist. Gradient overlay allowed ONLY to ensure left copy contrast and blend imagery seamlessly into background; not as decorative glow. Object positioning right center, no distortion or stretched phone. Image with responsive sizes, priority loading, optimized format.
Categories
Section heading 'Каталог', link 'Весь каталог'. Seven category tiles: iPhone, Mac, iPad, Apple Watch, AirPods, Apple TV, Аксессуары. Desktop: 7 columns if >=1280px and enough width, otherwise horizontal overflow carousel; tablet 3–4 columns; mobile 2 columns or horizontal swipe. Cards dark with high-quality transparent-cutout product imagery, text top-left and arrow bottom-left. All cards clickable and keyboard accessible.
Featured products
A separate section below categories, never omit just to fit a viewport. Grid 4 columns desktop, 2 tablet, 1–2 mobile. Each card: image, model, storage/color variants, price in RUB, stock state, add-to-cart. Data-driven, no fabricated availability/prices.
Trust strip
5 concise points: authenticity claims only if provable; warranty accurately described; shipping across Russia only if actually offered; payment methods only if supported; returns terms must match applicable law. Icons line-style Lucide, subtle dividers.
Footer
N1 wordmark and social handle @legko_o (verify account/links before activating), navigation columns 'Покупателям', 'О нас', 'Связаться с нами', real support address only when supplied. Copyright © 2026 N1. Legal links: privacy, personal-data processing, offer/terms, returns, business requisites as applicable. No fake email, phone or legal entity details.
Catalog data contract
Product: id, slug, title, brand, category, description, images[], variants[{sku,color,storage,priceRub,stockStatus}], specs[{label,value}], badges[], featured, published. Category: slug, title, image, order. Product content is stored in src/data/products.ts or JSON and validated with Zod. Seed content must be clearly marked demo data and not represented as actual inventory.
Catalog interactions
Text search by model/name, category filters, price range, storage/color filters where applicable, sort by price/name/newness, product detail route, variant selection, cart quantity, cart persistence in localStorage, empty states, loading skeletons and accessible focus states. No pretend checkout; show 'Оформление заказа скоро появится' or a verified contact flow.
Technical stack
Next.js 16 App Router, React, TypeScript strict, Tailwind CSS, shadcn/ui selectively, Lucide icons, Zustand cart state, Zod validation. Avoid needless dependencies. Use next/image, next/font, metadata/OG, semantic landmarks, aria labels, accessible contrast, keyboard navigation. All pages responsive at 375, 768, 1024, 1440, 1920px. Lighthouse performance/accessibility target >=90 on representative pages (target, not guaranteed).
Suggested folder tree
src/app/{page.tsx,layout.tsx,globals.css,catalog/page.tsx,catalog/[category]/page.tsx,product/[slug]/page.tsx,cart/page.tsx,delivery/page.tsx,warranty/page.tsx,returns/page.tsx,contacts/page.tsx,legal/page.tsx}
src/components/{layout/{header,footer,mobile-nav},home/{hero,category-strip,featured-products,trust-strip},catalog/{product-card,filters,sort-control},cart/{cart-item,cart-summary},ui/}
src/data/{products,categories,hero-slides}.ts
src/lib/{format-rub,product-utils}.ts
src/store/cart.ts
public/images/{hero,categories,products}/
Hero implementation example
.hero {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  min-height: clamp(480px, 38vw, 620px);
  width: 100%;
  overflow: hidden;
  background: #08090b;
}
.hero__media { position:absolute; inset:0; z-index:-2; }
.hero__media img { width:100%; height:100%; object-fit:cover; object-position:65% center; }
.hero::before { content:""; position:absolute; inset:0; z-index:-1; background:linear-gradient(90deg,rgba(0,0,0,.88) 0%,rgba(0,0,0,.50) 40%,transparent 72%); }
.hero__content { width:min(100% - 96px,1320px); margin-inline:auto; padding-block:80px; }
@media(max-width:767px){
  .hero { min-height:640px; align-items:flex-start; }
  .hero__content { width:calc(100% - 32px); padding-top:52px; }
  .hero__media img { object-position:62% bottom; }
  .hero::before { background:linear-gradient(180deg,rgba(0,0,0,.88) 0%,rgba(0,0,0,.42) 48%,transparent 80%); }
}
The CSS is a starting point: tune image composition per approved asset and verify real device previews.
Acceptance criteria / QA
- At 1440x900, header + hero appear as a seamless composition; hero extends nearly 500–550px and the beginning of catalog is visible below it.
- The full page is taller than the viewport and scrolls normally.
- No overflow:hidden on html/body/main to mask page overflow.
- No horizontally overflowing desktop content; mobile category scroller may intentionally scroll within its own region.
- Hero text never overlaps critical phone details at supported widths.
- All menu links, category tiles, search, sorting, filters, cart and variant selectors work.
- No fake contact information, warranty promises, reseller authorization, product availability or prices.
- No broken images, hydration warnings, TypeScript errors, or keyboard traps.
- Screenshots at 375, 768, 1440, 1920px are inspected and corrected before handoff.
Implementation order for Codex
1. Scaffold project and tokens.
2. Build header + hero; screenshot-review 1440x900 FIRST, before other sections.
3. Add category tiles and featured product grid.
4. Add catalog/filter/product detail/cart.
5. Add trust strip, footer, informational and legal pages.
6. Run lint, typecheck, build, and responsive visual QA.
Licensing and legal
Proposed repository license: MIT for original source code only, if copyright owner approves. Do not imply MIT covers Apple logos, device photos, product trademarks, third-party fonts, UI libraries, or supplied creative assets. Maintain THIRD_PARTY_NOTICES.md and ASSET_LICENSES.md with provenance and permissions. Apple is a trademark of Apple Inc.; N1 must not imply affiliation, authorization or endorsement unless verified. Merchant legal disclosures, personal-data policy, returns and warranty terms must be reviewed against actual Russian operating arrangements before production launch.
Codex directive
Implement the site faithfully, not a generic Apple-like template. Match the screenshot's visual rhythm and full-bleed hero. Prioritize precise layout and production-quality interactions over decorative effects. NEVER compress the whole site to one viewport. Ask for missing real product images, merchant details, prices and authorized brand claims instead of inventing them.