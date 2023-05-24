import React from 'react';
import { Outlet } from 'react-router-dom';

import Wrapper from '../../assets/wrappers/SharedLayout';
import { Navbar, BigSidebar, SmallSidebar } from '../../components';

const SharedLayout = () => {
    return (
        <Wrapper>
            <main className='dashboard'>
                <SmallSidebar></SmallSidebar>
                <BigSidebar></BigSidebar>
                <div>
                    <Navbar />
                    <div className='dashboard-page'>
                        <Outlet />
                    </div>
                </div>
            </main>
        </Wrapper>
    );
};

export default SharedLayout;
