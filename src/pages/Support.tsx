import { catalogService } from "@/api/services";
import Skeleton from "@components/Skeleton";
import useApiData from "@/hooks/useApiData";

const Support = () => {
  const { data, loading, error } = useApiData(
    "support", async signal => (await catalogService.support({ signal })).data,
  );

  if (loading) {
    return <Skeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>加载数据失败: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-apple-text dark:text-apple-text-dark">
      <div
        className="p-4 text-xs text-gray-500"
        dangerouslySetInnerHTML={{ __html: data?.html || "" }}
      ></div>
    </div>
  );
};
export default Support;
