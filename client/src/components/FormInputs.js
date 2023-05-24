// in order to avoid copy paste for all the fields the user has to fill in (name, email, etc)

const FormInputs = ({ type, name, value, handleChange, labelText }) => {
    return (
        <div className='form-row'>
            <label htmlFor={name} className='form-label'>
                {labelText || name}
            </label>

            <input
                type={type}
                value={value}
                name={name}
                onChange={handleChange}
                className='form-input'
            />
        </div>
    );
};


export default FormInputs;