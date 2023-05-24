import React from 'react';
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from 'react-icons/hi';

import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/PageBtnContainer';

const PaginationContainer = () => {
    const {
        numOfPages,
        page,
        changePage,
    } = useAppContext();
    const pages = Array.from({ length: numOfPages }, (_, index) => {
        return index + 1;
    });

    const nextPage = () => {
        let newPage = page + 1;

        if (newPage > numOfPages) {
            newPage = numOfPages;
        }

        changePage(newPage);
    };

    const prevPage = () => {
        let newPage = page - 1;

        if (newPage < 1) {
            newPage = 1;
        }

        changePage(newPage);
    };

    return (
        <Wrapper>
            <button className='prev-btn' onClick={prevPage}>
                <HiOutlineChevronDoubleLeft />
                prev
            </button>
            <div className='btn-container'>
                {pages.map((pageNumber) => {
                    return <button
                        className={pageNumber === page ? 'pageBtn active' : 'pageBtn'}
                        type='button'
                        key={pageNumber}
                        onClick={() => changePage(pageNumber)}>
                        {pageNumber}
                    </button>
                })}
            </div>

            <button className='next-btn' onClick={nextPage}>
                <HiOutlineChevronDoubleRight />
                next
            </button>
        </Wrapper>
    );
};

export default PaginationContainer;
