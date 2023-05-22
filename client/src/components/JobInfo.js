import React from 'react';

import Wrapper from '../assets/wrappers/JobInfo';

const JobInfo = ({ text, icon }) => {
    return (
        <Wrapper>
            <span className='icon'>{icon}</span>
            <span className='text'>{text}</span>
        </Wrapper>
    );
};

export default JobInfo;
