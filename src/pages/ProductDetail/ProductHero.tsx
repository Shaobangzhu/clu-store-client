interface ProductHeroProps {
  imageSrc: string;
}

const ProductHero = ({ imageSrc }: ProductHeroProps) => {
  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-3xl
        bg-[#f5f5f7]
        aspect-[4/3]
        flex
        items-center
        justify-center
        lg:sticky
        lg:top-28
      "
    >
      <img
        src={imageSrc}
        alt=""
        className="
          w-full
          h-full
          object-contain
        "
      />
    </div>
  );
};

export default ProductHero;
