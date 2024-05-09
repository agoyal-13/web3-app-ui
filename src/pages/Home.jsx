import "./../scss/main.scss";
import { Link } from "react-router-dom";
import Header from "./../components/Header.jsx";
import Footer from "./../components/Footer.jsx";

const Home = () => {
    return (
        <>
            <Header />
            <br />
            <div className="container">
                <div>
                    <nav>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/horoscopeNFT">Horoscope NFT</Link></li>
                            <li><Link to="/voting">Voting</Link></li>
                        </ul>
                    </nav>

                </div>
            </div>
            <div><Footer /></div>
            <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
            <script noModule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
        </>
    );
};

export default Home;