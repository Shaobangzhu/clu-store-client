import MainLayout from "./layouts/MainLayout";
import BlankLayout from "./layouts/BlankLayout";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";
import {
  Home,
  About,
  Phones,
  IPad,
  Computers,
  SmartHome,
  Entertainment,
  Support,
  SignIn,
  Register,
} from "./pages"; // 使用 index.ts 导入所有页面组件

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<MainLayout header={<Header />} footer={<Footer />} />}
      >
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/phones" element={<Phones />} />
        <Route path="/computers" element={<Computers />} />
        <Route path="/ipad" element={<IPad />} />
        <Route path="/entertainment" element={<Entertainment />} />
        <Route path="/smarthome" element={<SmartHome />} />
        <Route path="/support" element={<Support />} />
      </Route>
      <Route element={<BlankLayout />} path="/auth">
        <Route path="signin" element={<SignIn />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
