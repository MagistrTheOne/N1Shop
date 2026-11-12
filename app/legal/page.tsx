import type { Metadata } from 'next';
import { InfoPage } from '@/components/storefront';
export const metadata:Metadata={title:'N1 — legal'};
export default function Page(){return <InfoPage type="legal"/>;}
