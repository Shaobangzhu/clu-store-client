import ProductImage from '@/components/ProductImage';
export default function ProductHero({ imageSrc, name }: { imageSrc: string; name: string }) {
  return <div className="w-full overflow-hidden rounded-3xl bg-[#f5f5f7] aspect-[4/3] flex items-center justify-center lg:sticky lg:top-28">
    <ProductImage src={imageSrc} alt={name} className="w-full h-full object-contain" />
  </div>;
}
