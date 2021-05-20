import React from 'react';
import { CustomSelect } from '../Selects';

const CustomFilter = props => {
    const {
        custom,
        field,
        onChange,
        value
    } = props;

    if (!props.display) {
        return null;
    }

    const customField = () => {
        return Object(custom).map(function(_field) {
            if (_field.field === field) {
                return _field.options;
            }
        })
    }

    return (
        <div className="flex flex-auto px-4 lg:px-10 py-4">
            <div className="w-full lg:w-3/12">
                <label className="block py-2">Select the {custom.label} you wish to display</label>
            </div>
            <div className="w-full lg:w-9/12">
                <CustomSelect options={customField()} onChange={onChange} value={value} />
            </div>
        </div>
    )
}

export default CustomFilter;