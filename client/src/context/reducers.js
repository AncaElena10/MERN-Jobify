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
    HANDLE_CHANGE,
    CLEAR_VALUES,
    CREATE_JOB_BEGIN,
    CREATE_JOB_SUCCESS,
    CREATE_JOB_ERROR,
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
        case CREATE_JOB_BEGIN:
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
        case CREATE_JOB_ERROR:
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

        case HANDLE_CHANGE:
            obj = {
                [action.payload.name]: action.payload.value
            };
            return { ...toReturn, ...obj };

        case CLEAR_VALUES:
            obj = {
                isEditing: false,
                editJobId: '',
                position: '',
                company: '',
                jobType: 'full-time',
                status: 'pending',
                jobLocation: state.userLocation,
            };
            return { ...toReturn, ...obj };

        case CREATE_JOB_SUCCESS:
            obj = {
                isLoading: false,
                showAlert: true,
                alertType: 'success',
                alertText: 'New Job Created!',
            };
            return { ...toReturn, ...obj };

        default:
            throw new Error(`[REDUCERS] action ${action.type} not found`);
    }
};

export default reducer;