import React, { useState } from 'react';

import ChartBar from './ChartBar';
import ChartArea from './ChartArea';
// instead of sending the context in both components ^, send it as a props
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/ChartsContainer';

const ChartsContainer = () => {
    const [barChart, setBarChart] = useState(true);
    const { monthlyApplications } = useAppContext();

    return (
        <Wrapper>
            <h4>Monthly Applications</h4>
            <button
                type='button'
                onClick={() => setBarChart(!barChart)}>
                {!barChart ? 'Bar Chart' : 'Area Chart'}
            </button>
            {barChart ? <ChartBar data={monthlyApplications} /> : <ChartArea data={monthlyApplications} />}

        </Wrapper>
    );
};

export default ChartsContainer;
