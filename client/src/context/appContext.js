/* used to set global states (initial values) for the entire app */
/* grabs the data from functions (Register.js for eg.) and sends it to reducers */

import React from 'react';
import axios from 'axios';

import reducer from './reducers';

import { useReducer, useContext } from 'react';
import {
    DISPLAY_ALERT,
    // HIDE_ALERT,
    USER_OPERATION_BEGIN,
    USER_OPERATION_SUCCESS,
    USER_OPERATION_ERROR,
    TOGGLE_SIDEBAR,
    LOGOUT_USER,
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
    showSidebar: false,
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

    const setupUser = async ({ currentUser, endpoint, alertText }) => {
        dispatch({ type: USER_OPERATION_BEGIN });

        try {
            const response = await axios.post(`/api/v1/${endpoint}`, currentUser);
            const payload = {
                user: JSON.parse(response.headers['user']),
                token: response.headers['token'],
                location: '', // TODO,
                alertText: alertText
            };

            dispatch({
                type: USER_OPERATION_SUCCESS,
                payload: payload
            });

            addUserToLocalStorage(payload);
        } catch (error) {
            console.log(`[APP-CONTEXT] Error while trying to login the user: ${error.response}`);
            dispatch({
                type: USER_OPERATION_ERROR,
                payload: { msg: `${error.response.data.message}` }
            });
        }
    };

    const logoutUser = () => {
        dispatch({ type: LOGOUT_USER });
        removeUserFromLocalStorage();
    }

    const toggleSidebar = () => {
        dispatch({ type: TOGGLE_SIDEBAR });
    };

    return (
        <AppContext.Provider value={
            {
                ...state,
                displayAlert,
                setupUser,
                toggleSidebar,
                logoutUser,
            }
        }>
            {children}
        </AppContext.Provider>
    );
};

const useAppContext = () => {
    return useContext(AppContext);
};

export {
    AppProvider,
    initialState,
    useAppContext,
};