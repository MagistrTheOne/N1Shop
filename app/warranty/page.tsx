import type { Metadata } from 'next';
import { InfoPage } from '@/components/storefront';
export const metadata:Metadata={title:'N1 — warranty'};
export default function Page(){return <InfoPage type="warranty"/>;}
