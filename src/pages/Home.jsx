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
                            <li><Link to="https://github.com/agoyal-13" target={'_blank'}>GitHub</Link></li>
                            <li>
                                <Link to="/horoscopeNFT">
                                    Horoscope NFT <br />
                                    <span className="text-xs">NFT Minting Dapp</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/ticketEngine">
                                    <span className="-my-3">Event Tickets<br />
                                        <span className="text-xs">Event Creation & Buy Event tickets</span>
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                </div>
            </div>
            <div><Footer /></div>
        </>
    );
};

export default Home;