import React from 'react';

const FormInputsSelect = ({ labelText, name, value, handleChange, list }) => {
    return (
        <div className='form-row'>
            <label className='form-label' htmlFor={name}>
                {labelText || name}
            </label>
            <select className='form-select' name={name} value={value} onChange={handleChange}>
                {list.map((itemValue, index) => {
                    return (
                        <option key={index} value={itemValue}>
                            {itemValue}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default FormInputsSelect;
