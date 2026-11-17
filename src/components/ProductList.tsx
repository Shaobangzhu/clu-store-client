import type { ReactNode } from 'react';
import CatalogStatus from './CatalogStatus';

export default function ProductList({ title, datalength, children }: {
  title?: string; datalength: number; children: ReactNode;
}) {
  return <section className="mt-16 grid justify-items-center gap-y-12">
    <h2 className="text-3xl font-extrabold dark:text-white">{title}</h2>
    {datalength > 0 ? children : <CatalogStatus empty />}
  </section>;
}
