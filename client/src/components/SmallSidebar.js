import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import Wrapper from '../assets/wrappers/SmallSidebar';
import Logo from './Logo';
import { useAppContext } from '../context/appContext';
import NavLinks from './NavLinks';

const SmallSidebar = () => {
    const {
        showSidebar,
        toggleSidebar
    } = useAppContext();

    return (
        <Wrapper>
            <div className={showSidebar ? 'sidebar-container show-sidebar' : 'sidebar-container'}>
                <div className='content'>
                    <button
                        className='close-btn'
                        type='button'
                        onClick={toggleSidebar}>
                        <AiOutlineCloseCircle />
                    </button>
                    <header>
                        <Logo />
                    </header>
                    <NavLinks toggleSidebar={toggleSidebar} />
                </div>
            </div>
        </Wrapper>
    );
};

export default SmallSidebar;
