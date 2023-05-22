/* used to set global states (initial values) for the entire app */
/* grabs the data from functions (Register.js, Profile.js for eg.) and sends it to reducers */

import React from 'react';
import axios from 'axios';

import reducer from './reducers';

import { useReducer, useContext } from 'react';
import {
    DISPLAY_ALERT,
    HIDE_ALERT,
    USER_OPERATION_BEGIN,
    USER_OPERATION_SUCCESS,
    USER_OPERATION_ERROR,
    TOGGLE_SIDEBAR,
    LOGOUT_USER,
    USER_UPDATE_BEGIN,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_ERROR,
    HANDLE_CHANGE,
    CLEAR_VALUES,
    CREATE_JOB_BEGIN,
    CREATE_JOB_SUCCESS,
    CREATE_JOB_ERROR,
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
    showSidebar: false,

    // for jobs
    jobLocation: location || '',
    isEditing: false,
    editJobId: '',
    position: '',
    company: '',
    jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
    jobType: 'full-time',
    statusOptions: ['pending', 'interview', 'declined'],
    status: 'pending',
};

const AppContext = React.createContext();
const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const authFetch = axios.create({
        baseURL: '/api/v1',
    });

    // request
    authFetch.interceptors.request.use((config) => {
        config.headers['Authorization'] = `Bearer ${state.token}`;
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    // response
    authFetch.interceptors.response.use((response) => {
        return response;
    }, (error) => {
        console.log(error.response);
        if (error.response.status === 401) {
            console.log('AUTH ERROR!');
            logoutUser();
        }
        return Promise.reject(error);
    });

    const displayAlert = () => {
        dispatch({ type: DISPLAY_ALERT });
        hideAlert();
    };

    // hide the alert after some time
    const hideAlert = () => {
        setTimeout(() => {
            dispatch({ type: HIDE_ALERT });
        }, 3000);
    };

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
        } finally {
            hideAlert();
        }
    };

    const logoutUser = () => {
        dispatch({ type: LOGOUT_USER });
        removeUserFromLocalStorage();
    }

    const updateUser = async (currentUser) => {
        dispatch({ type: USER_UPDATE_BEGIN });

        try {
            const response = await authFetch.patch(`updateUser`, currentUser);
            const payload = {
                user: JSON.parse(response.headers['user']),
                token: response.headers['token'],
                location: (JSON.parse(response.headers['user'])).location,
            };

            dispatch({
                type: USER_UPDATE_SUCCESS,
                payload: payload
            });

            addUserToLocalStorage(payload);
        } catch (error) {
            console.log(`[APP-CONTEXT] Error while trying to update the user: ${error.response.data.message}`);

            if (error.response.status !== 401) {
                dispatch({
                    type: USER_UPDATE_ERROR,
                    payload: { msg: `${error.response.data.message}` }
                });
            }
        } finally {
            hideAlert();
        }
    }

    const toggleSidebar = () => {
        dispatch({ type: TOGGLE_SIDEBAR });
    };

    const handleChange = ({ name, value }) => {
        dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
    }

    const clearValues = () => {
        dispatch({ type: CLEAR_VALUES });
    }

    const createJob = async (job) => {
        dispatch({ type: CREATE_JOB_BEGIN });

        try {
            await authFetch.post(`/jobs`, job);

            dispatch({ type: CREATE_JOB_SUCCESS });
            dispatch({ type: CLEAR_VALUES });
        } catch (error) {
            console.log(`[APP-CONTEXT] Error while trying to create the job: ${error.response.data.message}`);

            if (error.response.status === 401) {
                return;
            }
            dispatch({
                type: CREATE_JOB_ERROR,
                payload: { msg: `${error.response.data.message}` }
            });
        } finally {
            hideAlert();
        }
    }

    return (
        <AppContext.Provider value={
            {
                ...state,
                displayAlert,
                setupUser,
                toggleSidebar,
                logoutUser,
                updateUser,
                handleChange,
                clearValues,
                createJob,
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