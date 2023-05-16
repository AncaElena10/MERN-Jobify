/* used by both Small and Big Sidebard */

import React from 'react';
import { NavLink } from 'react-router-dom';

import links from '../utils/links';

const NavLinks = ({ toggleSidebar }) => {
    return (
        <div className='nav-links'>
            {
                links.map((link) => {
                    const { text, path, id, icon } = link

                    return (
                        <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to={path} key={id} onClick={toggleSidebar}>
                            <span className='icon'>{icon}</span>
                            {text}
                        </NavLink>
                    );
                })
            }
        </div>
    );
};

export default NavLinks;
