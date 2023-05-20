/* used to populate the states with values received from appContext */

import {
    HIDE_ALERT,
    DISPLAY_ALERT,
    USER_OPERATION_BEGIN,
    USER_OPERATION_SUCCESS,
    USER_OPERATION_ERROR,
    TOGGLE_SIDEBAR,
    LOGOUT_USER,
    USER_UPDATE_BEGIN,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_ERROR,
} from './actions';
import { initialState } from './appContext';

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

        case USER_OPERATION_BEGIN:
        case USER_UPDATE_BEGIN:
            obj = {
                isLoading: true
            };
            return { ...toReturn, ...obj };

        case USER_OPERATION_SUCCESS:
        case USER_UPDATE_SUCCESS:
            obj = {
                isLoading: false,
                token: action.payload.token,
                user: action.payload.user,
                userLocation: action.payload.location,
                jobLocation: action.payload.location,
                showAlert: true,
                alertType: 'success',
                alertText: action.payload.alertText || 'User Profile Updated!',
            };
            return { ...toReturn, ...obj };

        case USER_OPERATION_ERROR:
        case USER_UPDATE_ERROR:
            obj = {
                isLoading: false,
                showAlert: true,
                alertType: 'danger',
                alertText: action.payload.msg,
            };
            return { ...toReturn, ...obj };

        case TOGGLE_SIDEBAR:
            obj = {
                showSidebar: !state.showSidebar
            };
            return { ...toReturn, ...obj };

        case LOGOUT_USER:
            obj = {
                token: null,
                user: null,
                userLocation: '',
                jobLocation: '',
            };
            return { ...initialState, ...obj }; // return everything to the initial state, not just the user,token & locations

        default:
            throw new Error(`[REDUCERS] action ${action.type} not found`);
    }
};

export default reducer;