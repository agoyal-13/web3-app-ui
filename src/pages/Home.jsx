import "./../scss/main.scss";
import { Link } from "react-router-dom";
import Header from "./../components/Header.jsx";

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
                            <li><Link to="/about">Lottery</Link></li>
                            <li><Link to="/voting">Voting</Link></li>
                        </ul>
                    </nav>

                </div>
            </div>
        </>
    );
};

export default Home;