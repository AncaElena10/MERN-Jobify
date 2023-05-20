import React from 'react';
import { useState } from 'react';

import { FormInputs, Alert } from '../../components';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/DashboardFormPage';

const Profile = () => {
    const { user, showAlert, displayAlert, updateUser, isLoading } = useAppContext();
    const [name, setName] = useState(user?.name);
    const [lastName, setlastName] = useState(user?.lastName);
    const [email, setEmail] = useState(user?.email);
    const [location, setLocation] = useState(user?.location);

    const onSubmit = (e) => {
        e.preventDefault();

        if (!name || !email || !lastName || !location) {
            displayAlert();
            return;
        }

        const updatedUser = { name, email, lastName, location };
        updateUser(updatedUser);
    };

    return (
        <Wrapper>
            <form className='form' onSubmit={onSubmit}>
                <h3>profile</h3>
                {showAlert && <Alert />}
                <div className='form-center'>
                    <FormInputs type='text' name='name' value={name} handleChange={(e) => setName(e.target.value)} />
                    <FormInputs type='text' name='lastName' labelText='last name' value={lastName} handleChange={(e) => setlastName(e.target.value)} />
                    <FormInputs type='text' name='email' value={email} handleChange={(e) => setEmail(e.target.value)} />
                    <FormInputs type='text' name='location' value={location} handleChange={(e) => setLocation(e.target.value)} />
                    <button className='btn btn-block' type='submit' disabled={isLoading}>
                        {isLoading ? 'Please wait...' : 'Save changes'}
                    </button>
                </div>
            </form>
        </Wrapper>
    );
};

export default Profile;
