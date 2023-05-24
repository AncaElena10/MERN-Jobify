import React from 'react';
import { useState, useMemo } from 'react';

import { FormInputs, FormInputsSelect } from '.';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/SearchContainer';

const SearchContainer = () => {
    const [localSearch, setLocalSearch] = useState('');
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
        handleChange({
            name: e.target.name,
            value: e.target.value
        })
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setLocalSearch('');
        clearFilters();
    };

    // keep clearing the previous timeout and execute the handleChange 
    // 1 second after the last update (in this case the last key press)
    const debounce = () => {
        let timeoutID;
        return (e) => {
            setLocalSearch(e.target.value);
            clearTimeout(timeoutID);
            timeoutID = setTimeout(() => {
                handleChange({
                    name: e.target.name,
                    value: e.target.value
                });
            }, 1000);
        };
    };

    // use memo for whatever is returning the debounce(), which is setLocalSearch(e)
    // only run that once, when the app loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const optimizedDebounce = useMemo(() => debounce(), []);

    return (
        <Wrapper>
            <form className='form'>
                <h4>search form</h4>
                <div className='form-center'>
                    {/* search position */}
                    <FormInputs type='text' labelText='search position' name='search' value={localSearch} handleChange={optimizedDebounce} />
                    {/* filter status */}
                    <FormInputsSelect labelText='status' name='filterByStatus' value={filterByStatus} handleChange={handleSearch} list={['all', ...statusOptions]} />
                    {/* filter jobType */}
                    <FormInputsSelect labelText='job type' name='filterByJobType' value={filterByJobType} handleChange={handleSearch} list={['all', ...jobTypeOptions]} />
                    {/* sort */}
                    <FormInputsSelect name='sort' value={sort} handleChange={handleSearch} list={sortOptions} />
                    <button
                        className='btn btn-block btn-danger'
                        disabled={isLoading}
                        onClick={onSubmit}>
                        clear filters
                    </button>
                </div>
            </form>
        </Wrapper>
    );
};

export default SearchContainer;
