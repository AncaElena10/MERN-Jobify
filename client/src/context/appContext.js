/* used to set global states (initial values) for the entire app */
/* grabs the data from functions (Register.js for eg.) and sends it to reducers */

import React from 'react';
import axios from 'axios';

import reducer from './reducers';

import { useReducer, useContext } from 'react';
import {
    DISPLAY_ALERT,
    // HIDE_ALERT,
    REGISTER_USER_BEGIN,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR
} from './actions';

const user = localStorage.getItem('user');
const token = localStorage.getItem('token');
const location = localStorage.getItem('location');

const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: user ? JSON.parse(user) : null,
    token: token,
    userLocation: location || '',
    joblocation: location || '',
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

    const addUserToLocalStorage = ({ user, token, location }) => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        localStorage.setItem('location', location);
    };

    const removeUserFromLocalStorage = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('location');
    };

    const registerUser = async (currentUser) => {
        dispatch({ type: REGISTER_USER_BEGIN });

        try {
            const response = await axios.post('/api/v1/register', currentUser);
            const payload = {
                user: { ...currentUser },
                token: response.headers['token'],
                location: '' // TODO
            };

            // console.log(response)
            // console.log('AAAAAA' + JSON.stringify(response.data));
            // console.log(token);

            dispatch({
                type: REGISTER_USER_SUCCESS,
                payload: payload
            });

            addUserToLocalStorage(payload);
        } catch (error) {
            console.log(`[APP-CONTEXT] Error while trying to register the user: ${error.response}`);

            // TODO - toaster with backend data in case of success/failure
            // atm just append the description and the action

            dispatch({
                type: REGISTER_USER_ERROR,
                payload: { msg: `${error.response.data.errorDescription} ${error.response.data.errorAction}` }
            });
        }
    };

    return (<AppContext.Provider value={{ ...state, displayAlert, registerUser }}>
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