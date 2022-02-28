import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { CustomSelect } from '../Selects';

const CustomFilter = props => {
    const {
        custom,
        field,
        onChange,
        value,
        labelClassName,
    } = props;

    if (!props.display) {
        return null;
    }

    const [chosen, setChosen] = useState({});

    useEffect(() => {
        Object(custom).map(function (_field) {
            if (_field.field === field) {
                setChosen(_field);
            }
        });
    }, [field]);

    const customField = () => {
        let options = [];
        Object(custom).map(function (_field) {
            if (_field.field === field) {
                options = _field.options;
            }
        });
        return options;
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

    return (
        <div className="mb-6">
            <label className={labelClasses}  htmlFor="custom_select">Select the {chosen.label} you wish to display</label>
            <CustomSelect
                name="custom_select"
                id="custom_select"
                options={customField()}
                onChange={onChange}
                value={value} />
        </div>
    )
}

export default CustomFilter;