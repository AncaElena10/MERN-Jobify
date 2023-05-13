
/* used to populate the states with values received from appContext */

import {
    HIDE_ALERT,
    DISPLAY_ALERT,
    REGISTER_USER_BEGIN,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,
    LOGIN_USER_BEGIN,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR
} from './actions';

const reducer = (state, action) => {
    let toReturn = {
        ...state,
    };
    let obj;
    switch (action.type) {
        case DISPLAY_ALERT:
            obj = {
                showAlert: true, // global state
                alertType: 'danger',  // global state
                alertText: 'Please provide all values!'  // global state
            };
            return { ...toReturn, ...obj };

        case HIDE_ALERT:
            obj = {
                showAlert: false, // global state
                alertType: '',  // global state
                alertText: ''  // global state
            };
            return { ...toReturn, ...obj };

        case REGISTER_USER_BEGIN:
            obj = {
                isLoading: true
            };
            return { ...toReturn, ...obj };

        case REGISTER_USER_SUCCESS:
            obj = {
                isLoading: false,
                token: action.payload.token,
                user: action.payload.user,
                userLocation: action.payload.location,
                jobLocation: action.payload.location,
                showAlert: true,
                alertType: 'success',
                alertText: 'User Created! Redirecting...',
            };
            return { ...toReturn, ...obj };

        case REGISTER_USER_ERROR:
            obj = {
                isLoading: false,
                showAlert: true,
                alertType: 'danger',
                alertText: action.payload.msg,
            };
            return { ...toReturn, ...obj };

        case LOGIN_USER_BEGIN:
            obj = {
                isLoading: true
            };
            return { ...toReturn, ...obj };

        case LOGIN_USER_SUCCESS:
            obj = {
                isLoading: false,
                token: action.payload.token,
                user: action.payload.user,
                userLocation: action.payload.location,
                jobLocation: action.payload.location,
                showAlert: true,
                alertType: 'success',
                alertText: 'Login Successful! Redirecting...',
            };
            return { ...toReturn, ...obj };

        case LOGIN_USER_ERROR:
            obj = {
                isLoading: false,
                showAlert: true,
                alertType: 'danger',
                alertText: action.payload.msg,
            };
            return { ...toReturn, ...obj };

        default:
            throw new Error(`[REDUCERS] action ${action.type} not found`);
    }
};

export default reducer;