import React from 'react';

const reducer = (state, action) => {
    throw new Error(`[Reducers] action ${action.type} not found`);
}

export default reducer;