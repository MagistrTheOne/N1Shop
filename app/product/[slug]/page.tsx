import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductPage } from '@/components/storefront';
import { findProduct, products } from '@/lib/catalog';
export function generateStaticParams(){return products.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}): Promise<Metadata> {const {slug}=await params;const p=findProduct(slug);return {title:p?.name ?? 'Товар не найден',description:p?.detail};}
export default async function Page({params}:{params:Promise<{slug:string}>}) {const {slug}=await params;const product=findProduct(slug);if(!product) notFound();return <ProductPage product={product}/>;}
