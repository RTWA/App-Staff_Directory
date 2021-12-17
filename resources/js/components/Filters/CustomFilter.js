import React, { useEffect, useState } from 'react';
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

    return (
        <div className="w-full flex flex-col xl:flex-row py-4 px-4">
            <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="custom_select">
                Select the {chosen.label} you wish to display
            </label>
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