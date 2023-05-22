import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineCalendar } from 'react-icons/hi';

import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/Job';
import JobInfo from './JobInfo';

const Job = ({ _id, position, company, jobLocation, jobType, createdAt, status }) => {
    let date = moment(createdAt);
    date = date.format('MMM Do, YYYY');

    const {
        setEditJob,
        deleteJob
    } = useAppContext();

    return (
        <Wrapper>
            <header>
                <div className='main-icon'>
                    {company.charAt(0)}
                </div>
                <div className='info'>
                    <h5>{position}</h5>
                    <p>{company}</p>
                </div>
            </header>
            <div className='content'>
                <div className='content-center'>
                    <JobInfo icon={<HiOutlineLocationMarker />} text={jobLocation} />
                    <JobInfo icon={<HiOutlineCalendar />} text={date} />
                    <JobInfo icon={<HiOutlineBriefcase />} text={jobType} />
                    <div className={`status ${status}`}>
                        {status}
                    </div>
                </div>
                <footer>
                    <div className='actions'>
                        <Link
                            className='btn edit-btn'
                            to='/add-job'
                            onClick={() => setEditJob(_id)}>
                            Edit
                        </Link>
                        <button
                            className='btn btn-delete'
                            type='button'
                            onClick={() => deleteJob(_id)}>
                            Delete
                        </button>
                    </div>
                </footer>
            </div>
        </Wrapper>
    );
};

export default Job;
