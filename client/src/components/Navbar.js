import React from 'react';
import { useState } from 'react';
import { AiOutlineAlignLeft, AiOutlineUser, AiOutlineCaretDown } from 'react-icons/ai';

import Logo from './Logo';
import Wrapper from '../assets/wrappers/Navbar';
import { useAppContext } from '../context/appContext';

const Navbar = () => {
    const [showLogout, setShowLogout] = useState(false);
    const { user, toggleSidebar, logoutUser } = useAppContext();
    console.log(user)
    return (
        <Wrapper>
            <div className='nav-center'>
                <button className='toggle-btn' type='button' onClick={toggleSidebar}>
                    <AiOutlineAlignLeft />
                </button>
                <div>
                    <Logo />
                    <h3 className='logo-text'>Dashboard</h3>
                </div>
                <div className='btn-container'>
                    <button className='btn' type='button' onClick={() => setShowLogout(!showLogout)}>
                        <AiOutlineUser />
                        {user?.name}
                        <AiOutlineCaretDown />
                    </button>
                    <div className={showLogout ? 'dropdown show-dropdown' : 'dropdown'}>
                        <button className='dropdown-btn' type='button' onClick={logoutUser} >
                            logout
                        </button>
                    </div>
                </div>
            </div >
        </Wrapper >
    );
}

export default Navbar;
