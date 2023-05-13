import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Wrapper from '../assets/wrappers/RegisterPage';

import { useAppContext } from '../context/appContext';
import { Logo, FormInputs, Alert } from '../components';

// set the dafualt states
const initialState = {
    name: '',
    email: '',
    password: '',
    hasAccount: true,
    // showAlert: false, - delete this local init and switch to a global state
};

const Register = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState(initialState);
    // global state
    const { user, isLoading, showAlert, displayAlert, setupUser } = useAppContext(); // from appContext.js

    const toggleHasAccount = () => {
        setValues({ ...values, hasAccount: !values.hasAccount });
        // console.log(values.hasAccount)
    };

    const handleChange = (event) => {
        // fill in the states with whatever the user is typing inside the inputs
        setValues({ ...values, [event.target.name]: event.target.value });
        // console.log(event.target);
    };

    const onSubmit = (event) => {
        event.preventDefault();
        // console.log(event.target);

        // grab values from states and destructure them
        const { name, email, password, hasAccount } = values;
        if (!email || !password || (!hasAccount && !name)) {
            displayAlert();
            return;
        }

        const currentUser = { name, email, password };
        if (hasAccount) {
            console.log('[REGISTER] Already has an account'); // TODO - create general config/constants for tags&others
            setupUser({ currentUser, endpoint: 'login', alertText: 'Login Successful! Redirecting...' });
        } else {
            console.log('[REGISTER] User does not have an accout.');
            setupUser({ currentUser, endpoint: 'register', alertText: 'Account created! Redirecting...' });
        }
    };

    useEffect(() => {
        // console.log(user)
        if (user) { // if user does exist
            setTimeout(() => {
                navigate('/');
            }, 3000);
        }
    }, [user, navigate]); // use this everytime the user or navigate changes

    return (
        <Wrapper className='full-page'>
            <form className='form' onSubmit={onSubmit}>
                <Logo />
                <h3>{values.hasAccount ? 'Login' : 'Register'}</h3>
                {showAlert && <Alert />}
                {/* name input - only display if the user does not have an account */}
                {!values.hasAccount &&
                    (<FormInputs
                        type='text'
                        name='name'
                        alue={values.name}
                        handleChange={handleChange}
                    />)
                }
                {/* email input */}
                <FormInputs
                    type='email'
                    name='email'
                    alue={values.email}
                    handleChange={handleChange}
                />
                {/* password input */}
                <FormInputs
                    type='password'
                    name='password'
                    alue={values.password}
                    handleChange={handleChange}
                />
                <button type='submit' className='btn btn-block' disabled={isLoading}>Submit</button>
                <p>
                    {values.hasAccount ? 'Not a member yet?' : 'Already a member?'}
                    <button
                        type='button'
                        onClick={toggleHasAccount}
                        className='member-btn'>
                        {values.hasAccount ? 'Register' : 'Login'}
                    </button>
                </p>
            </form>
        </Wrapper>
    );
};

export default Register;
