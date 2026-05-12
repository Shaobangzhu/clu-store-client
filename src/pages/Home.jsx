import { NEW_ARRIVALS_LIST, OFFER_LIST } from "@/assets/data"; // 导入产品数据
import ProductList from "@components/ProductList";
import NewArrival from "@components/NewArrival";
import Offer from "@components/Offer";

function Home() {
  return (
    <div>
      <ProductList
        title={"上新品, 各个添新意。"}
        datalength={NEW_ARRIVALS_LIST.length}
      >
        {NEW_ARRIVALS_LIST.map((item) => (
          <NewArrival {...item} key={item.title} />
        ))}
      </ProductList>
      <ProductList
        title={"限时折扣, 买到就是赚到。"}
        datalength={OFFER_LIST.length}
      >
        {OFFER_LIST.map((item) => (
          <Offer {...item} key={item.title} />
        ))}
      </ProductList>
    </div>
  );
}

export default Home;
