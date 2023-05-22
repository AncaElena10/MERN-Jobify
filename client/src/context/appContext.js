/* used to set global states (initial values) for the entire app */
/* grabs the data from functions (Register.js, Profile.js for eg.) and sends it to reducers */

import React from 'react';
import axios from 'axios';

import reducer from './reducers';

import { useReducer, useContext } from 'react';
import {
    OtherActions,
    UserActions,
    JobsAction
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

    //
    jobs: [],
    totalJobs: 0,
    numOfPages: 1,
    page: 1,
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
        if (error.response.status === 401) {
            console.log('Auth error. Logging out...');
            logoutUser();
        }
        return Promise.reject(error);
    });

    const displayAlert = () => {
        dispatch({ type: OtherActions.DISPLAY_ALERT });
        hideAlert();
    };

    // hide the alert after some time
    const hideAlert = () => {
        setTimeout(() => {
            dispatch({ type: OtherActions.HIDE_ALERT });
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
        dispatch({ type: UserActions.USER_OPERATION_BEGIN });

        try {
            const response = await axios.post(`/api/v1/${endpoint}`, currentUser);
            const payload = {
                user: JSON.parse(response.headers['user']),
                token: response.headers['token'],
                location: '',
                alertText: alertText
            };

            dispatch({
                type: UserActions.USER_OPERATION_SUCCESS,
                payload: payload
            });

            addUserToLocalStorage(payload);
        } catch (error) {
            console.log(`Cannot setup the user.`);
            dispatch({
                type: UserActions.USER_OPERATION_ERROR,
                payload: { msg: `${error.response.data.message}` }
            });
        } finally {
            hideAlert();
        }
    };

    const logoutUser = () => {
        dispatch({ type: UserActions.LOGOUT_USER });
        removeUserFromLocalStorage();
    };

    const updateUser = async (currentUser) => {
        dispatch({ type: UserActions.USER_UPDATE_BEGIN });

        try {
            const response = await authFetch.patch(`updateUser`, currentUser);
            const payload = {
                user: JSON.parse(response.headers['user']),
                token: response.headers['token'],
                location: (JSON.parse(response.headers['user'])).location,
            };

            dispatch({
                type: UserActions.USER_UPDATE_SUCCESS,
                payload: payload
            });

            addUserToLocalStorage(payload);
        } catch (error) {
            console.log(`Cannot update the user.`);

            if (error.response.status !== 401) {
                dispatch({
                    type: UserActions.USER_UPDATE_ERROR,
                    payload: { msg: `${error.response.data.message}` }
                });
            }
        } finally {
            hideAlert();
        }
    };

    const toggleSidebar = () => {
        dispatch({ type: OtherActions.TOGGLE_SIDEBAR });
    };

    const handleChange = ({ name, value }) => {
        dispatch({
            type: OtherActions.HANDLE_CHANGE,
            payload: { name, value }
        });
    };

    const clearValues = () => {
        dispatch({ type: OtherActions.CLEAR_VALUES });
    };

    const createJob = async (job) => {
        dispatch({ type: JobsAction.CREATE_JOB_BEGIN });

        try {
            await authFetch.post(`/jobs`, job);

            dispatch({ type: JobsAction.CREATE_JOB_SUCCESS });
            dispatch({ type: OtherActions.CLEAR_VALUES });
        } catch (error) {
            console.log(`Cannot create the job.`);

            if (error.response.status === 401) {
                return;
            }
            dispatch({
                type: JobsAction.CREATE_JOB_ERROR,
                payload: { msg: `${error.response.data.message}` }
            });
        } finally {
            hideAlert();
        }
    };

    const getJobs = async () => {
        dispatch({ type: JobsAction.GET_JOBS_BEGIN });

        try {
            const response = await authFetch.get(`/jobs`);
            const payload = {
                jobs: response.data.result,
                totalJobs: response.data.total,
                numOfPages: response.data.numOfPages
            };

            dispatch({
                type: JobsAction.GET_JOBS_SUCCESS,
                payload: payload,
            });
        } catch (error) {
            console.log(`Cannot retrieve the jobs.`);

            // remember to de-comment this
            // logoutUser(); 
        } finally {
            hideAlert();
        }
    };

    // used to switch to 'add job' tab
    const setEditJob = (id) => {
        dispatch({
            type: OtherActions.SET_EDIT_JOB,
            payload: { id },
        });
    };

    const editJob = async (job) => {
        dispatch({ type: JobsAction.EDIT_JOB_BEGIN });

        try {
            await authFetch.patch(`/jobs/${state.editJobId}`, job);

            dispatch({ type: JobsAction.EDIT_JOB_SUCCESS });
            dispatch({ type: OtherActions.CLEAR_VALUES });
        } catch (error) {
            console.log(`Cannot edit the job.`);

            if (error.response.status === 401) {
                return;
            }
            dispatch({
                type: JobsAction.EDIT_JOB_ERROR,
                payload: { msg: `${error.response.data.message}` }
            });
        } finally {
            hideAlert();
        }
    };

    const deleteJob = async (id) => {
        dispatch({ type: JobsAction.DELETE_JOB_BEGIN });
        try {
            await authFetch.delete(`/jobs/${id}`);
            getJobs();
        } catch (error) {
            // remember to de-comment this
            // logoutUser(); 
        }
    };

    // setup on initial render - check / GET
    // useEffect(() => {
    //     getJobs()
    // }, []);

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
                getJobs,
                setEditJob,
                deleteJob,
                editJob,
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