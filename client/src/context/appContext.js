// used to set global states for the entire app

import React from 'react';

import reducer from './reducers';

import { useReducer, useContext } from 'react';
import { DISPLAY_ALERT, HIDE_ALERT } from './actions';

const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
};

const AppContext = React.createContext();
const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const displayAlert = () => {
        // console.log(DISPLAY_ALERT);
        dispatch({ type: DISPLAY_ALERT });
        // hideAlert(); - in case I use the timeout one
    };

    // hide the alert after some time
    // const hideAlert = () => {
    //     setTimeout(() => {
    //         dispatch({ type: HIDE_ALERT });
    //     }, 3000);
    // };

    const hideAlert = () => {
        dispatch({ type: HIDE_ALERT });
    };

    return (<AppContext.Provider value={{ ...state, displayAlert, hideAlert }}>
        {children}
    </AppContext.Provider>);
};

const useAppContext = () => {
    return useContext(AppContext);
};

export {
    AppProvider,
    initialState,
    useAppContext,
};