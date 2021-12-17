import React from 'react';
import Select from 'react-select';

import './Select.css';

const CustomSelect = props => {
    const {
        value,
        options,
        onChange
    } = props;

    const _options = () => {
        const data = [];
        Object.keys(options).map(function (i) {
            data.push({ value: i, label: options[i] });
        });
        return data;
    }

    const getValue = () => {
        let _value = {};
        Object.keys(options).map(function (i) {
            if (i === value) {
                _value = { value: i, label: options[i] };
            }
        });
        return _value;
    }

    return <Select {...props} options={_options()} onChange={onChange} value={getValue()} className="input-field" classNamePrefix="input-select" />
}

export default CustomSelect;