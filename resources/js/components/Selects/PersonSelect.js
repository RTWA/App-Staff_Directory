import React from 'react';
import Select from 'react-select';

import './Select.css';

const PersonSelect = props => {
    const {
        value,
        options,
        onChange
    } = props;

    const getValue = () => {
        let _value = {};
        Object(options).map(function(person){
            if (person.value === value) {
                _value = person;
            }
        });
        return _value;
    }

    return <Select {...props} options={options} onChange={onChange} value={getValue()} className="input-field" classNamePrefix="input-select" />
}

export default PersonSelect;