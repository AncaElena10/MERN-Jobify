/* used to set global states (initial values) for the entire app */
/* grabs the data from functions (Register.js, Profile.js for eg.) and sends it to reducers */

import React, { useEffect } from 'react';
import axios from 'axios';

import reducer from './reducers';

import { useReducer, useContext } from 'react';
import {
    OtherActions,
    UserActions,
    JobsAction
} from './actions';

const initialState = {
    userLoading: true, // setup to true or either logged out immediately
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: null,
    userLocation: '',
    showSidebar: false,

    // for jobs
    jobLocation: '',
    isEditing: false,
    editJobId: '',
    position: '',
    company: '',
    jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
    jobType: 'full-time',
    statusOptions: ['pending', 'interview', 'declined'],
    status: 'pending',
    jobs: [],
    totalJobs: 0,

    // statistics
    statistics: {},
    monthlyApplications: [],

    // filtering&sorting&pagination
    // the default values for jobType and status are above (jobTypeOptions, statusOptions)
    search: '', // default value for search
    filterByStatus: 'all', // used for filter by status
    filterByJobType: 'all', // used for filter by jobType
    sort: 'latest', // default value for sort
    sortOptions: ['latest', 'oldest', 'a-z', 'z-a'], // used for sorting
    numOfPages: 1, // used for pagination
    page: 1, // used for pagination
};

const AppContext = React.createContext();
const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const authFetch = axios.create({
        baseURL: '/api/v1',
    });

    // request - no longer required when using cookies
    // authFetch.interceptors.request.use((config) => {
    //     config.headers['Authorization'] = `Bearer ${state.token}`;
    //     return config;
    // }, (error) => {
    //     return Promise.reject(error);
    // });

    // response
    authFetch.interceptors.response.use((response) => {
        return response;
    }, (error) => {
        if (error.response.status === 401) {
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

    // login + register user
    const setupUser = async ({ currentUser, endpoint, alertText }) => {
        dispatch({ type: UserActions.USER_OPERATION_BEGIN });

        try {
            const response = await axios.post(`/api/v1/auth/${endpoint}`, currentUser);
            const payload = {
                user: JSON.parse(response.headers['user']),
                location: '',
                alertText: alertText
            };

            dispatch({
                type: UserActions.USER_OPERATION_SUCCESS,
                payload: payload
            });
        } catch (error) {
            dispatch({
                type: UserActions.USER_OPERATION_ERROR,
                payload: { msg: `${error.response.data.message}` }
            });
        } finally {
            hideAlert();
        }
    };

    // logout user
    const logoutUser = async () => {
        try {
            await authFetch.delete(`/auth/logout`);

            dispatch({ type: UserActions.LOGOUT_USER });
        } catch (e) { }
    };

    // update user
    const updateUser = async (currentUser) => {
        dispatch({ type: UserActions.USER_UPDATE_BEGIN });

        try {
            const response = await authFetch.patch(`/auth/updateUser`, currentUser);
            const payload = {
                user: JSON.parse(response.headers['user']),
                location: (JSON.parse(response.headers['user'])).location,
            };

            dispatch({
                type: UserActions.USER_UPDATE_SUCCESS,
                payload: payload
            });
        } catch (error) {
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

    // get user
    const getUser = async () => {
        dispatch({ type: UserActions.GET_USER_BEGIN });

        try {
            const response = await authFetch.get(`/auth/user`);
            const payload = {
                user: response.data,
                location: response.data.location,
            };

            dispatch({
                type: UserActions.GET_USER_SUCCESS,
                payload: payload,
            });
        } catch (error) {
            if (error.response.status === 401) {
                return;
            }
            logoutUser();
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

    // add job
    const createJob = async (job) => {
        dispatch({ type: JobsAction.CREATE_JOB_BEGIN });

        try {
            await authFetch.post(`/jobs`, job);

            dispatch({ type: JobsAction.CREATE_JOB_SUCCESS });
            dispatch({ type: OtherActions.CLEAR_VALUES });
        } catch (error) {
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

    // get all jobs
    const getJobs = async () => {
        const { page, search, filterByJobType, filterByStatus, sort } = state;
        const limitDefaultValue = 10;
        let url = `/jobs?limit=${limitDefaultValue}&page=${page}&status=${filterByStatus}&jobType=${filterByJobType}&sort=${sort}`;

        if (search) {
            url = `${url}&search=${search}`;
        }

        dispatch({ type: JobsAction.GET_JOBS_BEGIN });

        try {
            const response = await authFetch.get(url);
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
            logoutUser();
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

    // edit job
    const editJob = async (job) => {
        dispatch({ type: JobsAction.EDIT_JOB_BEGIN });

        try {
            await authFetch.patch(`/jobs/${state.editJobId}`, job);

            dispatch({ type: JobsAction.EDIT_JOB_SUCCESS });
            dispatch({ type: OtherActions.CLEAR_VALUES });
        } catch (error) {
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

    // delete job
    const deleteJob = async (id) => {
        dispatch({ type: JobsAction.DELETE_JOB_BEGIN });

        try {
            await authFetch.delete(`/jobs/${id}`);
            getJobs();
        } catch (error) {
            logoutUser();
        }
    };

    // get jobs statistics
    const getStatistics = async () => {
        dispatch({ type: OtherActions.SHOW_STATS_BEGIN });
        try {
            const response = await authFetch.get(`/jobs/stats`);
            const payload = {
                statistics: response.data.statistics,
                monthlyApplications: response.data.monthlyApplications,
            };

            dispatch({
                type: OtherActions.SHOW_STATS_SUCCESS,
                payload: payload,
            });
        } catch (error) {
            logoutUser();
        } finally {
            hideAlert();
        }
    };

    const clearFilters = () => {
        dispatch({ type: OtherActions.CLEAR_FILTERS });
    };

    const changePage = (page) => {
        dispatch({
            type: OtherActions.CHANGE_PAGE,
            payload: { page }
        });
    };

    useEffect(() => {
        getUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                getStatistics,
                clearFilters,
                changePage,
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