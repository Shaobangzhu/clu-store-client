import {
  NEW_ARRIVALS_LIST,
  OFFER_LIST,
  SUGGESTED_PROUDCT,
} from "../assets/data"; // 导入产品数据
import ProductList from "@components/ProductList";
import NewArrival, { type NewArrivalProps } from "@components/NewArrival";
import Offer from "@components/Offer";
import ImageHero from "@components/ImageHero";
import withSoldOut from "../HOCs/withSoldOut";
import withBanner from "../HOCs/withBanner";
import ProductHero from "../components/ProductHero";

const NewArrivalWithSoldOutCheck = withSoldOut((props: NewArrivalProps) => {
  const { title } = props;
  return <NewArrival {...props} title={"商品: " + title} />;
});

const NewArrivalWithBannerAndSoldOutCheck = withBanner(
  NewArrivalWithSoldOutCheck,
  "手慢无！",
); // 使用 HOC 添加 Banner

const OfferWithSoldOutCheck = withSoldOut(Offer);

function Home() {
  return (
    <div>
      <ImageHero />
      <ProductHero
        product={SUGGESTED_PROUDCT.product}
        imageUrl={SUGGESTED_PROUDCT.imageSrc}
      />
      <ProductList
        title={"上新品, 各个添新意。"}
        datalength={NEW_ARRIVALS_LIST.length}
      >
        {NEW_ARRIVALS_LIST.map((item) => (
          <NewArrivalWithBannerAndSoldOutCheck
            {...item}
            key={item.title}
            scale={1.05}
          />
        ))}
      </ProductList>
      <ProductList
        title={"限时折扣, 买到就是赚到。"}
        datalength={OFFER_LIST.length}
      >
        {OFFER_LIST.map((item) => (
          <OfferWithSoldOutCheck {...item} key={item.title} />
        ))}
      </ProductList>
    </div>
  );
}

export default Home;
