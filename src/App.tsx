import MainLayout from "./layouts/MainLayout";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import {
  About,
  Phones,
  IPad,
  Computers,
  SmartHome,
  Entertainment,
  Support,
} from "./pages"; // 使用 index.ts 导入所有页面组件

function App() {
  return (
    <Routes>
      <Route
        index
        element={
          <MainLayout
            header={<Header />}
            content={<Home />}
            footer={<Footer />}
          />
        }
      />
      <Route path="/about" element={<About />} />
      <Route path="/phones" element={<Phones />} />
      <Route path="/computers" element={<Computers />} />
      <Route path="/ipad" element={<IPad />} />
      <Route path="/entertainment" element={<Entertainment />} />
      <Route path="/smarthome" element={<SmartHome />} />
      <Route path="/support" element={<Support />} />
    </Routes>
  );
}

export default App;
