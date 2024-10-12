import { OverViewPageView } from '@/sections/overview/view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EloFi Dashboard',
  description: 'Dashboard for application.'
};

export default function Page() {
  return <OverViewPageView />;
}
