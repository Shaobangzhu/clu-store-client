import MainLayout from "./layouts/MainLayout";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import About from "./pages/About";
import Phones from "./pages/Phones";
import Computers from "./pages/Computers";
import IPad from "./pages/Ipad";
import Entertainment from "./pages/Entertainment";
import Support from "./pages/Support";
import SmartHome from "./pages/SmartHome";

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
      <Route path="/support" element={<Support />} />
      <Route path="/smarthome" element={<SmartHome />} />
    </Routes>
  );
}

export default App;
