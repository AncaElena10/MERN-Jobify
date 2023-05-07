// used to set global states for the entire app

import React from 'react';

import reducer from './reducers';

import { useReducer, useContext } from 'react';

const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
};

const AppContext = React.createContext();
const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (<AppContext.Provider value={{ ...state }}>
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