import React from 'react';
import classNames from 'classnames';
import { PersonSelect } from '../Selects';

const PersonFilter = props => {
    const {
        people,
        onChange,
        value,
        labelClassName,
    } = props;

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
            <label className={labelClasses} htmlFor="person_select">Select the person you wish to display</label>
            <PersonSelect
                name="person_select"
                id="person_select"
                options={people}
                onChange={onChange}
                value={value} />
        </div>
    )
}

export default PersonFilter;