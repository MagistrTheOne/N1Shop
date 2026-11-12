import type { Metadata } from 'next';
import { CartPage } from '@/components/storefront';
export const metadata:Metadata={title:'Корзина'};
export default function Page(){return <CartPage/>;}
