import React from 'react';
import { DepartmentSelect } from '../Selects';

const DepartmentFilter = props => {
    const {
        value,
        departments,
        onChange
    } = props;

    const change = value => {
        onChange(value.id);
    }

    if (!props.display) {
        return null;
    }

    return (
        <div className="w-full flex flex-col xl:flex-row py-4 px-4">
            <label className="w-full xl:w-4/12 xl:py-2 font-medium xl:font-normal text-sm xl:text-base" htmlFor="department_select">
                Select the department you wish to display
            </label>
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