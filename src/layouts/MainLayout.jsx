const MainLayout = ({ header, content, footer }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      {header ?? <h1>默认标题</h1>}
      {content ?? <p>默认内容</p>}
      {footer ?? <p>默认页脚</p>}
    </div>
  );
};

export default MainLayout;
// 这个组件是一个简单的布局组件，它接收三个props：header、content和footer。
// 如果这些props没有被传递，它们将显示默认的标题、内容和页脚。
