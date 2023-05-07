import React from 'react';
import { HIDE_ALERT, DISPLAY_ALERT } from './actions';

const reducer = (state, action) => {
    // console.log(action.type)''
    if (action.type === DISPLAY_ALERT) {
        console.log('[REDUCERS] action - display');
        return {
            ...state,
            showAlert: true, // global state
            alertType: 'danger',  // global state
            alertText: 'Please provide all values!'  // global state
        };
    }

    if (action.type === HIDE_ALERT) {
        console.log('[REDUCERS] action - hide');
        return {
            ...state,
            showAlert: false, // global state
            alertType: '',  // global state
            alertText: ''  // global state
        };
    }

    throw new Error(`[REDUCERS] action ${action.type} not found`);
}

export default reducer;