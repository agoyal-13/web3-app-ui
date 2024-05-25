import { createContext, useEffect, useRef, useState } from "react";

const ALERT_TIME = 3000;
const initialState = {
    text: '',
    type: '',
};

const AlertContext = createContext({
    // ...initialState,
    // setAlert: () => { },
});

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState(null);
    const timerRef = useRef(null);


    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            setAlert(null);
        }, ALERT_TIME);
    }, [alert]);

    return (
        <AlertContext.Provider value={[alert, setAlert]}>
            {children}
        </AlertContext.Provider>
    );
};

export default AlertContext;