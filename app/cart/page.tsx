import type { Metadata } from 'next';
import { CartPage } from '@/components/storefront';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
export const metadata:Metadata={title:'Корзина'};
export const dynamic = 'force-dynamic';
export default async function Page(){if (!await getCurrentUser()) redirect('/login');return <CartPage/>;}
