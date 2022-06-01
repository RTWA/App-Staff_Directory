import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import { WebAppsUXContext } from 'webapps-react';

import './Select.css';

const DepartmentSelect = props => {
    const {
        departments,
        inputClassName,
        boxed,
    } = props;

    const { theme } = useContext(WebAppsUXContext);

    const onChange = selected => {
        let value = selected.value;

        departments.map(function (dep) {
            if (dep.id == value) {
                value = dep;
            }
            Object.keys(dep.children).map(function (c) {
                if (dep.children[c].id == value) {
                    value = dep.children[c];
                }
            });
        });
        props.onChange(value, props.index)
    }

    const options = () => {
        let value = [{ value: 'none', label: 'None' }];

        departments.map(function (dep) {
            value.push({
                value: dep.id,
                label: dep.name
            });

            Object.keys(dep.children).map(function (c) {
                value.push({
                    value: dep.children[c].id,
                    label: `${dep.name} - ${dep.children[c].name}`
                });
            });
        });
        return value;
    }

    const selected = () => {
        let value = [{ value: 'none', label: 'None' }];

        departments.map(function (dep) {
            if (props.selected.id == dep.id) {
                value = {
                    value: dep.id,
                    label: dep.name
                };
            }

            Object.keys(dep.children).map(function (c) {
                if (props.selected.id == dep.children[c].id) {
                    value = {
                        value: dep.children[c].id,
                        label: `${dep.name} - ${dep.children[c].name}`
                    };
                }
            });
        });
        return value;
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

    return <Select {...props} options={options()} onChange={onChange} value={selected()} className={inputClasses} classNamePrefix="input-select" />
}

DepartmentSelect.propTypes = {
    boxed: PropTypes.bool
}

DepartmentSelect.defaultProps = {
    boxed: true,
}

export default DepartmentSelect;