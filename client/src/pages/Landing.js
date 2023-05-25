import React from 'react';
import { Link, Navigate } from 'react-router-dom';

import main from '../assets/images/main.svg';
import Wrapper from '../assets/wrappers/LandingPage';
import { Logo } from '../components';
import { useAppContext } from '../context/appContext';

const Landing = () => {
    const { user } = useAppContext();

    return (
        <React.Fragment>
            {/* when logged in, prevent the user to go to Landing page */}
            {user && <Navigate to='/' />}
            <Wrapper>
                <nav>
                    <Logo />
                </nav>
                <div className='container page'>
                    <div className='info'>
                        <h1>
                            job <span>tracking</span> app
                        </h1>
                        <p>
                            Bearing multiply two image created years day fourth of abundantly man creeping. Moving rule also fill whales living years earth can't multiply life there all face morning May was. Said have. Them beginning grass set isn't.
                        </p>
                        <Link to='/register' className='btn btn-hero'>Login/Register</Link>
                    </div>
                    <img src={main} alt='job hunt' className='img main-img' />
                </div>
            </Wrapper>
        </React.Fragment>
    );
};

export default Landing;
