
/* used to populate the states with values received from appContext */

import {
    HIDE_ALERT,
    DISPLAY_ALERT,
    REGISTER_USER_BEGIN,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR
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
        default:
            throw new Error(`[REDUCERS] action ${action.type} not found`);
    }
};

// const reducer = (state, action) => { // TODO - use switch case
//     // console.log(action.type)''
//     if (action.type === DISPLAY_ALERT) {
//         console.log('[REDUCERS] action - display alert');
//         return {
//             ...state,
//             showAlert: true, // global state
//             alertType: 'danger',  // global state
//             alertText: 'Please provide all values!'  // global state
//         };
//     }

//     if (action.type === HIDE_ALERT) {
//         console.log('[REDUCERS] action - hide alert');
//         return {
//             ...state,
//             showAlert: false, // global state
//             alertType: '',  // global state
//             alertText: ''  // global state
//         };
//     }

//     if (action.type === REGISTER_USER_BEGIN) {
//         console.log('[REDUCERS] action - user registration begins');
//         return {
//             ...state,
//             isLoading: true
//         };
//     }

//     if (action.type === REGISTER_USER_SUCCESS) {
//         console.log('[REDUCERS] action - user registration success');
//         console.log(action)
//         return {
//             ...state,
//             isLoading: false,
//             token: action.payload.token,
//             user: action.payload.user,
//             userLocation: action.payload.location,
//             jobLocation: action.payload.location,
//             showAlert: true,
//             alertType: 'success',
//             alertText: 'User Created! Redirecting...',
//         };
//     }

//     if (action.type === REGISTER_USER_ERROR) {
//         console.log('[REDUCERS] action - user registration error');
//         return {
//             ...state,
//             isLoading: false,
//             showAlert: true,
//             alertType: 'danger',
//             alertText: action.payload.msg,
//         };
//     }

//     throw new Error(`[REDUCERS] action ${action.type} not found`);
// }

export default reducer;