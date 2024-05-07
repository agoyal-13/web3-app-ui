import "./scss/main.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import NoPage from "./pages/NoPage.jsx";
import HoroscopeNFT from "./components/HoroscopeNFT.jsx";

export default function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <div>
          <Routes>
            <Route index element={<Home />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/contact" element={<Contact />}></Route>
            <Route path="/horoscopeNFT" element={<HoroscopeNFT />}></Route>
            <Route path="*" element={<NoPage />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
