import type { Metadata } from 'next';
import { CatalogPage } from '@/components/storefront';
export const metadata: Metadata = {title:'Каталог техники Apple',description:'Каталог N1: iPhone, Mac, iPad, Apple Watch, AirPods и аксессуары.'};
export default async function Page({searchParams}: {searchParams: Promise<{category?:string}>}) {const {category} = await searchParams; return <CatalogPage initialCategory={category}/>;}
