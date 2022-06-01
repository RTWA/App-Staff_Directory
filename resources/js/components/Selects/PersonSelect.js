import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import { WebAppsUXContext } from 'webapps-react';

import './Select.css';

const PersonSelect = props => {
    const {
        value,
        options,
        onChange,
        inputClassName,
        boxed,
    } = props;

    const { theme } = useContext(WebAppsUXContext);

    const getValue = () => {
        let _value = {};
        Object(options).map(function(person){
            if (person.value === value) {
                _value = person;
            }
        });
        return _value;
    }

    const boxedInputClasses = classNames(
        (boxed) ? 'border-2' : null,
        (boxed) ? 'border-gray-300' : null,
        (boxed) ? 'dark:border-gray-600' : null,
        (boxed) ? `focus:ring-${theme}-600` : null,
        (boxed) ? `dark:focus:ring-${theme}-500` : null,
        (boxed) ? `focus:border-${theme}-600` : null,
        (boxed) ? `dark:focus:border-${theme}-500` : null,
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

    return <Select {...props} options={options} onChange={onChange} value={getValue()} className={inputClasses} classNamePrefix="input-select" />
}

PersonSelect.propTypes = {
    boxed: PropTypes.bool
}

PersonSelect.defaultProps = {
    boxed: true,
}

export default PersonSelect;