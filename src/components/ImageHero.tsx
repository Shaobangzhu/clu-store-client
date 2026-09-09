import hero_small_image from "../assets/images/hero_small.jpg";
import hero_image from "../assets/images/hero.jpg";
import IconButton from "./IconButton";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { MdOutlineNavigateNext } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ImageHero = () => {
  const navigate = useNavigate();

  function sleepSync(milliseconds: number) {
    const start = Date.now();
    while (Date.now() - start < milliseconds) {
      // 空转，占用 CPU, 阻塞后续代码执行
    }
  }

  const fakeFetchData = () => {
    // 模拟数据获取
    sleepSync(10000); // 阻塞 10 秒
    console.log("数据获取完毕");
  };

  return (
    <div className="relative bg-black text-white mb-2">
      {/* 图片区域 */}
      <img
        src={hero_small_image}
        className="w-full h-[480px] object-cover block md:hidden"
      />
      <img
        src={hero_image}
        className="w-full h-[480px] object-cover hidden md:block"
      />
      {/* 文案+按钮区域 */}
      <div className="absolute inset-4 flex flex-col p-2 items-center justify-end text-center md:justify-start">
        <div className="text-4xl md:text-6xl font-bold">iPhone 17 Pro</div>
        <div className="mt-4 flex space-x-4">
          <IconButton
            icon={<MdOutlineNavigateNext />}
            iconPosition="right"
            title="进一步了解"
            variant="primary"
            onClick={() => {
              fakeFetchData(); // 模拟数据获取
              navigate("/product-detail/1");
            }}
          />
          <IconButton
            icon={<AiOutlineShoppingCart />}
            title="购买"
            variant="outline"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageHero;
