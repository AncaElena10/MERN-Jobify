import React from 'react';
import { MdOutlinePendingActions, MdOutlineBugReport } from 'react-icons/md';
import { GiDiscussion } from 'react-icons/gi';

import StatItem from './StatItem';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/StatsContainer';

const StatsContainer = () => {
    const { statistics } = useAppContext();

    const defaultStats = [
        {
            title: 'pending applications',
            count: statistics.pending || 0,
            icon: <MdOutlinePendingActions />,
            color: '#e9b949',
            bcg: '#fcefc7',
        },
        {
            title: 'interviews scheduled',
            count: statistics.interview || 0,
            icon: <GiDiscussion />,
            color: '#647acb',
            bcg: '#e0e8f9',
        },
        {
            title: 'jobs declined',
            count: statistics.declined || 0,
            icon: <MdOutlineBugReport />,
            color: '#d66a6a',
            bcg: '#ffeeee',
        },
    ]

    return (
        <Wrapper>
            {defaultStats.map((item, index) => {
                return <StatItem key={index} {...item} />
            })}
        </Wrapper>
    );
};

export default StatsContainer;
