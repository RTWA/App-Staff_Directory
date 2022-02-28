import React from 'react';
import classNames from 'classnames';
import { DepartmentSelect } from '../Selects';

const DepartmentFilter = props => {
    const {
        value,
        departments,
        onChange,
        labelClassName,
    } = props;

    const change = value => {
        onChange(value.id);
    }

    const labelClasses = classNames(
        'block',
        'mb-2',
        'text-sm',
        'font-medium',
        'text-gray-700',
        'dark:text-gray-300',
        labelClassName,
    )

    if (!props.display) {
        return null;
    }

    return (
        <div className="mb-6">
            <label className={labelClasses} htmlFor="department_select">Select the department you wish to display</label>
            <DepartmentSelect
                name="department_select"
                id="department_select"
                index={0}
                departments={departments}
                selected={{ id: value }}
                onChange={change} />
        </div>
    )
}

export default DepartmentFilter;