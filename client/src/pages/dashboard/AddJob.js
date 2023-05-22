import React from 'react';

import { FormInputs, FormInputsSelect, Alert } from '../../components';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

const AddJob = () => {
    const {
        isEditing,
        isLoading,
        showAlert,
        displayAlert,
        position,
        company,
        jobLocation,
        jobType,
        jobTypeOptions,
        status,
        statusOptions,
        handleChange,
        clearValues,
        createJob,
        editJob,
    } = useAppContext();

    const handleJobInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        handleChange({ name, value });
    }

    const onSubmit = (event) => {
        event.preventDefault();

        if (!position || !company || !jobLocation) {
            displayAlert();
            return;
        }

        if (isEditing) {
            editJob();
            return;
        }

        const job = { position, company, jobLocation, jobType, status };
        createJob(job);
    }

    return (
        <Wrapper>
            <form className='form'>
                <h3>{isEditing ? 'edit job' : 'add job'}</h3>
                {showAlert && <Alert />}
                <div className='form-center'>
                    {/* position */}
                    <FormInputs type='text' name='position' value={position} handleChange={handleJobInput} />
                    {/* company */}
                    <FormInputs type='text' name='company' value={company} handleChange={handleJobInput} />
                    {/* job location */}
                    <FormInputs type='text' labelText='job location' name='jobLocation' value={jobLocation} handleChange={handleJobInput} />
                    {/* job status */}
                    <FormInputsSelect name='status' value={status} handleChange={handleJobInput} list={statusOptions} />
                    {/* job type  */}
                    <FormInputsSelect labelText='job type' value={jobType} handleChange={handleJobInput} list={jobTypeOptions} />
                    <div className='btn-container'>
                        <button className='btn btn-block submit-btn' type='submit' onClick={onSubmit} disabled={isLoading}>submit</button>
                        <button className='btn btn-block clear-btn' type='submit'
                            onClick={(e) => {
                                e.preventDefault()
                                clearValues()
                            }}>
                            clear
                        </button>
                    </div>
                </div>
            </form>
        </Wrapper>
    );
}

export default AddJob;
