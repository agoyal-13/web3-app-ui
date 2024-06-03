import './../App.css';
import { ethers } from "ethers";
import { useEffect, useState, useRef } from "react";
import { useForm } from 'react-hook-form';
import { HiOutlineArrowCircleRight } from "react-icons/hi";
import { Contract, providers } from "ethers";
import TICKET from "../abi/TicketEngine.json";
import Footer from "../components/Footer.jsx";
import { toast } from 'react-toastify';
import { Web3 } from 'web3';

let eventsData = [
    { name: "Movie", eventId: 0, totalTickets: 20, ticketPrice: 0.000005, ticketEndDate: "", ticketSold: "false" },
];

// import { format, sub, isWithinInterval, add } from "date-fns";
const TICKET_CONTRACT_ADDRESS = "0x3419eed8A63CB854df789fBF32c437D0324d166E";
const EVENT_CREATION_FEE = "1.0";
const TICKET_PURCHASE_FEE = "10";
const DECIMALS = 10;
const verify_ticket_url = "https://sepolia.etherscan.io/address/0x3419eed8A63CB854df789fBF32c437D0324d166E";

export default function TicketEngine() {
    const toastId = useRef();
    const { register, handleSubmit, formState: { errors }, watch, getValues } = useForm();
    const [isWalletInstalled, setIsWalletInstalled] = useState(false);

    const [isEventCreated, setIsEventCreated] = useState(false);

    const [TicketContract, setTicketContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [eventValue, setEventValue] = useState(0);
    const [ticketsPending, setTicketsPending] = useState(0);
    const [ticketPrice, setTicketPrice] = useState(0);
    const [ticketsToBuy, setTicketsToBuy] = useState(0);

    useEffect(() => {
        setTicketsPending(eventsData[eventValue].totalTickets);
        setTicketPrice(eventsData[eventValue].ticketPrice);
    }, [eventValue]);

    useEffect(() => {
        if (window.ethereum) {
            setIsWalletInstalled(true);
        }
    }, []);

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
        function initTICKETContract() {
            const provider = new providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            setTicketContract(new Contract(TICKET_CONTRACT_ADDRESS, TICKET.abi, signer));
        }
        initTICKETContract();
    }, [account]);

    async function createEvent(tokenUrl, totalTickets, ticketPrice, endDate, name) {
        try {
            notify("Event Creation in progress.. Please approve the wallet request and wait for that to done");
            console.log("creating event");
            setIsEventCreated(true);
            const options = { value: ethers.utils.parseUnits(EVENT_CREATION_FEE, DECIMALS) }
            console.log('msg.value is ', options);
            // const transaction = await TicketContract.createEvent(tokenUrl, totalTickets, ticketPrice, endDate, name, options);
            // await transaction.wait();
            // console.log("creation event trx hash:", transaction.hash);
            // const msg = name + " event created successfully with tx:" + transaction.hash;
            toast.success("msg", { autoClose: false });
        } catch (e) {
            toast.dismiss(toastId.current);
            toast.error(e);
            console.log("error creating event:", e);
            // Handle errors
        } finally {
            setIsEventCreated(false);
            toast.dismiss();
        }
    }

    async function buyTicket() {
        try {
            notify("Ticket buying in progress.. Please approve the wallet request and wait for that to done");
            console.log("Buying tickets of price:", ticketPrice, " of eventId:", eventValue);
            const percentageFee = TICKET_PURCHASE_FEE * ticketsToBuy * Number(ticketPrice) / 100;
            const totalTicketCost = ticketsToBuy * Number(ticketPrice) + percentageFee;
            const weiValue = Web3.utils.toWei(totalTicketCost.toString(), 'ether');
            const options = { value: weiValue }
            console.log('Buying tickets msg.value is ', options);
            const transaction = await TicketContract.purchaseTicket(eventValue, ticketsToBuy, options);
            await transaction.wait();
            const msg = ticketsToBuy + " tickets purchased successfully for " + eventsData[eventValue].name + " with " + transaction.hash;
            console.log(msg);
            toast.success(msg, { autoClose: false });
        } catch (e) {
            // toast.dismiss(toastId.current);
            toast.error(e);
            console.log("error in buying tickets event:", e);
            // Handle errors
        } finally {
            toast.dismiss();
        }
    }

    // function changeToast() {

    const notify = (msg) => toastId.current = toast.info(msg, { autoClose: false });
    const successNotification = (msg) => toast.update(toastId.current, { msg });
    const errorNotification = (msg) => toast.update(toastId.current, { render: msg, autoClose: false });

    const onSubmitCreateEvent = (data) => {
        console.log(data);
        const endDateValue = getValues("eventEndDate");
        console.log('endDateValue', endDateValue);
        const timestamp = (new Date(endDateValue)).getTime() / 1000;
        console.log('timestamp', timestamp);
        const price = ethers.utils.parseEther(data.ticketPrice);
        console.log('price is ', price);
        // notify("Event Creation in progress.. Please wait");
        // successNotification("Success");
        createEvent('', data.totalTickets, price, timestamp, data.eventName)
    };

    const onSubmitBuyTicket = () => {
        if (ticketsToBuy < 1) {
            toast.error("Please buy at least one ticket");
            return;
        }
        buyTicket();
    };

    const event_fields = [
        {
            label: "Event Name",
            name: "eventName",
            type: "text",
            placeholder: "Movie, Show etc",
            required: true,
            gridCols: 1,
        },
        {
            label: "Total Tickets",
            name: "totalTickets",
            type: "number",
            placeholder: "10, 20 etc",
            required: true,
            gridCols: 1,
        },
        {
            label: "Ticket Price",
            name: "ticketPrice",
            type: "decimal",
            placeholder: "100 GWei etc",
            required: true,
            gridCols: 1,
        },
        {
            label: "Event End Date",
            name: "eventEndDate",
            type: "date",
            placeholder: "",
            required: true,
            gridCols: 1,
        },
    ];

    if (account === null) {
        return (
            <div className="App">
                {
                    isWalletInstalled ? (
                        <div className='mt-20'>
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
        <div>
            {/* <h1 className='text-lg font-bold mb-4 pt-6' > Event Ticketing Dapp</h1 > */}
            <h1 className='mb-5 bg-gray-50'>Connected wallet address : {account}</h1>
            <div className="container flex mx-auto">
                <div className="lg:w-5/12 pb-10 pt-1 p-4 border-2 border-y-yellow-950 shadow-2xl my-20 rounded-md mx-auto">
                    <div className="pb-5">
                        <h1 className="text-4xl font-bold mt-4 text-white">Create Event</h1>
                    </div>
                    <form onSubmit={handleSubmit(onSubmitCreateEvent)} className="w-4/5 flex flex-col justify-start items-center m-auto">
                        <div className="grid grid-cols-1 mb-6 md:grid-cols-2 gap-6  w-4/5">
                            {event_fields.map((field, index) => (
                                <div key={index} className={`text-left flex flex-col gap-0.1 w-full ${field.gridCols === 1 ? "md:col-span-2" : ""}`}
                                >
                                    <label className="font-semibold">{field.label}</label>
                                    <input
                                        {...register(field.name, { required: field.required, })}
                                        className={`border border-gray-300 text-sm font-semibold mb-1 max-w-full w-full outline-none rounded-md m-0 py-3 px-4 md:py-3 md:px-4 md:mb-0 focus:border-red-500 ${field.gridCols === 2 ? "md:w-full" : ""
                                            }`}
                                        id={field.name}
                                        type={field.type}
                                        placeholder={field.placeholder}

                                    />
                                    {errors[field.name] && (
                                        <span className="text-white">This field is required</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="w-full text-left">
                            <button disabled={!`${isEventCreated}`}
                                type="submit"
                                className="flex justify-center items-center gap-2 w-full py-3 px-4 bg-red-500 text-white text-md font-bold border border-red-500 rounded-md ease-in-out duration-150 shadow-slate-600 hover:bg-white hover:text-red-500 lg:m-0 md:px-6"
                                title="Create Event"
                            >
                                <span>Create Event</span>
                                <HiOutlineArrowCircleRight size={20} />
                            </button>
                            {/* <button onClick={() => showAlert()}>Show danger</button> */}
                        </div>
                    </form>
                </div>
                <div></div>

                <div className="lg:w-5/12 pb-10 pt-1 p-4 border-2 border-y-yellow-950 shadow-2xl my-20 rounded-md mx-auto">
                    <div className="pb-5">
                        <h1 className="text-4xl font-bold mt-4 text-white">Buy Tickets</h1>
                    </div>
                    <div className="w-4/5 flex flex-col justify-start items-center m-auto">
                        <div className="grid grid-cols-1 mb-6 md:grid-cols-2 gap-6  w-4/5">
                            <div className="text-left flex flex-col w-full md:col-span-2" >
                                <label className="font-semibold">Select Event</label>
                                <select
                                    className="border border-gray-300 text-sm font-semibold mb-1 max-w-full w-full outline-none rounded-md m-0 py-3 px-4 md:py-3 md:px-4 md:mb-0 focus:border-red-500 md:w-full"
                                    value={eventValue} onChange={(e) => setEventValue(e.target.value)}>
                                    {eventsData.map((option) => (
                                        <option key={option.eventId} value={option.eventId}>{option.name}</option>
                                    ))}

                                </select>
                            </div>
                            <div className="text-left flex flex-col w-full md:col-span-2" >
                                <label className="font-semibold">Tickets Available</label>
                                <input disabled type="number" value={ticketsPending}
                                    className="border border-gray-300 text-sm font-semibold mb-1 max-w-full w-full outline-none rounded-md m-0 py-3 px-4 md:py-3 md:px-4 md:mb-0 focus:border-red-500 md:w-full"
                                />
                            </div>
                            <div className="text-left flex flex-col w-full md:col-span-2" >
                                <label className="font-semibold">Each Ticket Price</label>
                                <input disabled value={`${ticketPrice} ETH`}
                                    className="border border-gray-300 text-sm font-semibold mb-1 max-w-full w-full outline-none rounded-md m-0 py-3 px-4 md:py-3 md:px-4 md:mb-0 focus:border-red-500 md:w-full"
                                />
                            </div>
                            <div className="text-left flex flex-col w-full md:col-span-2" >
                                <label className="font-semibold">Tickets to Buy</label>
                                <input type="number" value={ticketsToBuy} onChange={(e) => setTicketsToBuy(e.target.value)}
                                    placeholder='Enter number of tickets' min="1" max={ticketsPending}
                                    className="border border-gray-300 text-sm font-semibold mb-1 max-w-full w-full outline-none rounded-md m-0 py-3 px-4 md:py-3 md:px-4 md:mb-0 focus:border-red-500 md:w-full"
                                />
                            </div>
                        </div>

                        <div className="w-full text-left">
                            <button
                                type="submit" onClick={onSubmitBuyTicket}
                                className="flex justify-center items-center gap-2 w-full py-3 px-4 bg-red-500 text-white text-md font-bold border border-red-500 rounded-md ease-in-out duration-150 shadow-slate-600 hover:bg-white hover:text-red-500 lg:m-0 md:px-6"
                                title="Confirm Order"
                            >
                                <span>Buy Tickets</span>
                                <HiOutlineArrowCircleRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div >

            <br />
            <br />
            {/* <button className='bg-green-500 border-green-800 hover:bg-green-500 text-green-900 font-bold
                                hover:text-white m-8 py-2 px-4 border hover:border-transparent rounded'
                disabled={isCreatingEvent} onClick={mintNFT}>
                {isCreatingEvent ? "Minting TICKET..." : "Mint TICKET"}
            </button>
            {
                isMinted ? (
                    <button className="bg-red-500 font-medium hover:text-white m-2 py-2 px-4 border hover:border-transparent rounded">
                        <Link to={`https://testnets.opensea.io/assets/sepolia/${TICKET_CONTRACT_ADDRESS}`} target="_blank">Check Minted TICKET</Link>
                    </button>
                ) : (<br />)
            } */}
            <br />
            <div><Footer /></div>
        </div >
    );

}