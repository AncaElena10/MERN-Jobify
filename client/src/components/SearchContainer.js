import React from 'react';

import { FormInputs, FormInputsSelect } from '.';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/SearchContainer';

const SearchContainer = () => {
    const {
        isLoading,
        search,
        filterByStatus,
        filterByJobType,
        sort,
        sortOptions,
        handleChange,
        clearFilters,
        jobTypeOptions,
        statusOptions
    } = useAppContext();

    const handleSearch = (e) => {
        // optional
        // if (isLoading) {
        //     return;
        // }
        handleChange({
            name: e.target.name,
            value: e.target.value
        })
    };

    const onSubmit = (e) => {
        e.preventDefault();
        clearFilters();
    };

    return (
        <Wrapper>
            <form className='form'>
                <h4>search form</h4>
                <div className='form-center'>
                    {/* search position */}
                    <FormInputs type='text' labelText='search position' name='search' value={search} handleChange={handleSearch} />
                    {/* filter status */}
                    <FormInputsSelect labelText='status' name='filterByStatus' value={filterByStatus} handleChange={handleSearch} list={['all', ...statusOptions]} />
                    {/* filter jobType */}
                    <FormInputsSelect labelText='job type' name='filterByJobType' value={filterByJobType} handleChange={handleSearch} list={['all', ...jobTypeOptions]} />
                    {/* sort */}
                    <FormInputsSelect name='sort' value={sort} handleChange={handleSearch} list={sortOptions} />
                    <button
                        className='btn btn-block btn-danger'
                        disabled={isLoading}
                        onClick={onSubmit}
                    >
                        clear filters
                    </button>
                </div>
            </form>
        </Wrapper>
    );
};

export default SearchContainer;
