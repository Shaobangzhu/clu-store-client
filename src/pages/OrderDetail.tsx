import type { OrderDto } from "@/api/services";
import { orderService } from "@/api/services";
import { positiveId } from "@/api/adapters";
import { useParams } from "react-router-dom";
import SquareInput from "../components/SquareInput";
import useApiData from "@/hooks/useApiData";
import Skeleton from "@/components/Skeleton";
import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";

type OrderDetailParams = {
  id: string;
};

const getStatusMessage = (state: OrderDto['status']) => {
  switch (state) {
    case "approved":
      return "下单成功";
    case "pending":
      return "订单处理中";
    case "rejected":
      return "订单被拒绝";
    default:
      return "未知状态";
  }
};

const OrderDetail = () => {
  const { id } = useParams<OrderDetailParams>();
  if (id == null) {
    throw new Error("order not found");
  }

  const { token } = useSelector((s: RootState) => s.user);

  const { data, loading, error } = useApiData(
    `order:${id}`,
    async signal => (await orderService.get(positiveId(id), { token, signal })).data,
    { autoFetch: Boolean(token), scope: token },
  );
  if (!token) return <p role="alert">请先登录</p>;
  if (error) return <p role="alert">{error}</p>;

  if (loading || !data) {
    return <Skeleton />;
  }

  return (
    <div className="min-h-screen pt-6 p-4">
      <p className="text-4xl mt-2">{getStatusMessage(data.status)}</p>
      <div className="flex flex-col gap-6 mt-12">
        {error ? (
          <p className="text-2xl">订单错误：{error}</p>
        ) : (
          <>
            <p className="text-2xl">订单详情：</p>
            <SquareInput
              subTitle="订单 ID"
              title={id}
              value=""
              onChange={() => {}}
            />
            <SquareInput
              subTitle="订单状态"
              title={data.status}
              value=""
              onChange={() => {}}
            />
            <SquareInput
              value=""
              onChange={() => {}}
              subTitle="下单时间"
              title={data.createdAt}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
