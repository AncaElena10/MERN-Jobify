import React from 'react';
import { useEffect } from 'react';

import { useAppContext } from '../context/appContext';
import Loading from './Loading';
import Job from './Job';
import Wrapper from '../assets/wrappers/JobsContainer';
import PaginationContainer from './PaginationContainer';

const JobsContainer = () => {
    const {
        getJobs,
        jobs,
        isLoading,
        page,
        totalJobs,
        search,
        filterByStatus,
        filterByJobType,
        sort,
        numOfPages
    } = useAppContext();

    useEffect(() => {
        getJobs();
    }, [page, search, filterByJobType, filterByStatus, sort]); // call get jobs everytime one of these values changes

    if (isLoading) {
        return <Loading center />
    }

    if (!jobs.length) {
        return (
            <Wrapper>
                <h2>No jobs to display...</h2>
            </Wrapper>);
    }

    return (
        <Wrapper>
            <h5>{totalJobs} job{jobs.length > 1 && 's'} found</h5>
            <div className='jobs'>
                {jobs.map((job) => {
                    return <Job key={job._id} {...job} />
                })}
            </div>
            {numOfPages > 1 && <PaginationContainer />}

        </Wrapper>
    );
};

export default JobsContainer;
