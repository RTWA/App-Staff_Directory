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
        <div className="flex flex-auto px-4 lg:px-10 py-4">
            <div className="w-full lg:w-3/12">
                <label className="block py-2">Select the department you wish to display</label>
            </div>
            <div className="w-full lg:w-9/12">
                <DepartmentSelect
                    index={0}
                    departments={departments}
                    selected={{ id: value }}
                    onChange={change} />
            </div>
        </div>
    )
}

export default DepartmentFilter;