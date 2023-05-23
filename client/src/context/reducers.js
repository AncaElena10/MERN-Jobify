/* used to populate the states with values received from appContext */

import {
    OtherActions,
    UserActions,
    JobsAction
} from './actions';
import { initialState } from './appContext';

const reducer = (state, action) => {
    let toReturn = {
        ...state,
    };
    let obj;
    switch (action.type) {
        case OtherActions.DISPLAY_ALERT:
            obj = {
                showAlert: true, // global state
                alertType: 'danger',  // global state
                alertText: 'Please provide all values!'  // global state
            };
            return { ...toReturn, ...obj };

        case OtherActions.HIDE_ALERT:
            obj = {
                showAlert: false, // global state
                alertType: '',  // global state
                alertText: ''  // global state
            };
            return { ...toReturn, ...obj };

        case UserActions.USER_OPERATION_BEGIN:
        case UserActions.USER_UPDATE_BEGIN:
        case JobsAction.CREATE_JOB_BEGIN:
        case JobsAction.DELETE_JOB_BEGIN:
        case JobsAction.EDIT_JOB_BEGIN:
        case OtherActions.SHOW_STATS_BEGIN:
            obj = {
                isLoading: true
            };
            return { ...toReturn, ...obj };

        case UserActions.USER_OPERATION_SUCCESS:
        case UserActions.USER_UPDATE_SUCCESS:
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

        case UserActions.USER_OPERATION_ERROR:
        case UserActions.USER_UPDATE_ERROR:
        case JobsAction.CREATE_JOB_ERROR:
        case JobsAction.EDIT_JOB_ERROR:
            obj = {
                isLoading: false,
                showAlert: true,
                alertType: 'danger',
                alertText: action.payload.msg,
            };
            return { ...toReturn, ...obj };

        case OtherActions.TOGGLE_SIDEBAR:
            obj = {
                showSidebar: !state.showSidebar
            };
            return { ...toReturn, ...obj };

        case UserActions.LOGOUT_USER:
            obj = {
                token: null,
                user: null,
                userLocation: '',
                jobLocation: '',
            };
            return { ...initialState, ...obj }; // return everything to the initial state, not just the user,token & locations

        case OtherActions.HANDLE_CHANGE:
            obj = {
                [action.payload.name]: action.payload.value
            };
            return { ...toReturn, ...obj };

        case OtherActions.CLEAR_VALUES:
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

        case JobsAction.CREATE_JOB_SUCCESS:
            obj = {
                isLoading: false,
                showAlert: true,
                alertType: 'success',
                alertText: 'New Job Created!',
            };
            return { ...toReturn, ...obj };

        case JobsAction.GET_JOBS_BEGIN:
            obj = {
                isLoading: true,
                showAlert: false,
            };
            return { ...toReturn, ...obj };

        case JobsAction.GET_JOBS_SUCCESS:
            obj = {
                isLoading: false,
                jobs: action.payload.jobs,
                totalJobs: action.payload.totalJobs,
                numOfPages: action.payload.numOfPages,
            };
            return { ...toReturn, ...obj };

        case OtherActions.SET_EDIT_JOB:
            const job = state.jobs.find((job) => job._id === action.payload.id);
            obj = {
                isEditing: true,
                editJobId: job._id,
                position: job.position,
                company: job.company,
                jobLocation: job.jobLocation,
                jobType: job.jobType,
                status: job.status,
            };
            return { ...toReturn, ...obj };

        case JobsAction.EDIT_JOB_SUCCESS:
            obj = {
                isLoading: false,
                showAlert: true,
                alertType: 'success',
                alertText: 'Job Updated!',
            };
            return { ...toReturn, ...obj };

        case OtherActions.SHOW_STATS_SUCCESS:
            obj = {
                isLoading: false,
                statistics: action.payload.statistics,
                monthlyApplications: action.payload.monthlyApplications,
            };
            return { ...toReturn, ...obj };

        case OtherActions.CLEAR_FILTERS:
            obj = {
                search: '',
                filterByStatus: 'all',
                filterByJobType: 'all',
                sort: 'latest',
            };
            return { ...toReturn, ...obj };

        default:
            throw new Error(`[REDUCERS] action ${action.type} not found`);
    }
};

export default reducer;