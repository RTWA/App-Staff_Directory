import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import { WebAppsContext } from 'webapps-react';

import './Select.css';

const CustomSelect = props => {
    const {
        value,
        options,
        onChange,
        inputClassName,
        boxed,
    } = props;

    const { UI } = useContext(WebAppsContext);

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

    const boxedInputClasses = classNames(
        (boxed) ? 'border-2' : null,
        (boxed) ? 'border-gray-300' : null,
        (boxed) ? 'dark:border-gray-600' : null,
        (boxed) ? `focus:ring-${UI.theme}-600` : null,
        (boxed) ? `dark:focus:ring-${UI.theme}-500` : null,
        (boxed) ? `focus:border-${UI.theme}-600` : null,
        (boxed) ? `dark:focus:border-${UI.theme}-500` : null,
    )

    const inputClasses = classNames(
        'bg-gray-50',
        'text-gray-900',
        'outline-none',
        'text-sm',
        'rounded-lg',
        'block',
        'w-full',
        'dark:bg-gray-700',
        'dark:placeholder-gray-400',
        'dark:text-white',
        boxedInputClasses,
        inputClassName,
    )

    return <Select {...props} options={_options()} onChange={onChange} value={getValue()} className={inputClasses} classNamePrefix="input-select" />
}

CustomSelect.propTypes = {
    boxed: PropTypes.bool
}

CustomSelect.defaultProps = {
    boxed: true,
}

export default CustomSelect;