import './../App.css';
import { useEffect, useState } from "react";
import { Contract, providers } from "ethers";
import NFT from "../abi/HoroscopeNFT.json";
import Footer from "../components/Footer.jsx";
import { Link } from "react-router-dom";

const NFT_CONTRACT_ADDRESS = "0x5b8a83EF3151e4a8d02f1Ac8895152CfD1158ebd";

function HoroscopeNFT() {
    const [date, setDate] = useState("1992-08-31");
    const [zodiacSign, setZodiacSign] = useState(null);
    const [isWalletInstalled, setIsWalletInstalled] = useState(false);

    // state for whether app is minting or not.
    const [isMinting, setIsMinting] = useState(false);
    const [isMinted, setIsMinted] = useState(false);

    const [NFTContract, setNFTContract] = useState(null);
    const [account, setAccount] = useState(null);

    useEffect(() => {
        if (window.ethereum) {
            setIsWalletInstalled(true);
        }
    }, []);

    function handleDateInput({ target }) {
        setDate(target.value);
    }

    useEffect(() => {
        calculateZodiacSign(date);
    }, [date]);


    async function connectWallet() {
        window.ethereum
            .request({
                method: "eth_requestAccounts",
            })
            .then((accounts) => {
                setAccount(accounts[0]);
            })
            .catch((error) => {
                alert("Something went wrong:", error);
            });
    }

    useEffect(() => {
        function initNFTContract() {
            const provider = new providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            setNFTContract(new Contract(NFT_CONTRACT_ADDRESS, NFT.abi, signer));
        }
        initNFTContract();
    }, [account]);

    async function mintNFT() {
        setIsMinting(true);
        try {
            const transaction = await NFTContract.mintNFT(account, zodiacSign);
            await transaction.wait();
            setIsMinted(true);
        } catch (e) {
            // Handle errors
        } finally {
            setIsMinting(false);
        }
    }

    function calculateZodiacSign(date) {
        let dateObject = new Date(date);
        let day = dateObject.getDate();
        let month = dateObject.getMonth();
        if (month == 0) {
            if (day >= 20) {
                setZodiacSign("Aquarius");
            } else {
                setZodiacSign("Capricorn");
            }
        } else if (month == 1) {
            if (day >= 19) {
                setZodiacSign("Pisces");
            } else {
                setZodiacSign("Aquarius");
            }
        } else if (month == 2) {
            if (day >= 21) {
                setZodiacSign("Aries");
            } else {
                setZodiacSign("Pisces");
            }
        } else if (month == 3) {
            if (day >= 20) {
                setZodiacSign("Taurus");
            } else {
                setZodiacSign("Aries");
            }
        } else if (month == 4) {
            if (day >= 21) {
                setZodiacSign("Gemini");
            } else {
                setZodiacSign("Taurus");
            }
        } else if (month == 5) {
            if (day >= 21) {
                setZodiacSign("Cancer");
            } else {
                setZodiacSign("Gemini");
            }
        } else if (month == 6) {
            if (day >= 23) {
                setZodiacSign("Leo");
            } else {
                setZodiacSign("Cancer");
            }
        } else if (month == 7) {
            if (day >= 23) {
                setZodiacSign("Virgo");
            } else {
                setZodiacSign("Leo");
            }
        } else if (month == 8) {
            if (day >= 23) {
                setZodiacSign("Libra");
            } else {
                setZodiacSign("Virgo");
            }
        } else if (month == 9) {
            if (day >= 23) {
                setZodiacSign("Scorpio");
            } else {
                setZodiacSign("Libra");
            }
        } else if (month == 10) {
            if (day >= 22) {
                setZodiacSign("Sagittarius");
            } else {
                setZodiacSign("Scorpio");
            }
        } else if (month == 11) {
            if (day >= 22) {
                setZodiacSign("Capricorn");
            } else {
                setZodiacSign("Sagittarius");
            }
        }
    }

    if (account === null) {
        return (
            <div className="App">
                {
                    isWalletInstalled ? (
                        <div className='mt-20'>
                            {/* <span>
                                <IonIcon icon={wallet}></IonIcon>
                            </span> */}
                            <button className='bg-white hover:bg-green-500 text-purple-700 font-semibold
                                hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
                                onClick={connectWallet}>Connect Wallet</button>
                        </div>

                    ) : (
                        <p>Install Metamask wallet</p>
                    )
                }
                <div><Footer /></div>
            </div>
        );
    }
    return (
        <div className="App bg-purple-100">
            <h1 className='text-lg font-bold mb-4 pt-6' > Horoscope NFT Minting Dapp</h1 >
            <p className='mb-5'>Connected as: {account}</p>
            <input onChange={handleDateInput} value={date} type="date" id="dob" />
            <br />
            <br />
            {
                zodiacSign ? (
                    <div className="flex justify-center items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            preserveAspectRatio="xMinYMin meet"
                            viewBox="0 0 300 300"
                            width="400px"
                            height="400px"
                        >
                            <style>{`.base { fill: white; font-family: serif; font-size: 24px;`}</style>
                            <rect width="100%" height="100%" fill="black" />
                            <text
                                x="50%"
                                y="50%"
                                className="base"
                                dominantBaseline="middle"
                                textAnchor="middle"
                            >
                                {zodiacSign}
                            </text>
                        </svg>
                    </div>
                ) : null
            }

            <br />
            <br />
            <button className='bg-green-500 border-green-800 hover:bg-green-500 text-green-900 font-bold
                                hover:text-white m-8 py-2 px-4 border hover:border-transparent rounded'
                onClick={mintNFT}>
                {isMinting ? "Minting NFT..." : "Mint NFT"}
            </button>
            {
                isMinted ? (
                    <button className="bg-red-500 font-medium hover:text-white m-2 py-2 px-4 border hover:border-transparent rounded">
                        <Link to={`https://testnets.opensea.io/assets/sepolia/${NFT_CONTRACT_ADDRESS}`} target="_blank">Check Minted NFT</Link>
                    </button>
                ) : (<br />)
            }
            <br />
            <div><Footer /></div>
        </div >
    );

}

export default HoroscopeNFT;